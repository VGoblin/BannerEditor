import type { CustomRect } from './types'

import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { getCanvasInstance } from './fabric'
import { getJSON } from '../helper'

export interface IGenerateRectangleProps {
  width?: number
  height?: number
  returnJSON?: boolean
  uuid?: string
}

/**
 * It generates a rectangle with a clipPath that is the same size as the rectangle
 * @param {IGenerateRectangleProps}  - IGenerateRectangleProps
 * @returns If returnJson parameter true return JSON else render a rectangle on canvas
 */
export const generateRectangle = ({
  width,
  height,
  uuid,
  returnJSON = false,
}: IGenerateRectangleProps) => {
  const canvas = getCanvasInstance()
  const rect = new fabric.Rect({
    width: width ? width : 200,
    height: height ? height : 200,
    fill: '#3f82dfff',
    name: 'Rectangle',
    id: uuid ? uuid : uuidv4(),
    objType: 'rect',
  } as CustomRect)

  rect.clipPath = new fabric.Rect({
    width: rect.width,
    height: rect.height,
    originX: 'center',
    originY: 'center',
  })

  rect.on('mousedblclick', () => console.log('dblclick'))

  canvas.centerObject(rect)
  if (returnJSON) {
    return getJSON(rect)
  }
  canvas.add(rect)
  canvas.setActiveObject(rect)
  canvas.requestRenderAll()
}
