import React, { ChangeEvent, useState, useEffect } from 'react'
import PropInput from './UI/PropInput'
import { useCanvas } from '../../../hooks/useCanvas'
import type { IObjectBoundRect } from './Configuration'

type Props = {
  objectBoundingRect: IObjectBoundRect | undefined
  setObjectBoundingRect: (a: IObjectBoundRect) => void
}

const Coordinates: React.FC<Props> = ({ objectBoundingRect, setObjectBoundingRect }) => {
  const { canvas, frame } = useCanvas()
  const FRAMEWIDTH = frame?.width!
  const FRAMEHEIGHT = frame?.height!
  const frameLeft = (canvas.getWidth() - FRAMEWIDTH) / 2
  const frameTop = (canvas.getHeight() - FRAMEHEIGHT) / 2
  const onCoordinatesChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const objects = canvas.getActiveObjects()
    if (e.target.name === 'x') {
      if (objectBoundingRect) {
        setObjectBoundingRect({ ...objectBoundingRect, left: +e.target.value + frameLeft })
      }
      objects?.map((object) => {
        if (object.left) {
          object.set('left', +e.target.value + frameLeft)
        } else return
      })
    } else {
      if (objectBoundingRect) {
        setObjectBoundingRect({ ...objectBoundingRect, top: +e.target.value + frameTop })
      }
      objects?.map((object) => {
        if (object.top) {
          object.set('top', +e.target.value + frameTop)
        } else return
      })
    }
    canvas.requestRenderAll()
  }

  return (
    <div>
      <label htmlFor="x" className="flex justify-between text-sm text-editorGray">
        Position
        <div>
          <PropInput
            type="number"
            name="x"
            id="x"
            min={0}
            value={objectBoundingRect ? Math.round(objectBoundingRect.left - frameLeft) : 0}
            handler={onCoordinatesChangeHandler}
          />
          <PropInput
            type="number"
            name="y"
            id="y"
            min={0}
            value={objectBoundingRect ? Math.round(objectBoundingRect.top - frameTop) : 0}
            handler={onCoordinatesChangeHandler}
          />
        </div>
      </label>
    </div>
  )
}

export default Coordinates
