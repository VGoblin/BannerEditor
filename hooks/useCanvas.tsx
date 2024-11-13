import type { Rect } from 'fabric/fabric-impl'
import React, { useEffect, useContext, useState } from 'react'
import { CanvasContext } from '../store/CanvasContext'

export const useCanvas = () => {
  const { canvas, setCanvas } = useContext(CanvasContext)
  const [frame, setFrame] = useState<Rect>()

  useEffect(() => {
    if ('width' in canvas) {
      const frame = canvas.getObjects().find((obj) => obj.name === 'frame')
      if (frame) setFrame(frame)
    }
  }, [canvas])

  return { canvas, frame, setCanvas }
}
