/**
* @jest-environment node
*/
import '@testing-library/jest-dom'
import extractChords, { parseChords } from '../../src/services/ultimate-guitar-service'


describe('parseChords', () => {
  it('should return an array of chords when passed a string of chord notation', () => {
    const chordsRaw = "[ch]Am[/ch] [ch]C[/ch] [ch]G[/ch] [ch]F[/ch]\r\n[ch]C[/ch] [ch]D[/ch] [ch]E[/ch] [ch]F[/ch]"
    const expected = [["Am", 'C', 'G', 'F'], ["C", 'D', 'E', 'F']]
    expect(parseChords(chordsRaw)).toEqual(expected)
  })
  it('should return an empty array when passed an empty string', () => {
    expect(parseChords('')).toEqual([]);
  })
  it('should return an empty array when passed a string without chords', () => {
    const chordsRaw = "This is a song without chords"
    expect(parseChords(chordsRaw)).toEqual([])
  })
})

describe('extractChords', () => {
  it('should return correct number of chords', async () => {
    const testUrl = 'https://tabs.ultimate-guitar.com/tab/bruce-springsteen/streets-of-philadelphia-chords-84466'
    const expectedLength = 22
    await expect(extractChords(testUrl)).resolves.toHaveLength(expectedLength)
  })
})