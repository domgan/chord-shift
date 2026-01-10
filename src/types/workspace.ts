import type { Chord } from './chord'

export interface WorkshopElement {
  id: string
  name?: string
  chords: Chord[]
}

export interface WorkspaceElement {
  id: string
  element: WorkshopElement
}
