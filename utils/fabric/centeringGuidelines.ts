// @ts-nocheck

import { fabric } from 'fabric'

/**
 *  This is copied and modified to work with our use case.
 * This part of code is used to draw line for the center or the middle of the canvas
 *
 * Original writer:
 * Augments canvas by assigning to `onObjectMove` and `onAfterRender`.
 * This kind of sucks because other code using those methods will stop functioning.
 * Need to fix it by replacing callbacks with pub/sub kind of subscription model.
 * (or maybe use existing fabric.util.fire/observe (if it won't be too slow))
 */
function initCenteringGuidelines(canvas, clipPath) {
  // const clipPath = {
  //   width: 1200,
  //   height: 1200,
  // }
  const canvasWidth = clipPath.width
  const canvasHeight = clipPath.height
  // const canvasWidthCenter = clipPath.width / 2
  // const canvasHeightCenter = clipPath.height / 2
  const canvasWidthCenter = 2500
  const canvasHeightCenter = 2500
  const canvasWidthCenterMap = {}
  const canvasHeightCenterMap = {}
  const centerLineWidthMargin = Math.max(2, Math.min(20, clipPath.width * 0.003))
  const aligningLineHeightMargin = Math.max(2, Math.min(20, clipPath.height * 0.003))
  const centerLineColor = 'rgba(255,0,241,0.5)'
  const centerLineWidth = 1
  const ctx = canvas.getSelectionContext()

  let viewportTransform
  let isInVerticalCenter = false
  let isInHorizontalCenter = false

  for (
    let i = canvasWidthCenter - centerLineWidthMargin,
      len = canvasWidthCenter + centerLineWidthMargin;
    i <= len;
    i++
  ) {
    canvasWidthCenterMap[Math.round(i)] = true
  }
  for (
    let i = canvasHeightCenter - aligningLineHeightMargin,
      len = canvasHeightCenter + aligningLineHeightMargin;
    i <= len;
    i++
  ) {
    canvasHeightCenterMap[Math.round(i)] = true
  }

  function showVerticalCenterLine() {
    showCenterLine(clipPath.width / 2, window.innerHeight + 33, clipPath.width / 2, 0)
  }

  function showHorizontalCenterLine() {
    showCenterLine(0, window.innerHeight / 2 + 66, clipPath.width, window.innerHeight / 2 + 66)
  }

  function showCenterLine(x1, y1, x2, y2) {
    ctx.save()
    ctx.strokeStyle = centerLineColor
    ctx.lineWidth = centerLineWidth
    ctx.beginPath()
    ctx.moveTo(
      (window.innerWidth - clipPath.width * viewportTransform[0]) / 2 + x1 * viewportTransform[0],
      (window.innerHeight - clipPath.height * viewportTransform[3]) / 2 + y1 * viewportTransform[3]
    )
    ctx.lineTo(
      (window.innerWidth - clipPath.width * viewportTransform[0]) / 2 + x2 * viewportTransform[0],
      (window.innerHeight - clipPath.height * viewportTransform[3]) / 2 + y2 * viewportTransform[3]
    )
    // ctx.moveTo(960, 946)
    // ctx.lineTo(960, 0)
    // console.log(window.innerHeight)
    // console.log(
    //   'moveTO',
    //   (window.innerWidth - clipPath.width * viewportTransform[0]) / 2 + x1 * viewportTransform[0],
    //   (window.innerHeight - clipPath.height * viewportTransform[3]) / 2 + y1 * viewportTransform[3]
    // )
    // console.log(
    //   'Line TO',
    //   (window.innerWidth - clipPath.width * viewportTransform[0]) / 2 + x2 * viewportTransform[0],
    //   (window.innerHeight - clipPath.height * viewportTransform[3]) / 2 + y2 * viewportTransform[3]
    // )
    // 473
    // ctx.moveTo(2500, 2500)
    // ctx.lineTo(2500, 0)
    ctx.stroke()
    ctx.restore()
  }

  canvas.on('mouse:down', function () {
    viewportTransform = canvas.viewportTransform
  })

  canvas.on('object:moving', function (e) {
    if (canvas.isDragging) {
      return
    }

    const objectCenter = e.target.getCenterPoint()

    isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap
    isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap

    if (isInHorizontalCenter && isInVerticalCenter) {
      e.target.setPositionByOrigin(
        new fabric.Point(canvasWidthCenter, canvasHeightCenter),
        'center',
        'center'
      )
    } else if (isInHorizontalCenter) {
      e.target.setPositionByOrigin(
        new fabric.Point(objectCenter.x, canvasHeightCenter),
        'center',
        'center'
      )
    } else if (isInVerticalCenter) {
      e.target.setPositionByOrigin(
        new fabric.Point(canvasWidthCenter, objectCenter.y),
        'center',
        'center'
      )
    }
  })

  canvas.on('before:render', function () {
    if (canvas.contextTop) {
      canvas.clearContext(canvas.contextTop)
    }
  })

  canvas.on('after:render', function () {
    if (isInVerticalCenter) {
      showVerticalCenterLine()
    }
    if (isInHorizontalCenter) {
      showHorizontalCenterLine()
    }
  })

  canvas.on('mouse:up', function () {
    // clear these values, to stop drawing guidelines once mouse is up
    isInVerticalCenter = isInHorizontalCenter = false
    canvas.renderAll()
  })
}

export { initCenteringGuidelines }
