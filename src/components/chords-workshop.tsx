'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { ArrowUpDown, GripVertical, Music2, Palette, Pencil, Plus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDndSensors } from '@/hooks/use-dnd-sensors'
import { useWorkspaceStore } from '@/store/workspace-store'
import ChordBuilder from './chord-builder'
import SortableChordCard from './sortable-chord-card'
import TransposeModal from './transpose-modal'

interface ChordsWorkshopProps {
  id: string
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
  isDragging?: boolean
}

export default function ChordsWorkshop({
  id,
  dragHandleProps,
  isDragging,
}: ChordsWorkshopProps) {
  const [showChordBuilder, setShowChordBuilder] = useState(false)
  const [showTranspose, setShowTranspose] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [colorByFunction, setColorByFunction] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const workspace = useWorkspaceStore((state) => state.workspace)
  const removeBuilder = useWorkspaceStore((state) => state.removeBuilder)
  const updateBuilderName = useWorkspaceStore((state) => state.updateBuilderName)
  const reorderChords = useWorkspaceStore((state) => state.reorderChords)

  const builder = workspace.find((ws) => ws.id === id)
  const chords = builder?.element.chords ?? []
  const builderName = builder?.element.name

  const sensors = useDndSensors({ activationDistance: 5 })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderChords(id, active.id as string, over.id as string)
    }
  }

  const handleDelete = () => {
    removeBuilder(id)
  }

  const handleNameSubmit = () => {
    const value = nameInputRef.current?.value ?? ''
    updateBuilderName(id, value)
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit()
    } else if (e.key === 'Escape') {
      setIsEditingName(false)
    }
  }

  return (
    <TooltipProvider>
      <Card
        className={`glass border-white/10 hover:border-white/20 transition-all duration-300 group ${
          isDragging ? 'shadow-xl shadow-violet-500/30 scale-[1.02]' : ''
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            {/* Drag Handle for Builder */}
            {dragHandleProps && (
              <button
                {...dragHandleProps}
                className="p-2 rounded-lg hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors"
                aria-label="Drag to reorder builder"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>
            )}

            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Music2 className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <Input
                  ref={nameInputRef}
                  defaultValue={builderName ?? ''}
                  placeholder="Enter name..."
                  className="h-8 text-lg font-semibold bg-background/50"
                  onBlur={handleNameSubmit}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-2 group/name hover:bg-white/5 rounded px-2 py-1 -ml-2 transition-colors"
                >
                  <span className="text-lg font-semibold truncate">
                    {builderName || 'Chord Progression'}
                  </span>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/name:opacity-100 transition-opacity" />
                </button>
              )}
              <p className="text-sm text-muted-foreground px-2">
                {chords.length} {chords.length === 1 ? 'chord' : 'chords'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setColorByFunction(!colorByFunction)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    colorByFunction ? 'text-violet-400' : 'text-muted-foreground'
                  }`}
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{colorByFunction ? 'Default colors' : 'Color by function'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTranspose(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-white"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Transpose</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete builder</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={chords.map((c) => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap gap-3">
                {chords.map((chord) => (
                  <SortableChordCard
                    key={chord.id}
                    builderId={id}
                    chord={chord}
                    colorByFunction={colorByFunction}
                  />
                ))}

                {/* Add Chord Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-24 w-28 border-dashed border-2 hover:border-violet-500/50 hover:bg-violet-500/10"
                      onClick={() => setShowChordBuilder(true)}
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add chord</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>

        {/* Chord Builder Dialog */}
        {showChordBuilder && (
          <ChordBuilder
            builderId={id}
            onClose={() => setShowChordBuilder(false)}
          />
        )}

        {/* Transpose Modal */}
        {showTranspose && (
          <TransposeModal
            builderId={id}
            onClose={() => setShowTranspose(false)}
          />
        )}
      </Card>
    </TooltipProvider>
  )
}
