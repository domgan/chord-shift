'use client'

import { getGuitarChordPosition } from '@/features/music-theory'
import { cn } from '@/lib/utils'
import type { Chord } from '@/types/chord'

interface GuitarChordDiagramProps {
  chord: Chord
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e']

export default function GuitarChordDiagram({
  chord,
  size = 'md',
  className,
}: GuitarChordDiagramProps) {
  const position = getGuitarChordPosition(chord)

  // Sizing
  const sizes = {
    sm: { width: 80, height: 100, dotRadius: 5, fontSize: 8 },
    md: { width: 120, height: 150, dotRadius: 7, fontSize: 10 },
    lg: { width: 160, height: 200, dotRadius: 9, fontSize: 12 },
  }

  const s = sizes[size]
  const stringSpacing = (s.width - 30) / 5
  const fretSpacing = (s.height - 30) / 4
  const startX = 15
  const startY = 25

  // If no position found, show a placeholder
  if (!position) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-white/5 rounded-lg',
          className
        )}
        style={{ width: s.width, height: s.height }}
      >
        <span className="text-xs text-muted-foreground text-center px-2">
          No diagram
        </span>
      </div>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${s.width} ${s.height}`}
      width={s.width}
      height={s.height}
      className={cn('text-white', className)}
    >
      {/* Fret number indicator */}
      {position.baseFret > 1 && (
        <text
          x={5}
          y={startY + fretSpacing / 2 + 4}
          fontSize={s.fontSize}
          fill="currentColor"
          className="opacity-60"
        >
          {position.baseFret}
        </text>
      )}

      {/* Nut (thick line at top for open position) */}
      {position.baseFret === 1 && (
        <rect
          x={startX - 2}
          y={startY - 4}
          width={stringSpacing * 5 + 4}
          height={4}
          fill="currentColor"
          rx={1}
        />
      )}

      {/* Fret lines */}
      {[0, 1, 2, 3, 4].map((fret) => (
        <line
          key={fret}
          x1={startX}
          y1={startY + fret * fretSpacing}
          x2={startX + stringSpacing * 5}
          y2={startY + fret * fretSpacing}
          stroke="currentColor"
          strokeWidth={fret === 0 ? 2 : 1}
          className="opacity-40"
        />
      ))}

      {/* String lines */}
      {[0, 1, 2, 3, 4, 5].map((string) => (
        <line
          key={string}
          x1={startX + string * stringSpacing}
          y1={startY}
          x2={startX + string * stringSpacing}
          y2={startY + fretSpacing * 4}
          stroke="currentColor"
          strokeWidth={1}
          className="opacity-40"
        />
      ))}

      {/* Barre indicator */}
      {position.barreeFret && (
        <rect
          x={startX - s.dotRadius}
          y={startY + (position.barreeFret - position.baseFret + 0.5) * fretSpacing - s.dotRadius / 2}
          width={stringSpacing * 5 + s.dotRadius * 2}
          height={s.dotRadius}
          fill="currentColor"
          rx={s.dotRadius / 2}
          className="opacity-80"
        />
      )}

      {/* Finger positions and muted strings */}
      {position.frets.map((fret, stringIndex) => {
        const x = startX + stringIndex * stringSpacing

        if (fret === 'x') {
          // Muted string - draw X
          return (
            <g key={stringIndex}>
              <line
                x1={x - 4}
                y1={startY - 12}
                x2={x + 4}
                y2={startY - 4}
                stroke="currentColor"
                strokeWidth={2}
                className="opacity-60"
              />
              <line
                x1={x + 4}
                y1={startY - 12}
                x2={x - 4}
                y2={startY - 4}
                stroke="currentColor"
                strokeWidth={2}
                className="opacity-60"
              />
            </g>
          )
        }

        if (fret === 0) {
          // Open string - draw circle outline
          return (
            <circle
              key={stringIndex}
              cx={x}
              cy={startY - 8}
              r={s.dotRadius / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="opacity-80"
            />
          )
        }

        // Fretted position - draw filled circle
        const adjustedFret = (fret as number) - position.baseFret + 1
        const y = startY + (adjustedFret - 0.5) * fretSpacing

        return (
          <circle
            key={stringIndex}
            cx={x}
            cy={y}
            r={s.dotRadius}
            fill="currentColor"
            className="opacity-90"
          />
        )
      })}

      {/* String names at bottom */}
      {STRING_NAMES.map((name, i) => (
        <text
          key={i}
          x={startX + i * stringSpacing}
          y={s.height - 5}
          fontSize={s.fontSize - 2}
          fill="currentColor"
          textAnchor="middle"
          className="opacity-40"
        >
          {name}
        </text>
      ))}
    </svg>
  )
}
