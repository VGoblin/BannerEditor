import { Canvas, Rect } from 'fabric/fabric-impl'
import React, { PropsWithChildren, createContext, useState, useEffect } from 'react'
import { getCanvasInstance } from '../utils/fabric/fabric'

interface IContext {
  canvas: Canvas
  setCanvas: (canvas: Canvas) => void
}

export const CanvasContext = createContext<IContext>({
  canvas: {} as Canvas,
  setCanvas: () => {},
})

export const CanvasProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [canvas, setCanvas] = useState<Canvas>({} as Canvas)

  useEffect(() => {
    setCanvas(getCanvasInstance())
  }, [])

  return <CanvasContext.Provider value={{ canvas, setCanvas }}>{children}</CanvasContext.Provider>
}
