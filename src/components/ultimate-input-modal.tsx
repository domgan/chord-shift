'use client'

import { Download, ExternalLink, Loader2 } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { useWorkspaceStore } from '@/store/workspace-store'

interface UltimateInputModalProps {
  loadFromUltimateGuitar: (url: string) => Promise<void>
}

export default function UltimateInputModal({
  loadFromUltimateGuitar,
}: UltimateInputModalProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setShowUltimateInput = useWorkspaceStore(
    (state) => state.setShowUltimateInput
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    await loadFromUltimateGuitar(url)
    setIsLoading(false)
  }

  const isValidUrl = url.includes('ultimate-guitar.com')

  return (
    <Dialog open onOpenChange={() => setShowUltimateInput(false)}>
      <DialogContent className="sm:max-w-lg glass-strong">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle>Import from Ultimate Guitar</DialogTitle>
              <DialogDescription>
                Paste a chord tab URL to import the progression
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Ultimate Guitar URL
            </label>
            <Input
              type="url"
              placeholder="https://tabs.ultimate-guitar.com/tab/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/5"
            />
            {url && !isValidUrl && (
              <p className="text-sm text-destructive">
                Please enter a valid Ultimate Guitar URL
              </p>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">How to get a chord URL:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Go to Ultimate Guitar</li>
              <li>Find a song with chords (not tabs)</li>
              <li>Copy the URL from your browser</li>
              <li>Paste it here</li>
            </ol>
            <a
              href="https://www.ultimate-guitar.com/explore?type[]=Chords"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Browse chords on Ultimate Guitar
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowUltimateInput(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValidUrl || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Import Chords
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
