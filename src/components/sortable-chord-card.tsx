'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { generateLabel, generateNotes } from '@/features/generate-chord-info'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/store/workspace-store'
import type { Chord } from '@/types/chord'

interface SortableChordCardProps {
  builderId: string
  chord: Chord
}

const gradients = [
  'from-violet-500 to-purple-600',
  'from-purple-500 to-pink-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-violet-600',
  'from-blue-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
]

function getGradient(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

export default function SortableChordCard({
  builderId,
  chord,
}: SortableChordCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const removeChord = useWorkspaceStore((state) => state.removeChord)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chord.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleRemove = () => {
    removeChord(builderId, chord.id)
  }

  const label = generateLabel(chord)
  const notes = generateNotes(chord)
  const gradient = getGradient(chord.id)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            style={style}
            className={cn(
              'relative group touch-none',
              isDragging && 'z-50 opacity-50'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={cn(
                'h-24 w-28 rounded-xl flex flex-col items-center justify-center',
                'bg-gradient-to-br transition-all duration-300',
                'hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25',
                isDragging && 'scale-105 shadow-xl shadow-violet-500/40',
                gradient
              )}
            >
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                className={cn(
                  'absolute top-1 left-1 p-1 rounded cursor-grab active:cursor-grabbing',
                  'transition-opacity duration-200 hover:bg-white/20',
                  isHovered || isDragging ? 'opacity-100' : 'opacity-0'
                )}
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-4 w-4 text-white/80" />
              </button>

              <span className="text-2xl font-bold text-white drop-shadow-md">
                {label}
              </span>
              <div className="flex gap-1 mt-1">
                {notes.slice(0, 4).map((note, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs px-1.5 py-0 bg-white/20 text-white border-0 hover:bg-white/30"
                  >
                    {note}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Remove Button */}
            <Button
              variant="destructive"
              size="icon"
              className={cn(
                'absolute -top-2 -right-2 h-6 w-6 rounded-full',
                'transition-all duration-200',
                isHovered && !isDragging
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-75'
              )}
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="font-mono">
          <p className="font-semibold">{label}</p>
          <p className="text-muted-foreground">{notes.join(' - ')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
