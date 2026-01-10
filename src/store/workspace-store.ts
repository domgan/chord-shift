import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'
import type { Chord } from '@/types/chord'
import type { WorkspaceElement } from '@/types/workspace'

interface WorkspaceState {
  workspace: WorkspaceElement[]
  uniqueId: string | null
  loading: boolean
  showUltimateInput: boolean
}

interface WorkspaceActions {
  setWorkspace: (workspace: WorkspaceElement[]) => void
  setUniqueId: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setShowUltimateInput: (show: boolean) => void
  addBuilder: () => void
  removeBuilder: (id: string) => void
  updateBuilderName: (builderId: string, name: string) => void
  reorderBuilders: (activeId: string, overId: string) => void
  addChord: (builderId: string, chord: Omit<Chord, 'id'>) => void
  removeChord: (builderId: string, chordId: string) => void
  reorderChords: (builderId: string, activeId: string, overId: string) => void
  updateBuilderChords: (builderId: string, chords: Chord[]) => void
  reset: () => void
}

export type WorkspaceStore = WorkspaceState & WorkspaceActions

const initialState: WorkspaceState = {
  workspace: [],
  uniqueId: null,
  loading: true,
  showUltimateInput: false,
}

export const useWorkspaceStore = create<WorkspaceStore>((set, _get) => ({
  ...initialState,

  setWorkspace: (workspace) => set({ workspace }),

  setUniqueId: (uniqueId) => set({ uniqueId }),

  setLoading: (loading) => set({ loading }),

  setShowUltimateInput: (show) => set({ showUltimateInput: show }),

  addBuilder: () => {
    const id = crypto.randomUUID()
    const newElement: WorkspaceElement = {
      id,
      element: { id, chords: [] },
    }
    set((state) => ({
      workspace: [...state.workspace, newElement],
    }))
  },

  removeBuilder: (id) => {
    set((state) => ({
      workspace: state.workspace.filter((ws) => ws.id !== id),
    }))
  },

  updateBuilderName: (builderId, name) => {
    set((state) => ({
      workspace: state.workspace.map((ws) =>
        ws.id === builderId
          ? { ...ws, element: { ...ws.element, name: name.trim() || undefined } }
          : ws
      ),
    }))
  },

  reorderBuilders: (activeId, overId) => {
    set((state) => {
      const oldIndex = state.workspace.findIndex((ws) => ws.id === activeId)
      const newIndex = state.workspace.findIndex((ws) => ws.id === overId)
      if (oldIndex === -1 || newIndex === -1) return state
      return { workspace: arrayMove(state.workspace, oldIndex, newIndex) }
    })
  },

  addChord: (builderId, chordData) => {
    const chord: Chord = {
      ...chordData,
      id: crypto.randomUUID(),
    }
    set((state) => ({
      workspace: state.workspace.map((ws) =>
        ws.id === builderId
          ? {
              ...ws,
              element: {
                ...ws.element,
                chords: [...ws.element.chords, chord],
              },
            }
          : ws
      ),
    }))
  },

  removeChord: (builderId, chordId) => {
    set((state) => ({
      workspace: state.workspace.map((ws) =>
        ws.id === builderId
          ? {
              ...ws,
              element: {
                ...ws.element,
                chords: ws.element.chords.filter((c) => c.id !== chordId),
              },
            }
          : ws
      ),
    }))
  },

  reorderChords: (builderId, activeId, overId) => {
    set((state) => ({
      workspace: state.workspace.map((ws) => {
        if (ws.id !== builderId) return ws
        const chords = ws.element.chords
        const oldIndex = chords.findIndex((c) => c.id === activeId)
        const newIndex = chords.findIndex((c) => c.id === overId)
        if (oldIndex === -1 || newIndex === -1) return ws
        return {
          ...ws,
          element: { ...ws.element, chords: arrayMove(chords, oldIndex, newIndex) },
        }
      }),
    }))
  },

  updateBuilderChords: (builderId, chords) => {
    set((state) => ({
      workspace: state.workspace.map((ws) =>
        ws.id === builderId
          ? {
              ...ws,
              element: {
                ...ws.element,
                chords,
              },
            }
          : ws
      ),
    }))
  },

  reset: () => set(initialState),
}))
