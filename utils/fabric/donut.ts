import type { CustomCirle } from './types'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { getCanvasInstance } from './fabric'
import { getJSON } from '../helper'

export interface IGenerateDonutProps {
  radius?: number
  returnJSON?: boolean
  uuid?: string
  strokeWidth?: number
}

/**
 * It creates a new circle object, sets some properties, and adds it to the canvas
 */
export const generateDonut = ({
  radius = 100,
  uuid,
  returnJSON = false,
  strokeWidth = 25,
}: IGenerateDonutProps) => {
  const canvas = getCanvasInstance()
  const donut = new fabric.Circle({
    radius,
    angle: 0,
    startAngle: 0,
    endAngle: 250,
    stroke: '#3f82dfff',
    strokeWidth: strokeWidth,
    fill: '',
    id: uuid ? uuid : uuidv4(),
    type: 'circle',
    objType: 'donut',
    name: 'Donut',
  } as CustomCirle)
  canvas.centerObject(donut)

  if (returnJSON) {
    return getJSON(donut)
  }

  canvas.add(donut)
  canvas.setActiveObject(donut)
  canvas.requestRenderAll()
}
