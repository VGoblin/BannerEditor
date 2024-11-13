// @ts-nocheck
import type { CustomTextbox } from './types'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { getCanvasInstance } from './fabric'
import { getJSON } from '../helper'

interface IGenerateTextboxProps {
  fontSize?: number
  returnJSON?: boolean
  uuid?: string
  left?: number
  top?: number
  fill?: string
  name?: string
  fontWeight?: number
  autoResize?: boolean
  selectedFontFamily?: string
  text?: string
}

/**
 * It creates a new textbox object, sets up some event listeners, centers the object on the canvas,
 * sets up the object controls, sets the object as the active object, and then adds the object to the
 * canvas
 */
export const generateTextbox = ({
  uuid = uuidv4(),
  fontSize = 24,
  returnJSON = false,
}: IGenerateTextboxProps) => {
  const canvas = getCanvasInstance()
  fabric.Textbox.prototype.verticalAlign = "top";
  fabric.Textbox.prototype._getTopOffset = function() {
    let offsetY = 0;
    if (this.verticalAlign == "middle")
      offsetY = (this.height - this.calcTextHeight()) / 2;
    if (this.verticalAlign == "bottom")
      offsetY = (this.height - this.calcTextHeight());
    return -this.height / 2 + offsetY;
  };

  fabric.Textbox.prototype.getSelectionStartFromPointer = function(e) {
    let offsetY = 0;
    if (this.verticalAlign == "middle")
      offsetY = (this.height - this.calcTextHeight()) / 2;
    if (this.verticalAlign == "bottom")
      offsetY = (this.height - this.calcTextHeight());
    var mouseOffset = this.getLocalPointer(e),
        prevWidth = 0,
        width = 0,
        height = 0,
        charIndex = 0,
        lineIndex = 0,
        lineLeftOffset,
        line;
    mouseOffset.y -= offsetY;
    for (var i = 0, len = this._textLines.length; i < len; i++) {
      if (height <= mouseOffset.y) {
        height += this.getHeightOfLine(i) * this.scaleY;
        lineIndex = i;
        if (i > 0) {
          charIndex += this._textLines[i - 1].length + this.missingNewlineOffset(i - 1);
        }
      }
      else {
        break;
      }
    }
    lineLeftOffset = this._getLineLeftOffset(lineIndex);
    width = lineLeftOffset * this.scaleX;
    line = this._textLines[lineIndex];
    // handling of RTL: in order to get things work correctly,
    // we assume RTL writing is mirrored compared to LTR writing.
    // so in position detection we mirror the X offset, and when is time
    // of rendering it, we mirror it again.
    if (this.direction === 'rtl') {
      mouseOffset.x = this.width * this.scaleX - mouseOffset.x + width;
    }
    for (var j = 0, jlen = line.length; j < jlen; j++) {
      prevWidth = width;
      // i removed something about flipX here, check.
      width += this.__charBounds[lineIndex][j].kernedWidth * this.scaleX;
      if (width <= mouseOffset.x) {
        charIndex++;
      }
      else {
        break;
      }
    }
    return this._getNewSelectionStartFromOffset(mouseOffset, prevWidth, width, charIndex, jlen);
  };

  const textObj = new fabric.Textbox('Lorem Ipsum', {
    fill: '#000000',
    name: 'Text',
    fontSize: fontSize ? fontSize : 24,
    isWrapping: true,
    fontFamily: '',
    fontWeight: 400,
    id: uuid,
    fontVariants: [],
    selectedFontVariant: '',
    selectedFontFamily: 'Inter',
    autoResize: true,
    objType: 'textbox',
  } as CustomTextbox)
  var lastHeight = 0,
    lastWidth = 0
  const updateTextSize = (obj: any) => {
    if (obj.transform && obj.transform.target.autoResize) {
      const { target } = obj.transform
      const { fontSize, scaleX, scaleY } = target
      const controlPoint = target.__corner

      //mr and ml are the only controlPoints that dont modify textbox height
      if (controlPoint && controlPoint != 'mr' && controlPoint != 'ml') {
        lastHeight = Math.max(target.calcTextHeight(), target.height * target.scaleY)
        lastWidth = Math.max(target.calcTextWidth(), target.width * target.scaleX)
      }

      if (controlPoint && controlPoint != 'mr' && controlPoint != 'ml') {
        target.set({
          scaleX: 1,
          width: lastWidth || target.width,
        })
      }

      target.set({
        height: lastHeight || target.height,
        scaleY: 1,
      })
      canvas.renderAll()
    }
  }

  textObj.on('scaling', updateTextSize)
  textObj.on('resizing', updateTextSize)
  textObj.on('editing:entered', updateTextSize)
  canvas.on('text:changed', () => {
    lastHeight = Math.max(lastHeight, textObj.height || 0)
    textObj.set({
      height: Math.max(lastHeight, textObj.height || 0),
      scaleY: 1,
    })
  })
  canvas.on('before:render', () => {
    if (textObj.selected)
    {
      lastHeight = Math.max(lastHeight, textObj.height || 0);
      textObj.set({		
        height: Math.max(lastHeight, textObj.height || 0),
        scaleY: 1,
      });
    }
  })

  canvas.centerObject(textObj)

  if (returnJSON) {
    return getJSON(textObj)
  }

  textObj.enterEditing()
  canvas.add(textObj)
  canvas.setActiveObject(textObj)
  canvas.requestRenderAll()
}

function isTransformCentered(transform) {
  return transform.originX === 'center' && transform.originY === 'center'
}

export const generateTextboxObj = ({
  uuid = uuidv4(),
  fill = '#000000',
  name = 'Text',
  fontSize = 24,
  fontWeight = 400,
  returnJSON = false,
  autoResize = true,
  selectedFontFamily = 'Inter',
  left,
  top,
  text,
  height,
  ...args
}: IGenerateTextboxProps) => {
  const textObj = new fabric.Textbox(text || 'Text', {
    left,
    top,
    height: height || 100,
    fill: fill,
    name: name,
    fontSize: fontSize,
    width: 300,
    isWrapping: true,
    fontFamily: '',
    fontWeight: fontWeight,
    id: uuid || uuidv4(),
    fontVariants: [],
    selectedFontVariant: '',
    selectedFontFamily: selectedFontFamily,
    autoResize: autoResize,
    objType: 'textbox',
    ...args,
  } as CustomTextbox)

  function changeWidth(eventData, transform, x, y) {
    const target = transform.target,
      localPoint = fabric.controlsUtils.getLocalPoint(
        transform,
        transform.originX,
        transform.originY,
        x,
        y
      ),
      strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      multiplier = isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width,
      newWidth = Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding
    target.set('width', Math.round(Math.max(newWidth, 0)))
    // target.set('height', lastHeight || target.height)
    return oldWidth !== newWidth
  }

  let lastHeight: number = height //textObj.getScaledHeight()
  const textBoxControls = textObj.controls
  textBoxControls.mr = new fabric.Control({
    x: 0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionName: 'resizing',
  })

  textBoxControls.ml = new fabric.Control({
    x: -0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionName: 'resizing',
  })

  const updateTextSize = (obj: any) => {
    if (textObj.calcTextHeight() > textObj.getScaledHeight()) {
      textObj.set({
        height: lastHeight,
        scaleY: 1,
      })
      return
    }

    if (obj.transform && obj.transform.target) {
      const { transform } = obj
      const { target } = transform
      const controlPoint = transform.corner

      if (controlPoint && controlPoint !== 'mr' && controlPoint !== 'ml') {
        lastHeight = Math.round(target.height * target.scaleY)
      }
    }

    textObj.set({
      //fontSize: newFontSize > 8 ? newFontSize : 8,
      height: lastHeight || textObj.height,
      scaleY: 1,
    })
  }

  textObj.on('scaling', updateTextSize)
  textObj.on('resizing', updateTextSize)
  textObj.on('editing:exited', () => {
    if (textObj.autoResize) {
      let newFontSize = Math.floor(
        fontSize * (textObj.scaleX == 1 ? textObj.scaleY : textObj.scaleX)
      )
    }
    const textHeight = textObj.calcTextHeight()
    if (textHeight > textObj.getScaledHeight()) {
      lastHeight = Math.round(textHeight)
      textObj.set({
        height: lastHeight,
        scaleY: 1,
      })
    }
  })
  textObj.on('changed', updateTextSize)
  return textObj
}

export const generateTextbox2 = ({}: IGenerateTextboxProps) => {
  const canvas = getCanvasInstance({})
  const textObj = generateTextboxObj({})

  /*
  function changeWidth(eventData, transform, x, y) {
  var target = transform.target, localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y),
      strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      newWidth = Math.abs(localPoint.x / target.scaleX) - strokePadding;
  target.set('width', Math.max(newWidth, 0));
  return true;
}
  */
  // textObj.setControlsVisibility({
  //   ml: false,
  //   bl: false,
  //   br: false,
  //   tl: false,
  //   tr: false,
  // })

  canvas.centerObject(textObj)

  // if (returnJSON) {
  //   return getJSON(textObj)
  // }

  //textObj.enterEditing()
  canvas.add(textObj)
  canvas.setActiveObject(textObj)
  canvas.requestRenderAll()
}
