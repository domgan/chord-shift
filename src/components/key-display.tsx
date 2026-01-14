'use client'

import { Key } from 'lucide-react'
import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { DetectedKey } from '@/features/music-theory'
import { detectKey } from '@/features/music-theory'
import { useWorkspaceStore } from '@/store/workspace-store'

export default function KeyDisplay() {
  const workspace = useWorkspaceStore((state) => state.workspace)
  const setDetectedKey = useWorkspaceStore((state) => state.setDetectedKey)

  // Use useMemo instead of useEffect to derive state
  const keys: DetectedKey[] = useMemo(() => {
    const allChords = workspace.flatMap((ws) => ws.element.chords)

    if (allChords.length === 0) {
      setDetectedKey(null)
      return []
    }

    const detected = detectKey(allChords)

    if (detected.length > 0) {
      setDetectedKey({ root: detected[0].root, mode: detected[0].mode })
    } else {
      setDetectedKey(null)
    }

    return detected
  }, [workspace, setDetectedKey])

  const allChords = workspace.flatMap((ws) => ws.element.chords)

  if (allChords.length === 0 || keys.length === 0) {
    return null
  }

  const primaryKey = keys[0]
  const confidencePercent = Math.round(primaryKey.confidence * 100 / 3) // Normalize to percentage

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-help">
            <Key className="h-4 w-4 text-violet-400" />
            <span className="font-semibold">
              {primaryKey.root} {primaryKey.mode}
            </span>
            <Badge
              variant="outline"
              className="text-xs opacity-60"
            >
              {confidencePercent}%
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Detected Keys</p>
            <div className="space-y-1">
              {keys.map((key, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-sm">
                  <span className={i === 0 ? 'text-violet-400' : 'text-muted-foreground'}>
                    {key.root} {key.mode}
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(key.confidence * 100 / 3)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t border-white/10">
              Based on chord analysis. Higher % = better fit.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
