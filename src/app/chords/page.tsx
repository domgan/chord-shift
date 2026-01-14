'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  ArrowUpDown,
  BookOpen,
  Download,
  Home,
  Music,
  Play,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import KeyDisplay from '@/components/key-display'
import PracticeMode from '@/components/practice-mode'
import SortableBuilder from '@/components/sortable-builder'
import TemplatesModal from '@/components/templates-modal'
import TransposeModal from '@/components/transpose-modal'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import UltimateInputModal from '@/components/ultimate-input-modal'
import getWorkspaceFromUltimateGuitar from '@/features/construct-workspace'
import { useDndSensors } from '@/hooks/use-dnd-sensors'
import FirebaseService from '@/services/firebase-service'
import { useWorkspaceStore } from '@/store/workspace-store'

export default function ChordsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dataFetchedRef = useRef(false)
  const [showGlobalTranspose, setShowGlobalTranspose] = useState(false)

  const {
    workspace,
    uniqueId,
    loading,
    showUltimateInput,
    showTemplates,
    showPracticeMode,
    setWorkspace,
    setUniqueId,
    setLoading,
    setShowUltimateInput,
    setShowTemplates,
    setShowPracticeMode,
    addBuilder,
    reorderBuilders,
    reset,
  } = useWorkspaceStore()

  const sensors = useDndSensors({ activationDistance: 10 })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderBuilders(active.id as string, over.id as string)
    }
  }

  const handleNew = useCallback(() => {
    reset()
    setLoading(false)
    router.push('/chords', { scroll: false })
  }, [reset, setLoading, router])

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true

    const loadWorkspace = async () => {
      const id = searchParams.get('id')
      if (id) {
        try {
          const firebaseService = FirebaseService.getInstance()
          const savedWorkspace = await firebaseService.getWorkspace(id)
          if (savedWorkspace) {
            setWorkspace(savedWorkspace)
            setUniqueId(id)
            toast.success('Workspace loaded successfully')
          } else {
            throw new Error('Workspace not found')
          }
        } catch {
          handleNew()
          toast.error('Failed to load workspace. Check your link.')
        }
      }
      setLoading(false)
    }

    void loadWorkspace()
  }, [searchParams, setWorkspace, setUniqueId, setLoading, handleNew])

  const handleReload = () => {
    router.refresh()
  }

  const handleSave = async () => {
    if (workspace.length === 0) {
      toast.warning('Add some chord builders before saving')
      return
    }

    const uniqueIdToSave = uniqueId ?? crypto.randomUUID()

    try {
      const response = await fetch('/api/workspace-save', {
        method: 'POST',
        body: JSON.stringify({ id: uniqueIdToSave, workspace }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status !== 201) {
        throw new Error('Save failed')
      }

      router.push(`/chords?id=${uniqueIdToSave}`, { scroll: false })
      await navigator.clipboard.writeText(
        `https://chord-shift.vercel.app/chords?id=${uniqueIdToSave}`
      )
      setUniqueId(uniqueIdToSave)
      toast.success('Saved! Link copied to clipboard')
    } catch {
      toast.error('Failed to save workspace')
    }
  }

  const loadFromUltimateGuitar = async (ultimateUrl: string) => {
    setLoading(true)
    handleNew()
    try {
      const response = await fetch(
        `/api/get-ultimate-guitar-chords?url=${encodeURI(ultimateUrl)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch chords')
      }

      const ultimateChords = (await response.json()).chords
      setWorkspace(getWorkspaceFromUltimateGuitar(ultimateChords))
      toast.success('Chords imported from Ultimate Guitar!')
    } catch {
      toast.error('Failed to import chords. Try a different URL.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Music className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient">Chord Shift</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplates(true)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUltimateInput(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Separator orientation="vertical" className="h-6" />
            {workspace.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGlobalTranspose(true)}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Transpose
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPracticeMode(true)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Practice
                </Button>
                <KeyDisplay />
              </>
            )}
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={handleReload}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ) : workspace.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No chord builders yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Create a new chord builder to start arranging your progressions,
                or import chords from Ultimate Guitar.
              </p>
              <div className="flex gap-4">
                <Button onClick={addBuilder}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Builder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUltimateInput(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Import from UG
                </Button>
              </div>
            </div>
          ) : (
            /* Workspace with Drag & Drop */
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={workspace.map((ws) => ws.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6">
                  {workspace.map((ws) => (
                    <SortableBuilder key={ws.id} id={ws.id} />
                  ))}

                  {/* Add Builder Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full glass border-dashed border-2 hover:border-violet-500/50 h-20"
                    onClick={addBuilder}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Chord Builder
                  </Button>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </main>
      </ScrollArea>

      {/* Ultimate Guitar Import Modal */}
      {showUltimateInput && (
        <UltimateInputModal loadFromUltimateGuitar={loadFromUltimateGuitar} />
      )}

      {/* Templates Modal */}
      {showTemplates && <TemplatesModal />}

      {/* Practice Mode */}
      {showPracticeMode && <PracticeMode />}

      {/* Global Transpose Modal */}
      {showGlobalTranspose && (
        <TransposeModal onClose={() => setShowGlobalTranspose(false)} />
      )}
    </div>
  )
}
