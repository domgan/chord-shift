import { Chord, chromatics } from "../components/chord-card"
import { WorkshopElement, WorkspaceElement } from "../pages/chords"
import { tonalitiesMap } from "./generate-chord-info"

const getChromatic = (chord: string): string =>
  chord.match('b') ? chromatics.flat : chord.match('#') ? chromatics.sharp : chromatics.none;

const getTonality = (chord: string): string => {
  const rawTonality = chord.slice(1).replace('b', '').replace('#', '')
  return Object.keys(tonalitiesMap).find(key => tonalitiesMap[key] === rawTonality)!  // todo if not found then what
}

const parseChord = (chord: string, id: number): Chord => {
  return {
    id,
    note: chord[0],
    chromatic: getChromatic(chord),
    tonality: getTonality(chord)
  }
}

export default function getWorkspaceFromUltimateGuitar(ultimateChords: string[][]): WorkspaceElement[] {
  const workspace: WorkspaceElement[] = []
  ultimateChords.forEach((chordsLine, workspaceId) => {
    const chords: Chord[] = chordsLine.map((ultimateChord, chordId) => parseChord(ultimateChord, chordId))
    const workshop: WorkshopElement = { id: workspaceId, chords }
    workspace.push({ id: workspace.length ?? 0, element: workshop })
  })
  return workspace
}
