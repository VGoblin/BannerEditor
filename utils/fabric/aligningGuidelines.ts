// @ts-nocheck

import { Canvas } from 'fabric/fabric-impl'
import _ from 'lodash'

// This is copied and modified to work with our use case.
// This part of code is used to draw line to align objects between each other
function initAligningGuidelines(canvas: Canvas, clipPath: any) {
  const ctx = canvas.getSelectionContext()

  const aligningLineOffset = 0
  const aligningLineWidthMargin = Math.max(2, Math.min(20, clipPath.width * 0.003))
  const aligningLineHeightMargin = Math.max(2, Math.min(20, clipPath.height * 0.003))
  const aligningLineWidth = 1
  const aligningLineColor = 'rgb(0,255,0)'

  let zoom = 1
  let activeObject = null
  let canvasObjects = []
  let verticalLines = []
  let horizontalLines = []
  let viewportTransform

  function drawVerticalLine(coords) {
    drawLine(
      coords.x,
      coords.y1 > coords.y2 ? coords.y2 : coords.y1,
      coords.x,
      coords.y2 > coords.y1 ? coords.y2 : coords.y1
    )
  }

  function drawHorizontalLine(coords) {
    drawLine(
      coords.x1 > coords.x2 ? coords.x2 : coords.x1,
      coords.y,
      coords.x2 > coords.x1 ? coords.x2 : coords.x1,
      coords.y
    )
  }

  function findNearestLine(edgesObject = {}, margin) {
    let minimumOffset = Infinity
    let showLineName = null

    for (const edgeName in edgesObject) {
      if (inRange(edgesObject[edgeName][0], edgesObject[edgeName][1], margin)) {
        const offset = Math.abs(edgesObject[edgeName][1] - edgesObject[edgeName][0])

        if (offset < minimumOffset) {
          minimumOffset = offset
          showLineName = edgeName
        }
      }
    }

    return [showLineName, minimumOffset]
  }

  function drawLine(x1, y1, x2, y2) {
    ctx.save()
    ctx.lineWidth = aligningLineWidth
    ctx.strokeStyle = aligningLineColor
    ctx.beginPath()
    ctx.moveTo(x1 * zoom + viewportTransform[4], y1 * zoom + viewportTransform[5])
    ctx.lineTo(x2 * zoom + viewportTransform[4], y2 * zoom + viewportTransform[5])
    ctx.stroke()
    ctx.restore()
  }

  function inRange(value1, value2, margin) {
    value1 = Math.round(value1)
    value2 = Math.round(value2)

    return _.inRange(value2, value1 - margin, value1 + margin)
  }

  canvas.on('mouse:down', function () {
    viewportTransform = canvas.viewportTransform
    zoom = canvas.getZoom()
  })

  canvas.on('object:moving', function (e) {
    if (canvas.isDragging) {
      return
    }

    if (!canvas._currentTransform) return

    // Prevent from reloading the other object at every move
    if (activeObject !== e.target) {
      canvasObjects = canvas.getObjects().filter((o) => {
        const id = e.target.hasOwnProperty('parent') ? e.target.parent.id : e.target.id

        if (o.hasOwnProperty('visible') && !o.visible) {
          return false
        }
        // Only keep the visible objects (not boundaries)
        return o.hasOwnProperty('id') && o.id !== id
      })
    }

    activeObject = e.target

    const activeObjectCenter = activeObject.getCenterPoint()
    const activeObjectBoundingRect = activeObject.getBoundingRect()
    const activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3]
    const activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0]

    horizontalLines = []
    verticalLines = []
    let computedHoritontalLines = []
    let computedVerticalLines = []

    for (let i = canvasObjects.length; i--; ) {
      const objectCenter = canvasObjects[i].getCenterPoint()
      const objectLeft = objectCenter.x
      const objectTop = objectCenter.y
      const objectBoundingRect = canvasObjects[i].getBoundingRect()
      const objectHeight = objectBoundingRect.height / viewportTransform[3]
      const objectWidth = objectBoundingRect.width / viewportTransform[0]

      const verticalEdges = {
        center: [objectCenter.y, activeObjectCenter.y],
        top: [objectCenter.y - objectHeight / 2, activeObjectCenter.y - activeObjectHeight / 2],
        bottom: [objectTop + objectHeight / 2, activeObjectCenter.y + activeObjectHeight / 2],
      }

      const horizontalEdges = {
        center: [objectLeft, activeObjectCenter.x],
        left: [objectLeft - objectWidth / 2, activeObjectCenter.x - activeObjectWidth / 2],
        right: [objectLeft + objectWidth / 2, activeObjectCenter.x + activeObjectWidth / 2],
      }

      const [showHorizontalLineName, minimumVerticalOffset] = findNearestLine(
        verticalEdges,
        aligningLineHeightMargin
      )
      const [showVerticalLineName, minimumHorizontalOffset] = findNearestLine(
        horizontalEdges,
        aligningLineWidthMargin
      )

      switch (showHorizontalLineName) {
        case 'center':
          computedHoritontalLines.push({
            y: objectTop,
            x1:
              objectLeft < activeObjectCenter.x
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectCenter.x > objectLeft
                ? activeObjectCenter.x + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectCenter.x - activeObjectWidth / 2 - aligningLineOffset,
            calculatedOffset: minimumVerticalOffset,
            objectCenterPosition: [activeObjectCenter.x, objectTop],
          })
          break

        case 'top':
          computedHoritontalLines.push({
            y: objectTop - objectHeight / 2,
            x1:
              objectLeft < activeObjectCenter.x
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectCenter.x > objectLeft
                ? activeObjectCenter.x + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectCenter.x - activeObjectWidth / 2 - aligningLineOffset,
            calculatedOffset: minimumVerticalOffset,
            objectCenterPosition: [
              activeObjectCenter.x,
              objectTop - objectHeight / 2 + activeObjectHeight / 2,
            ],
          })
          break

        case 'bottom':
          computedHoritontalLines.push({
            y: objectTop + objectHeight / 2,
            x1:
              objectLeft < activeObjectCenter.x
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectCenter.x > objectLeft
                ? activeObjectCenter.x + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectCenter.x - activeObjectWidth / 2 - aligningLineOffset,
            calculatedOffset: minimumVerticalOffset,
            objectCenterPosition: [
              activeObjectCenter.x,
              objectTop + objectHeight / 2 - activeObjectHeight / 2,
            ],
          })
          break

        default:
      }

      switch (showVerticalLineName) {
        case 'center':
          computedVerticalLines.push({
            x: objectLeft,
            y1:
              objectTop < activeObjectCenter.y
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectCenter.y > objectTop
                ? activeObjectCenter.y + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectCenter.y - activeObjectHeight / 2 - aligningLineOffset,
            calculatedOffset: minimumHorizontalOffset,
            objectCenterPosition: [objectLeft, activeObjectCenter.y],
          })
          break

        case 'left':
          computedVerticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1:
              objectTop < activeObjectCenter.y
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectCenter.y > objectTop
                ? activeObjectCenter.y + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectCenter.y - activeObjectHeight / 2 - aligningLineOffset,
            calculatedOffset: minimumHorizontalOffset,
            objectCenterPosition: [
              objectLeft - objectWidth / 2 + activeObjectWidth / 2,
              activeObjectCenter.y,
            ],
          })
          break

        case 'right':
          computedVerticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1:
              objectTop < activeObjectCenter.y
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectCenter.y > objectTop
                ? activeObjectCenter.y + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectCenter.y - activeObjectHeight / 2 - aligningLineOffset,
            calculatedOffset: minimumHorizontalOffset,
            objectCenterPosition: [
              objectLeft + objectWidth / 2 - activeObjectWidth / 2,
              activeObjectCenter.y,
            ],
          })
          break

        default:
      }
    }

    if (computedHoritontalLines.length > 0) {
      computedHoritontalLines.sort((a, b) => (a.calculatedOffset < b.calculatedOffset ? -1 : 1))
      horizontalLines = computedHoritontalLines.slice(0, 1)

      // Magnet only one at a time
      activeObject.setPositionByOrigin(
        new fabric.Point(
          computedHoritontalLines[0].objectCenterPosition[0],
          computedHoritontalLines[0].objectCenterPosition[1]
        ),
        'center',
        'center'
      )
    }

    if (computedVerticalLines.length > 0) {
      computedVerticalLines.sort((a, b) => (a.calculatedOffset < b.calculatedOffset ? -1 : 1))
      verticalLines = computedVerticalLines.slice(0, 1)

      // Magnet only one at a time
      activeObject.setPositionByOrigin(
        new fabric.Point(
          computedVerticalLines[0].objectCenterPosition[0],
          computedVerticalLines[0].objectCenterPosition[1]
        ),
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
    for (let i = verticalLines.length; i--; ) {
      drawVerticalLine(verticalLines[i])
    }
    for (let i = horizontalLines.length; i--; ) {
      drawHorizontalLine(horizontalLines[i])
    }
  })

  canvas.on('mouse:up', function () {
    verticalLines.length = horizontalLines.length = 0
    activeObject = null
    canvas.renderAll()
  })
}

export { initAligningGuidelines }
