import type { CustomCirle } from './types'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { getCanvasInstance } from './fabric'
import { getJSON } from '../helper'

export interface IGenerateCircleProps {
  radius?: number
  returnJSON?: boolean
  uuid?: string
}

export const generateCircle = ({
  uuid,
  returnJSON = false,
  radius = 100,
}: IGenerateCircleProps) => {
  const canvas = getCanvasInstance()

  /* Creating a new instance of the fabric.Circle class and assigning it to the variable circle. */
  const circle = new fabric.Circle({
    radius: radius,
    fill: '#3f82dfff',
    name: 'Ellipse',
    objType: 'circle',
    id: uuid ? uuid : uuidv4(),
  } as CustomCirle)

  /**
   * When adding BGPatter we are gonna add background color to circle.
   * We are using this clipPath to hide circle corners
   */
  circle.clipPath = new fabric.Circle({
    radius: radius,
    width: circle.width,
    height: circle.height,
    originX: 'center',
    originY: 'center',
  })

  canvas.centerObject(circle)
  if (returnJSON) {
    return getJSON(circle)
  }

  canvas.add(circle)
  canvas.setActiveObject(circle)
  canvas.requestRenderAll()
}
