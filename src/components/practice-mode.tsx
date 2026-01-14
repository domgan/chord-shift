'use client'

import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { generateLabel } from '@/features/generate-chord-info'
import { useAudio } from '@/hooks/use-audio'
import { useWorkspaceStore } from '@/store/workspace-store'
import type { Chord } from '@/types/chord'
import GuitarChordDiagram from './guitar-chord-diagram'

export default function PracticeMode() {
  const workspace = useWorkspaceStore((state) => state.workspace)
  const setShowPracticeMode = useWorkspaceStore((state) => state.setShowPracticeMode)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentChordIndex, setCurrentChordIndex] = useState(0)
  const [bpm, setBpm] = useState(80)
  const [beatsPerChord, setBeatsPerChord] = useState(4)
  const [isMuted, setIsMuted] = useState(false)

  const { playChord, playProgression, stop, setBpm: setAudioBpm } = useAudio()

  // Flatten all chords from all builders for practice
  const allChords: Array<{ chord: Chord; builderName: string }> = useMemo(() =>
    workspace.flatMap((ws) =>
      ws.element.chords.map((chord) => ({
        chord,
        builderName: ws.element.name || 'Chord Progression',
      }))
    ), [workspace])

  const currentItem = allChords[currentChordIndex]

  // Update audio BPM when it changes
  useEffect(() => {
    setAudioBpm(bpm)
  }, [bpm, setAudioBpm])

  const playCurrentChord = () => {
    if (!currentItem || isMuted) return
    void playChord(currentItem.chord)
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      stop()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      const chords = allChords.map((item) => item.chord)
      await playProgression(
        chords.slice(currentChordIndex),
        beatsPerChord,
        (index) => {
          if (index >= 0) {
            setCurrentChordIndex(currentChordIndex + index)
          } else {
            setIsPlaying(false)
          }
        }
      )
    }
  }

  const handlePrevious = () => {
    if (currentChordIndex > 0) {
      setCurrentChordIndex(currentChordIndex - 1)
      if (!isPlaying) {
        playCurrentChord()
      }
    }
  }

  const handleNext = () => {
    if (currentChordIndex < allChords.length - 1) {
      setCurrentChordIndex(currentChordIndex + 1)
      if (!isPlaying) {
        playCurrentChord()
      }
    }
  }

  const handleChordClick = (index: number) => {
    setCurrentChordIndex(index)
    if (!isMuted && allChords[index]) {
      void playChord(allChords[index].chord)
    }
  }

  if (allChords.length === 0) {
    return (
      <Dialog open onOpenChange={() => setShowPracticeMode(false)}>
        <DialogContent className="sm:max-w-md glass-strong">
          <DialogHeader>
            <DialogTitle>Practice Mode</DialogTitle>
            <DialogDescription>
              Add some chords to your builders first to start practicing!
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowPracticeMode(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={() => setShowPracticeMode(false)}>
      <DialogContent className="sm:max-w-2xl glass-strong">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                Practice Mode
                <Badge variant="outline" className="font-mono">
                  {bpm} BPM
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Practice your chord progressions with audio playback
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </DialogHeader>

        {/* Current Chord Display */}
        <div className="py-6">
          {currentItem && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {currentItem.builderName}
              </div>

              {/* Big chord display */}
              <div className="h-40 w-48 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                <span className="text-6xl font-bold text-white drop-shadow-lg">
                  {generateLabel(currentItem.chord)}
                </span>
              </div>

              {/* Guitar diagram */}
              <GuitarChordDiagram chord={currentItem.chord} size="md" />

              <div className="text-sm text-muted-foreground">
                Chord {currentChordIndex + 1} of {allChords.length}
              </div>
            </div>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentChordIndex === 0}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            size="lg"
            className="h-14 w-14 rounded-full"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentChordIndex === allChords.length - 1}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* BPM & Beats per chord controls */}
        <div className="space-y-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">Tempo</span>
            <Slider
              value={[bpm]}
              onValueChange={([value]) => setBpm(value)}
              min={40}
              max={200}
              step={5}
              className="flex-1"
            />
            <span className="text-sm font-mono w-16 text-right">{bpm} BPM</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">Beats</span>
            <Slider
              value={[beatsPerChord]}
              onValueChange={([value]) => setBeatsPerChord(value)}
              min={1}
              max={8}
              step={1}
              className="flex-1"
            />
            <span className="text-sm font-mono w-16 text-right">{beatsPerChord}/chord</span>
          </div>
        </div>

        {/* Chord timeline */}
        <div className="flex flex-wrap gap-2 justify-center py-4 border-t border-white/10">
          {allChords.map((item, index) => (
            <button
              key={item.chord.id}
              onClick={() => handleChordClick(index)}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                index === currentChordIndex
                  ? 'bg-violet-500 text-white scale-110'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {generateLabel(item.chord)}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
