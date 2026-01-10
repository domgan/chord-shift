'use client'

import { Music, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateLabel, generateNotes } from '@/features/generate-chord-info'
import { useWorkspaceStore } from '@/store/workspace-store'
import { TonalitiesMap } from '@/types/chord'

interface ChordBuilderProps {
  builderId: string
  onClose: () => void
}

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const CHROMATICS = [
  { value: '', label: 'Natural' },
  { value: '♯', label: 'Sharp (♯)' },
  { value: '♭', label: 'Flat (♭)' },
]
const TONALITIES = Object.keys(TonalitiesMap)

export default function ChordBuilder({ builderId, onClose }: ChordBuilderProps) {
  const [note, setNote] = useState('C')
  const [chromatic, setChromatic] = useState('')
  const [tonality, setTonality] = useState('major')

  const addChord = useWorkspaceStore((state) => state.addChord)

  const previewChord = { id: 'preview', note, chromatic, tonality }
  const previewLabel = generateLabel(previewChord)
  const previewNotes = generateNotes(previewChord)

  const handleSave = () => {
    addChord(builderId, { note, chromatic, tonality })
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-strong">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle>Add Chord</DialogTitle>
              <DialogDescription>
                Build a new chord for your progression
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Preview */}
        <div className="flex justify-center py-6">
          <div className="h-32 w-40 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex flex-col items-center justify-center shadow-lg shadow-violet-500/25">
            <span className="text-4xl font-bold text-white drop-shadow-md">
              {previewLabel}
            </span>
            <div className="flex gap-1 mt-2">
              {previewNotes.map((n, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-sm px-2 bg-white/20 text-white border-0"
                >
                  {n}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Note
            </label>
            <Select value={note} onValueChange={setNote}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTES.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Accidental
            </label>
            <Select value={chromatic} onValueChange={setChromatic}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHROMATICS.map((c) => (
                  <SelectItem key={c.value || 'natural'} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Quality
            </label>
            <Select value={tonality} onValueChange={setTonality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONALITIES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Sparkles className="h-4 w-4 mr-2" />
            Add Chord
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
