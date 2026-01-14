'use client'

import { useCallback, useEffect, useRef } from 'react'
import AudioService from '@/services/audio-service'
import type { Chord } from '@/types/chord'

/**
 * Custom hook for audio playback functionality.
 * Handles initialization and cleanup of AudioService singleton.
 */
export function useAudio() {
  const serviceRef = useRef<AudioService | null>(null)

  useEffect(() => {
    const service = AudioService.getInstance()
    void service.initialize()
    serviceRef.current = service

    return () => {
      service.stop()
    }
  }, [])

  const playChord = useCallback(async (chord: Chord) => {
    const service = serviceRef.current
    if (service) {
      await service.playChord(chord)
    }
  }, [])

  const playProgression = useCallback(async (
    chords: Chord[],
    beatsPerChord?: number,
    onChordChange?: (index: number) => void
  ) => {
    const service = serviceRef.current
    if (service) {
      await service.playProgression(chords, beatsPerChord, onChordChange)
    }
  }, [])

  const stop = useCallback(() => {
    serviceRef.current?.stop()
  }, [])

  const setBpm = useCallback((bpm: number) => {
    serviceRef.current?.setBpm(bpm)
  }, [])

  const isPlaying = useCallback(() => serviceRef.current?.isCurrentlyPlaying() ?? false, [])

  return {
    playChord,
    playProgression,
    stop,
    setBpm,
    isPlaying,
  }
}
