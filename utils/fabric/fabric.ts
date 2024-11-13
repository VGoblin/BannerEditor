import type { CustomObject, CustomRect, CustomCirle, CustomCanvas } from './types'
import { Canvas, Group } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { IFont, IFontVariant } from '../../components/Editor/Configuration/TextConfig/FontFamily'
import { fontData } from '../fonts'
import { calculateZoom, getJSON, loadFonts } from '../helper'
import { generateImage } from './image'

import { initHistory } from './history'
import { generateTextboxObj } from './text'
import { initAligningGuidelines } from './aligningGuidelines'
import { initCenteringGuidelines } from './centeringGuidelines'

/* Creating a canvas instance and returning it. */
let canvas: CustomCanvas
let controlCircle: HTMLImageElement
let controlRect: HTMLImageElement

export const getCanvasInstance = (width?: number, height?: number): Canvas => {
  if (canvas) return canvas
  const FRAMEWIDTH = width ? width : 500
  const FRAMEHEIGHT = height ? height : 500

  const frame = new fabric.Rect({
    width: FRAMEWIDTH,
    height: FRAMEHEIGHT,
    selectable: false,
    originX: 'center',
    originY: 'center',
    fill: '#ffffff',
    hoverCursor: 'default',
    hasControls: false,
    name: 'frame',
    type: 'rect',
    objType: 'frame',
    id: uuidv4(),
  } as CustomRect)

  if (width && height) {
  }

  canvas = new fabric.Canvas('canvas', {
    width: 5000,
    height: 5000,
    clipPath: frame,
    stopContextMenu: true,
    svgViewportTransformation: true,
    enableRetinaScaling: true,
    // Disable mouse drawing selection
    selection: true,
    // // Control are displayed even the current selected item
    // // is masked by a clippath
    controlsAboveOverlay: true,
    // // When an object is selected, it stays as it in
    // // the layering stack
    preserveObjectStacking: true,
    // // Always keep ratio when transforming an object
    // uniScaleTransform: false,
    // Indicates which key switches uniform scaling
    uniScaleKey: 'none',
    altActionKey: 'none',
  })

  // initCenteringGuidelines(canvas)

  canvas.centerObject(frame)
  canvas.add(frame)

  fabricConfiguration({ frame })

  if (document) {
    controlCircle = document.createElement('img')
    controlCircle.src = '/images/circle.svg'
    controlRect = document.createElement('img')
    controlRect.src = '/images/rectangle.svg'
  }
  return canvas
}

export const destroyCanvasInstance = () => {
  canvas.getContext().clearRect(0, 0, canvas.getWidth(), canvas.getHeight())
  // canvas.clear()
  canvas.dispose()
  // @ts-ignore
  canvas = undefined
}

export const generateShadow = () => {
  return new fabric.Shadow({
    offsetX: 3,
    offsetY: 3,
    blur: 1,
    color: '#ff0000',
  })
}

/**
 * It takes a source, an object, and a repeat value, clones the object, loads the image, sets the fill
 * of the cloned object to the loaded image, and then adds the cloned object to the canvas
 * @param {string} source - The image source
 * @param {Object} obj - The object that you want to apply the pattern to.
 * @param {'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'} repeat - 'repeat' | 'repeat-x' |
 * 'repeat-y' | 'no-repeat'
 */
export const loadPattern = (
  source: string,
  obj: CustomObject,
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
) => {
  fabric.util.loadImage(source, (img) => {
    const pattern = new fabric.Pattern({
      source: img,
      repeat: repeat,
    })
    // @ts-ignore
    obj.backgroundColor = obj.fill
    obj.fill = pattern
    obj.hasBgPattern = true
    obj.set({ dirty: true, hasBgPattern: true })
    canvas.requestRenderAll()
  })
}

/**
 * It removes the pattern from the group
 * @param {Group} obj - The group object that contains the pattern and the rectangle.
 */
export const deleteBGPattern = (obj: Group) => {
  obj.set({
    fill: obj.backgroundColor,
    type: 'rect',
  })
  canvas.requestRenderAll()
}

/**
 * It takes a source (string) and an object (Group) and if the object is a rectWithBG, it loads the
 * image and sets the fill of the second object in the group to the loaded image
 * @param {string} source - string = the url of the image
 * @param {Group} obj - Group
 */
export const changeBGPattern = (source: string, obj: fabric.Object, repeat: string) => {
  fabric.util.loadImage(source, (img) => {
    const pattern = new fabric.Pattern({
      source: img,
      repeat: repeat,
    })
    obj.fill = pattern
    obj.set({ dirty: true })
    canvas.requestRenderAll()
  })
}

/**
 * It changes the default controls of canvas
 */
export const fabricConfiguration = ({ frame }: { frame: fabric.Rect }): void => {
  initHistory()
  initAligningGuidelines(canvas, frame)
  // initCenteringGuidelines(canvas, frame)
  // ------------------ 1 ------------------

  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.objectCaching = false
  fabric.Object.prototype.cornerColor = '#006AFF'
  fabric.Object.prototype.borderScaleFactor = 1
  fabric.Object.prototype.cornerSize = 8
  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.rotatingPointOffset = 4
  fabric.Object.prototype.strokeWidth = 0
  // @ts-ignore
  fabric.Object.prototype.beforeHideOpacityValue = 1
  // @ts-ignore
  fabric.Object.prototype.hide = function () {
    // @ts-ignore
    this.beforeHideOpacityValue = this.opacity
    this.set({
      opacity: 0,
      selectable: false,
    })
  }
  // @ts-ignore
  fabric.Object.prototype.show = function () {
    this.set({
      // @ts-ignore
      opacity: this.beforeHideOpacityValue,
      selectable: true,
    })
  }

  // TEXTBOX FUNCTIONS

  fabric.Textbox.prototype.setControlsVisibility({
    ml: false,
    bl: false,
    br: false,
    tl: false,
    tr: false,
  })
}

/**
 * It takes a JSON object, checks if there are any images in the object, and if there are, it generates
 * the image and removes it from the JSON object
 * @param json - The JSON object to load
 * @returns The canvas instance
 */
export const loadCustomJson = (json: any, zoomLevel?: number) => {
  destroyCanvasInstance()

  getCanvasInstance()

  // If json is empty, do not load anything
  if (Object.keys(json).length < 1) return canvas

  if (typeof json === 'string') json = JSON.parse(json)

  let frame: fabric.Rect
  let textboxes: fabric.Textbox[] = []

  const result: CustomObject[] = []
  json.objects.map((obj: any, index: number) => {
    if (obj.type === 'image') {
      generateImage({
        src: obj.object.src,
        top: obj.top,
        left: obj.left,
        mode: obj.mode,
        width: obj.width,
        height: obj.height,
        name: obj.name,
        uuid: obj.id,
        maskType: obj.maskType,
        opacity: obj.opacity,
        ...obj,
      })
    } else if (obj.objType === 'textbox') {
      // const textObj = generateTextboxObj({
      //   left: obj.left,
      //   top: obj.top,
      //   text: obj.text,
      //   height: obj.height,
      //   width: obj.width,
      //   ...obj,
      // })
      // textboxes.push(textObj)

      // @ts-ignore
      const foundedFont = fontData[obj.selectedFontFamily] as IFont
      if (!foundedFont) return
      loadFonts([{ name: foundedFont.family, url: foundedFont.url }, ...foundedFont.variants]).then(
        () => {
          canvas.requestRenderAll()
        }
      )

      //generateTextbox2()
      result.push(obj)
    } else {
      // We need that for fit the screen
      if (obj.objType === 'frame') frame = obj
      result.push(obj)
    }
  })

  canvas.loadFromJSON(
    { ...json, objects: result },
    // callback, usually a re-render and some specific app code
    () => {
      canvas.setViewportTransform([
        1,
        0,
        0,
        1,
        (window.innerWidth - 5000) / 2,
        (window.innerHeight - 5060) / 2,
      ])

      textboxes.map((obj) => {
        canvas.add(obj)
      })

      canvas.zoomToPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, zoomLevel || 1)

      canvas.requestRenderAll()
    }
  )

  return canvas
}

export const getCanvasJson = () => {
  // ! Use getJSON helper instead of this function
  return getJSON(canvas, true)
}

// ----------------------------------------------

// function initAligningGuidelines(canvas: Canvas) {
//   var ctx = canvas.getSelectionContext(),
//     aligningLineOffset = 5,
//     aligningLineMargin = 4,
//     aligningLineWidth = 2,
//     aligningLineColor = 'rgb(0,0,255)',
//     viewportTransform: number[],
//     zoom = 1

//   function drawVerticalLine(coords: any) {
//     drawLine(
//       coords.x + 0.5,
//       coords.y1 > coords.y2 ? coords.y2 : coords.y1,
//       coords.x + 0.5,
//       coords.y2 > coords.y1 ? coords.y2 : coords.y1
//     )
//   }

//   function drawHorizontalLine(coords: any) {
//     drawLine(
//       coords.x1 > coords.x2 ? coords.x2 : coords.x1,
//       coords.y + 0.5,
//       coords.x2 > coords.x1 ? coords.x2 : coords.x1,
//       coords.y + 0.5
//     )
//   }
//   function drawLine(x1: number, y1: number, x2: number, y2: number) {
//     // @ts-ignore
//     const originXY = fabric.util.transformPoint(new fabric.Point(x1, y1), canvas.viewportTransform)
//     const dimensions = fabric.util.transformPoint(
//       new fabric.Point(x2, y2),
//       // @ts-ignore
//       canvas.viewportTransform
//     )
//     ctx.save()
//     ctx.lineWidth = aligningLineWidth
//     ctx.strokeStyle = aligningLineColor
//     ctx.beginPath()

//     ctx.moveTo(originXY.x, originXY.y)

//     ctx.lineTo(dimensions.x, dimensions.y)
//     ctx.stroke()
//     ctx.restore()
//   }

//   function isInRange(value1: number, value2: number) {
//     value1 = Math.round(value1)
//     value2 = Math.round(value2)
//     for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
//       if (i === value2) {
//         return true
//       }
//     }
//     return false
//   }

//   const verticalLines: any[] = [],
//     horizontalLines: any[] = []

//   canvas.on('mouse:down', function () {
//     viewportTransform = canvas.viewportTransform!
//     zoom = canvas.getZoom()
//   })

//   canvas.on('object:moving', function (e) {
//     var activeObject = e.target!,
//       canvasObjects = canvas.getObjects(),
//       activeObjectCenter = activeObject!.getCenterPoint(),
//       activeObjectLeft = activeObjectCenter.x,
//       activeObjectTop = activeObjectCenter.y,
//       activeObjectBoundingRect = activeObject!.getBoundingRect(),
//       activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
//       activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
//       horizontalInTheRange = false,
//       verticalInTheRange = false,
//       // @ts-ignore
//       transform = canvas._currentTransform

//     if (!transform) return

//     // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
//     // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

//     for (var i = canvasObjects.length; i--; ) {
//       if (canvasObjects[i] === activeObject) continue

//       var objectCenter = canvasObjects[i].getCenterPoint(),
//         objectLeft = objectCenter.x,
//         objectTop = objectCenter.y,
//         objectBoundingRect = canvasObjects[i].getBoundingRect(),
//         objectHeight = objectBoundingRect.height / viewportTransform[3],
//         objectWidth = objectBoundingRect.width / viewportTransform[0]

//       // snap by the horizontal center line
//       if (isInRange(objectLeft, activeObjectLeft)) {
//         verticalInTheRange = true
//         verticalLines.push({
//           x: objectLeft,
//           y1:
//             objectTop < activeObjectTop
//               ? objectTop - objectHeight / 2 - aligningLineOffset
//               : objectTop + objectHeight / 2 + aligningLineOffset,
//           y2:
//             activeObjectTop > objectTop
//               ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
//               : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
//         })
//         activeObject.setPositionByOrigin(
//           new fabric.Point(objectLeft, activeObjectTop),
//           'center',
//           'center'
//         )
//       }

//       // snap by the left edge
//       if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
//         verticalInTheRange = true
//         verticalLines.push({
//           x: objectLeft - objectWidth / 2,
//           y1:
//             objectTop < activeObjectTop
//               ? objectTop - objectHeight / 2 - aligningLineOffset
//               : objectTop + objectHeight / 2 + aligningLineOffset,
//           y2:
//             activeObjectTop > objectTop
//               ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
//               : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
//         })
//         activeObject.setPositionByOrigin(
//           new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop),
//           'center',
//           'center'
//         )
//       }

//       // snap by the right edge
//       if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
//         verticalInTheRange = true
//         verticalLines.push({
//           x: objectLeft + objectWidth / 2,
//           y1:
//             objectTop < activeObjectTop
//               ? objectTop - objectHeight / 2 - aligningLineOffset
//               : objectTop + objectHeight / 2 + aligningLineOffset,
//           y2:
//             activeObjectTop > objectTop
//               ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
//               : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
//         })
//         activeObject.setPositionByOrigin(
//           new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop),
//           'center',
//           'center'
//         )
//       }

//       // snap by the vertical center line
//       if (isInRange(objectTop, activeObjectTop)) {
//         horizontalInTheRange = true
//         horizontalLines.push({
//           y: objectTop,
//           x1:
//             objectLeft < activeObjectLeft
//               ? objectLeft - objectWidth / 2 - aligningLineOffset
//               : objectLeft + objectWidth / 2 + aligningLineOffset,
//           x2:
//             activeObjectLeft > objectLeft
//               ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
//               : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
//         })
//         activeObject.setPositionByOrigin(
//           new fabric.Point(activeObjectLeft, objectTop),
//           'center',
//           'center'
//         )
//       }

//       // snap by the top edge
//       if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
//         horizontalInTheRange = true
//         horizontalLines.push({
//           y: objectTop - objectHeight / 2,
//           x1:
//             objectLeft < activeObjectLeft
//               ? objectLeft - objectWidth / 2 - aligningLineOffset
//               : objectLeft + objectWidth / 2 + aligningLineOffset,
//           x2:
//             activeObjectLeft > objectLeft
//               ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
//               : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
//         })
//         activeObject.setPositionByOrigin(
//           new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2),
//           'center',
//           'center'
//         )
//       }

//       // snap by the bottom edge
//       if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
//         horizontalInTheRange = true
//         horizontalLines.push({
//           y: objectTop + objectHeight / 2,
//           x1:
//             objectLeft < activeObjectLeft
//               ? objectLeft - objectWidth / 2 - aligningLineOffset
//               : objectLeft + objectWidth / 2 + aligningLineOffset,
//           x2:
//             activeObjectLeft > objectLeft
//               ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
//               : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
//         })
//         activeObject.setPositionByOrigin(
//           new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2),
//           'center',
//           'center'
//         )
//       }
//     }

//     if (!horizontalInTheRange) {
//       horizontalLines.length = 0
//     }

//     if (!verticalInTheRange) {
//       verticalLines.length = 0
//     }
//   })

//   canvas.on('before:render', function () {
//     try {
//       // @ts-ignore
//       canvas?.clearContext(canvas.contextTop)
//     } catch (error) {}
//   })

//   canvas.on('after:render', function () {
//     for (var i = verticalLines.length; i--; ) {
//       drawVerticalLine(verticalLines[i])
//     }
//     for (var i = horizontalLines.length; i--; ) {
//       drawHorizontalLine(horizontalLines[i])
//     }

//     verticalLines.length = horizontalLines.length = 0
//   })

//   canvas.on('mouse:up', function () {
//     verticalLines.length = horizontalLines.length = 0
//     canvas.renderAll()
//   })
// }
