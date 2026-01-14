import type { Chord } from '@/types/chord'

// Note: Tone.js is imported dynamically to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type ToneType = typeof import('tone')
let Tone: ToneType | null = null

// ============================================================================
// AUDIO SERVICE - Singleton for chord playback
// ============================================================================

class AudioService {
  private static instance: AudioService
  private synth: InstanceType<ToneType['PolySynth']> | null = null
  private initialized = false
  private bpm = 120
  private isPlaying = false
  private stopRequested = false

  private constructor() {}

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService()
    }
    return AudioService.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    // Dynamic import for client-side only
    if (typeof window === 'undefined') return

    Tone = await import('tone')

    // Create a polyphonic synth for playing chords
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle8',
      },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2,
      },
    }).toDestination()

    this.synth.volume.value = -6 // Reduce volume slightly

    this.initialized = true
  }

  async startAudioContext(): Promise<void> {
    if (!Tone) return
    await Tone.start()
  }

  setBpm(bpm: number): void {
    this.bpm = Math.max(40, Math.min(300, bpm))
    if (Tone) {
      Tone.getTransport().bpm.value = this.bpm
    }
  }

  getBpm(): number {
    return this.bpm
  }

  /**
   * Convert chord to playable note names (e.g., ["C4", "E4", "G4"])
   */
  chordToNotes(chord: Chord): string[] {
    const { note, chromatic, tonality } = chord

    // Base note at octave 4
    let root = note
    if (chromatic === '♯') root += '#'
    else if (chromatic === '♭') root += 'b'
    root += '3' // Start at octave 3 for fuller sound

    // Intervals for different chord types
    const intervals: Record<string, number[]> = {
      major: [0, 4, 7],
      minor: [0, 3, 7],
      diminished: [0, 3, 6],
      augmented: [0, 4, 8],
      'major seventh': [0, 4, 7, 11],
      'minor seventh': [0, 3, 7, 10],
      'dominant seventh': [0, 4, 7, 10],
      'diminished seventh': [0, 3, 6, 9],
      sus2: [0, 2, 7],
      sus4: [0, 5, 7],
    }

    const chordIntervals = intervals[tonality] || intervals.major

    // Convert intervals to note names using Tone.js frequency utilities
    const notes: string[] = []
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    // Get root note index
    let rootNoteName = note
    if (chromatic === '♯') rootNoteName = note + '#'
    else if (chromatic === '♭') {
      // Convert flat to sharp equivalent
      const flatToSharp: Record<string, string> = {
        'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B'
      }
      rootNoteName = flatToSharp[note + 'b'] || note
    }

    const rootIndex = noteNames.indexOf(rootNoteName)
    if (rootIndex === -1) return [root] // Fallback

    for (const interval of chordIntervals) {
      const noteIndex = (rootIndex + interval) % 12
      const octave = 3 + Math.floor((rootIndex + interval) / 12)
      notes.push(noteNames[noteIndex] + octave)
    }

    return notes
  }

  /**
   * Play a single chord
   */
  async playChord(chord: Chord, duration: string = '2n'): Promise<void> {
    if (!this.synth || !Tone) {
      await this.initialize()
      if (!this.synth || !Tone) return
    }

    await this.startAudioContext()

    const notes = this.chordToNotes(chord)
    this.synth.triggerAttackRelease(notes, duration)
  }

  /**
   * Play a progression of chords with timing
   */
  async playProgression(
    chords: Chord[],
    beatsPerChord: number = 4,
    onChordChange?: (index: number) => void
  ): Promise<void> {
    if (chords.length === 0) return

    if (!this.synth || !Tone) {
      await this.initialize()
      if (!this.synth || !Tone) return
    }

    await this.startAudioContext()

    this.isPlaying = true
    this.stopRequested = false

    const msPerBeat = (60 / this.bpm) * 1000
    const chordDuration = msPerBeat * beatsPerChord

    for (let i = 0; i < chords.length; i++) {
      if (this.stopRequested) break

      onChordChange?.(i)
      const notes = this.chordToNotes(chords[i])
      this.synth.triggerAttackRelease(notes, `${beatsPerChord}n`)

      await new Promise(resolve => setTimeout(resolve, chordDuration))
    }

    this.isPlaying = false
    onChordChange?.(-1) // Signal end
  }

  /**
   * Play a click/metronome beat
   */
  async playMetronomeBeat(isDownbeat: boolean = false): Promise<void> {
    if (!Tone) {
      await this.initialize()
      if (!Tone) return
    }

    await this.startAudioContext()

    const synth = new Tone.MembraneSynth().toDestination()
    synth.triggerAttackRelease(isDownbeat ? 'C3' : 'G3', '32n')
  }

  /**
   * Start a metronome that runs independently
   */
  async startMetronome(
    beatsPerMeasure: number = 4,
    onBeat?: (beat: number) => void
  ): Promise<void> {
    if (!Tone) {
      await this.initialize()
      if (!Tone) return
    }

    await this.startAudioContext()

    this.isPlaying = true
    this.stopRequested = false

    let beat = 0
    const msPerBeat = (60 / this.bpm) * 1000

    while (!this.stopRequested) {
      const isDownbeat = beat % beatsPerMeasure === 0
      await this.playMetronomeBeat(isDownbeat)
      onBeat?.(beat % beatsPerMeasure)
      beat++
      await new Promise(resolve => setTimeout(resolve, msPerBeat))
    }

    this.isPlaying = false
  }

  /**
   * Stop any playing audio
   */
  stop(): void {
    this.stopRequested = true
    if (this.synth) {
      this.synth.releaseAll()
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }
}

export default AudioService
