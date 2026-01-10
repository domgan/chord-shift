import { describe, expect, test } from 'bun:test'
import {
  generateLabel,
  generateNotes,
} from '../../src/features/generate-chord-info'
import type { Chord } from '../../src/types/chord'

const createChord = (
  note: string,
  chromatic: string,
  tonality: string
): Chord => ({
  id: 'test-id',
  note,
  chromatic,
  tonality,
})

describe('generateLabel', () => {
  test('generates label for major chord', () => {
    const chord = createChord('C', '', 'major')
    expect(generateLabel(chord)).toBe('C')
  })

  test('generates label for minor chord', () => {
    const chord = createChord('A', '', 'minor')
    expect(generateLabel(chord)).toBe('Am')
  })

  test('generates label for sharp chord', () => {
    const chord = createChord('F', '♯', 'major')
    expect(generateLabel(chord)).toBe('F♯')
  })

  test('generates label for flat chord', () => {
    const chord = createChord('B', '♭', 'minor')
    expect(generateLabel(chord)).toBe('B♭m')
  })

  test('generates label for seventh chord', () => {
    const chord = createChord('G', '', 'dominant seventh')
    expect(generateLabel(chord)).toBe('G7')
  })

  test('generates label for major seventh chord', () => {
    const chord = createChord('C', '', 'major seventh')
    expect(generateLabel(chord)).toBe('CM7')
  })

  test('generates label for diminished chord', () => {
    const chord = createChord('B', '', 'diminished')
    expect(generateLabel(chord)).toBe('Bdim')
  })

  test('generates label for augmented chord', () => {
    const chord = createChord('C', '', 'augmented')
    expect(generateLabel(chord)).toBe('Caug')
  })

  test('generates label for sus2 chord', () => {
    const chord = createChord('D', '', 'sus2')
    expect(generateLabel(chord)).toBe('Dsus2')
  })

  test('generates label for sus4 chord', () => {
    const chord = createChord('A', '', 'sus4')
    expect(generateLabel(chord)).toBe('Asus4')
  })
})

describe('generateNotes', () => {
  test('generates notes for C major', () => {
    const chord = createChord('C', '', 'major')
    expect(generateNotes(chord)).toEqual(['C', 'E', 'G'])
  })

  test('generates notes for A minor', () => {
    const chord = createChord('A', '', 'minor')
    expect(generateNotes(chord)).toEqual(['A', 'C', 'E'])
  })

  test('generates notes for G dominant seventh', () => {
    const chord = createChord('G', '', 'dominant seventh')
    expect(generateNotes(chord)).toEqual(['G', 'B', 'D', 'F'])
  })

  test('generates notes for F sharp major', () => {
    const chord = createChord('F', '♯', 'major')
    expect(generateNotes(chord)).toEqual(['F♯', 'A♯', 'C♯'])
  })

  test('generates notes for B flat major', () => {
    const chord = createChord('B', '♭', 'major')
    const notes = generateNotes(chord)
    // B♭ uses flat notation throughout
    expect(notes).toEqual(['B♭', 'D', 'F'])
  })

  test('generates notes for D minor seventh', () => {
    const chord = createChord('D', '', 'minor seventh')
    expect(generateNotes(chord)).toEqual(['D', 'F', 'A', 'C'])
  })

  test('generates notes for C diminished', () => {
    const chord = createChord('C', '', 'diminished')
    // Diminished uses flat notation
    expect(generateNotes(chord)).toEqual(['C', 'E♭', 'G♭'])
  })

  test('generates notes for C augmented', () => {
    const chord = createChord('C', '', 'augmented')
    expect(generateNotes(chord)).toEqual(['C', 'E', 'G♯'])
  })

  test('generates notes for D sus2', () => {
    const chord = createChord('D', '', 'sus2')
    expect(generateNotes(chord)).toEqual(['D', 'E', 'A'])
  })

  test('generates notes for A sus4', () => {
    const chord = createChord('A', '', 'sus4')
    expect(generateNotes(chord)).toEqual(['A', 'D', 'E'])
  })

  test('throws error for invalid tonality', () => {
    const chord = createChord('C', '', 'invalid')
    expect(() => generateNotes(chord)).toThrow('Invalid tonality: invalid')
  })
})
