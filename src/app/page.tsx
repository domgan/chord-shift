import { ArrowRight, BookOpen, Layers, Music, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Music made simple</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="text-gradient">Chord Shift</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build, transpose, and arrange your chord progressions with an intuitive
              visual interface. Import from Ultimate Guitar or create from scratch.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group text-lg px-8 py-6">
              <Link href="/chords">
                <Music className="mr-2 h-5 w-5" />
                Start Building
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 glass">
              <a
                href="https://jazz-library.com/articles/chord-symbols/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Learn Chords
              </a>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <Card className="glass border-white/10 hover:border-violet-500/50 transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Import Instantly</h3>
                <p className="text-sm text-muted-foreground">
                  Paste any Ultimate Guitar URL and instantly load chord progressions
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 hover:border-violet-500/50 transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Build Progressions</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom chord progressions with our visual builder
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 hover:border-violet-500/50 transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Save & Share</h3>
                <p className="text-sm text-muted-foreground">
                  Save your workspaces and share them with a simple link
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Built with Next.js, React, and a love for music</p>
      </footer>
    </main>
  )
}
