import type { CustomGroup, CustomObject } from './types'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { getCanvasInstance } from './fabric'

interface CustomSVG extends CustomGroup {}

/**
 * We load the SVG from the URL, then we create a group of objects, then we add the group to the canvas
 */
export const generateSVG = (url?: string) => {
  const canvas = getCanvasInstance()
  const group: CustomObject[] = []
  fabric.loadSVGFromURL(
    url ? url : '/images/dragon.svg',
    (objects, options) => {
      const loadedObjects = new fabric.Group(group) as CustomSVG
      loadedObjects.set({
        name: 'SVG',
        id: uuidv4(),
      })
      canvas.centerObject(loadedObjects)
      canvas.add(loadedObjects)
      canvas.renderAll()
    },
    (item: any, object: any) => {
      object.set('id', item.getAttribute('id'))
      group.push(object)
    }
  )
}
