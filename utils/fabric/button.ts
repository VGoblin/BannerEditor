import type { CustomGroup, CustomTextbox } from './types'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { getCanvasInstance } from './fabric'
import { getJSON } from '../helper'

export interface IGenerateButtonProps {
  width?: number
  height?: number
  returnJSON?: boolean
  uuid?: string
}

export const generateButton = ({
  uuid,
  width = 200,
  height = 50,
  returnJSON = false,
}: IGenerateButtonProps) => {
  const canvas = getCanvasInstance()
  // Generate a container for button text
  const btnContainer = new fabric.Rect({
    width: 200,
    height: 50,
    fill: '#3f82dfff',
    name: 'btnContainer',
    originX: 'center',
    originY: 'center',
    rx: 10,
  })

  // Generate a button text
  const btnText = new fabric.Textbox('Button', {
    fill: '#ffffffff',
    name: 'Text',
    width: 180,
    textAlign: 'center',
    fontSize: 24,
    isWrapping: true,
    fontFamily: 'Inter',
    fontWeight: 400,
    fontVariants: [],
    selectedFontVariant: '',
    selectedFontFamily: 'Inter',
    autoResize: true,
    charSpacing: 0,
    originX: 'center',
    originY: 'center',
  } as CustomTextbox)

  // Create a group of button text and container
  const btnGroup = new fabric.Group([btnContainer, btnText], {
    width: 200,
    height: 50,
    originX: 'center',
    originY: 'center',
    name: 'Button',
    id: uuid ? uuid : uuidv4(),
    type: 'group',
    objType: 'button',
    gradientDirection: 'horizontal',
  } as CustomGroup)

  canvas.centerObject(btnGroup)

  if (returnJSON) {
    return getJSON(btnGroup)
  }

  canvas.add(btnGroup)
  canvas.setActiveObject(btnGroup)
  canvas.requestRenderAll()
}
