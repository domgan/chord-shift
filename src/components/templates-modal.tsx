'use client'

import { BookOpen, Music } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ProgressionTemplate } from '@/features/music-theory'
import { PROGRESSION_TEMPLATES } from '@/features/music-theory'
import { useWorkspaceStore } from '@/store/workspace-store'
import { TonalitiesMap } from '@/types/chord'

const GENRE_COLORS: Record<string, string> = {
  Pop: 'bg-pink-500/20 text-pink-300',
  Jazz: 'bg-amber-500/20 text-amber-300',
  Blues: 'bg-blue-500/20 text-blue-300',
  Rock: 'bg-red-500/20 text-red-300',
  Classical: 'bg-purple-500/20 text-purple-300',
  Ballad: 'bg-cyan-500/20 text-cyan-300',
  Flamenco: 'bg-orange-500/20 text-orange-300',
  '50s': 'bg-emerald-500/20 text-emerald-300',
  'J-Pop': 'bg-violet-500/20 text-violet-300',
}

export default function TemplatesModal() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProgressionTemplate | null>(null)
  const loadTemplate = useWorkspaceStore((state) => state.loadTemplate)
  const setShowTemplates = useWorkspaceStore((state) => state.setShowTemplates)

  const handleSelect = (template: ProgressionTemplate) => {
    setSelectedTemplate(template)
  }

  const handleLoad = () => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate)
      setShowTemplates(false)
    }
  }

  const formatChords = (template: ProgressionTemplate): string => template.chords
      .map((c) => `${c.note}${c.chromatic}${TonalitiesMap[c.tonality] || ''}`)
      .join(' → ')

  return (
    <Dialog open onOpenChange={() => setShowTemplates(false)}>
      <DialogContent className="sm:max-w-2xl glass-strong">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle>Progression Templates</DialogTitle>
              <DialogDescription>
                Choose a classic chord progression to get started
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="grid gap-3 pr-4">
            {PROGRESSION_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedTemplate?.id === template.id
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Music className="h-4 w-4 text-violet-400 shrink-0" />
                      <span className="font-semibold truncate">{template.name}</span>
                      <Badge className={GENRE_COLORS[template.genre] || 'bg-gray-500/20'}>
                        {template.genre}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <p className="text-xs font-mono text-violet-300">
                      {formatChords(template)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={() => setShowTemplates(false)}>
            Cancel
          </Button>
          <Button onClick={handleLoad} disabled={!selectedTemplate}>
            <Music className="h-4 w-4 mr-2" />
            Load Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
