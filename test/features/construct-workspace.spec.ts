import { describe, expect, test } from 'bun:test'
import getWorkspaceFromUltimateGuitar from '../../src/features/construct-workspace'

describe('getWorkspaceFromUltimateGuitar', () => {
  test('converts chord arrays to workspace elements', () => {
    const input = [
      ['Am', 'C', 'G'],
      ['F', 'G', 'Am'],
    ]
    const result = getWorkspaceFromUltimateGuitar(input)

    expect(result).toHaveLength(2)
    expect(result[0].element.chords).toHaveLength(3)
    expect(result[1].element.chords).toHaveLength(3)
  })

  test('parses major chords correctly', () => {
    const input = [['C', 'D', 'E']]
    const result = getWorkspaceFromUltimateGuitar(input)

    expect(result[0].element.chords[0].note).toBe('C')
    expect(result[0].element.chords[0].tonality).toBe('major')
    expect(result[0].element.chords[0].chromatic).toBe('')
  })

  test('parses minor chords correctly', () => {
    const input = [['Am', 'Em', 'Dm']]
    const result = getWorkspaceFromUltimateGuitar(input)

    expect(result[0].element.chords[0].note).toBe('A')
    expect(result[0].element.chords[0].tonality).toBe('minor')
  })

  test('parses sharp chords correctly', () => {
    const input = [['C#', 'F#m']]
    const result = getWorkspaceFromUltimateGuitar(input)

    expect(result[0].element.chords[0].note).toBe('C')
    expect(result[0].element.chords[0].chromatic).toBe('♯')
  })

  test('parses flat chords correctly', () => {
    const input = [['Bb', 'Ebm']]
    const result = getWorkspaceFromUltimateGuitar(input)

    expect(result[0].element.chords[0].note).toBe('B')
    expect(result[0].element.chords[0].chromatic).toBe('♭')
  })

  test('parses seventh chords correctly', () => {
    const input = [['G7', 'Am7', 'Cmaj7']]
    const result = getWorkspaceFromUltimateGuitar(input)

    expect(result[0].element.chords[0].tonality).toBe('dominant seventh')
    expect(result[0].element.chords[1].tonality).toBe('minor seventh')
  })

  test('generates unique IDs for each chord', () => {
    const input = [['C', 'C', 'C']]
    const result = getWorkspaceFromUltimateGuitar(input)

    const ids = result[0].element.chords.map((c) => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(3)
  })

  test('generates unique IDs for each workspace element', () => {
    const input = [['C'], ['D'], ['E']]
    const result = getWorkspaceFromUltimateGuitar(input)

    const ids = result.map((ws) => ws.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(3)
  })

  test('returns empty array for empty input', () => {
    const result = getWorkspaceFromUltimateGuitar([])
    expect(result).toEqual([])
  })
})
