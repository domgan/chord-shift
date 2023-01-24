import { Chord } from "../components/chord-card"
import { WorkshopElement, WorkspaceElement } from "../pages/chords"
import { tonalitiesMap } from "./generate-chord-info"


const parseChord = (chord: string, id: number): Chord => {
  return {
    id,
    note: chord[0],
    chromatic: '',  // todo
    tonality: Object.keys(tonalitiesMap).find(key => tonalitiesMap[key] === '')!  // todo
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
