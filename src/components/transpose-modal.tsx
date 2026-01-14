'use client'

import { ArrowDown, ArrowUp, Music2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NOTES } from '@/features/music-theory'
import { useWorkspaceStore } from '@/store/workspace-store'

interface TransposeModalProps {
  builderId?: string // If provided, transpose only that builder; otherwise transpose all
  onClose: () => void
}

export default function TransposeModal({ builderId, onClose }: TransposeModalProps) {
  const [semitones, setSemitones] = useState(0)
  const transposeBuilder = useWorkspaceStore((state) => state.transposeBuilder)
  const transposeAll = useWorkspaceStore((state) => state.transposeAll)

  const handleTranspose = () => {
    if (semitones === 0) {
      onClose()
      return
    }

    if (builderId) {
      transposeBuilder(builderId, semitones)
    } else {
      transposeAll(semitones)
    }
    onClose()
  }

  const handleIncrement = () => {
    setSemitones((prev) => Math.min(11, prev + 1))
  }

  const handleDecrement = () => {
    setSemitones((prev) => Math.max(-11, prev - 1))
  }

  // Show what C would become after transposition
  const previewNote = NOTES[((semitones % 12) + 12) % 12]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm glass-strong">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Music2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle>Transpose</DialogTitle>
              <DialogDescription>
                {builderId ? 'Transpose this builder' : 'Transpose all builders'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-8">
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full"
              onClick={handleDecrement}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>

            <div className="text-center">
              <div className="text-5xl font-bold text-gradient">
                {semitones > 0 ? `+${semitones}` : semitones}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                semitone{Math.abs(semitones) !== 1 ? 's' : ''}
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full"
              onClick={handleIncrement}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
          </div>

          {semitones !== 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <span className="text-white">C</span> → <span className="text-violet-400">{previewNote}</span>
            </div>
          )}

          {/* Quick select buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[-7, -5, -4, -2, 2, 4, 5, 7].map((s) => (
              <Button
                key={s}
                variant={semitones === s ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSemitones(s)}
              >
                {s > 0 ? `+${s}` : s}
              </Button>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleTranspose}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
