import { describe, expect, test } from 'bun:test'
import { parseChords } from '../../src/services/ultimate-guitar-service'

describe('parseChords', () => {
  test('parses standard chord notation with multiple chords per line', () => {
    const input =
      '[ch]Am[/ch] [ch]C[/ch] [ch]G[/ch] [ch]F[/ch]\r\n[ch]C[/ch] [ch]D[/ch] [ch]E[/ch] [ch]F[/ch]'
    const expected = [
      ['Am', 'C', 'G', 'F'],
      ['C', 'D', 'E', 'F'],
    ]
    expect(parseChords(input)).toEqual(expected)
  })

  test('returns empty array for empty string', () => {
    expect(parseChords('')).toEqual([])
  })

  test('returns empty array for string without chords', () => {
    const input = 'This is a song without chords'
    expect(parseChords(input)).toEqual([])
  })

  test('handles multiple chord lines correctly', () => {
    const input = '[ch]G[/ch][ch]Em[/ch]\r\n[ch]C[/ch][ch]D[/ch]\r\n[ch]Am7[/ch]'
    const expected = [['G', 'Em'], ['C', 'D'], ['Am7']]
    expect(parseChords(input)).toEqual(expected)
  })

  test('handles chords with extensions and modifiers', () => {
    const input = '[ch]Cmaj7[/ch] [ch]Dm7[/ch] [ch]G7sus4[/ch]'
    const expected = [['Cmaj7', 'Dm7', 'G7sus4']]
    expect(parseChords(input)).toEqual(expected)
  })

  test('handles unix line endings (LF only)', () => {
    const input = '[ch]A[/ch]\n[ch]B[/ch]\n[ch]C[/ch]'
    const expected = [['A'], ['B'], ['C']]
    expect(parseChords(input)).toEqual(expected)
  })

  test('handles mixed content with lyrics and chords', () => {
    const input =
      'Verse 1:\r\n[ch]C[/ch] [ch]Am[/ch]\r\nSome lyrics here\r\n[ch]F[/ch] [ch]G[/ch]'
    const expected = [
      ['C', 'Am'],
      ['F', 'G'],
    ]
    expect(parseChords(input)).toEqual(expected)
  })

  test('handles sharp and flat chords', () => {
    const input = '[ch]C#m[/ch] [ch]Bb[/ch] [ch]F#[/ch]'
    const expected = [['C#m', 'Bb', 'F#']]
    expect(parseChords(input)).toEqual(expected)
  })

  test('handles complex jazz chords', () => {
    const input = '[ch]Cmaj9[/ch] [ch]Dm11[/ch] [ch]G13[/ch] [ch]Am7b5[/ch]'
    const expected = [['Cmaj9', 'Dm11', 'G13', 'Am7b5']]
    expect(parseChords(input)).toEqual(expected)
  })
})
