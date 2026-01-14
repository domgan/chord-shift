'use client'

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

interface UseDndSensorsOptions {
  /**
   * Distance in pixels the pointer must move before a drag starts.
   * Prevents accidental drags when clicking.
   * @default 5
   */
  activationDistance?: number
}

/**
 * Custom hook for consistent DnD sensor configuration.
 * Uses PointerSensor with activation constraint and KeyboardSensor for accessibility.
 */
export function useDndSensors(options: UseDndSensorsOptions = {}) {
  const { activationDistance = 5 } = options

  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: activationDistance },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
}
