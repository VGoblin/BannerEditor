import type { IEllipseAngle } from '../Configuration'
import type { Object } from 'fabric/fabric-impl'
import React, { ChangeEvent } from 'react'
import PropInput from '../UI/PropInput'
import { useCanvas } from '../../../../hooks/useCanvas'
import { circleInputValidation } from '../../../../utils/helper'

type Props = {
  ellipseAngles: IEllipseAngle
  setEllipseAngles: (a: IEllipseAngle) => void
}

const StartAngle: React.FC<Props> = ({ ellipseAngles, setEllipseAngles }) => {
  const { canvas } = useCanvas()

  const onAnglesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const objects = canvas.getActiveObjects()
    const intValue = circleInputValidation(+e.target.value)
    if (e.target.id === 'start-angle') {
      setEllipseAngles({ start: intValue, end: ellipseAngles.end })
      objects.map((object) => object.set('startAngle' as keyof Object, intValue))
    } else {
      setEllipseAngles({ start: ellipseAngles.start, end: intValue })
      objects.map((object) => object.set('endAngle' as keyof Object, intValue))
    }
    canvas.requestRenderAll()
  }

  return (
    <>
      <label htmlFor="start-angle" className="flex justify-between text-editorGray">
        Angles
        <div>
          <PropInput
            type="number"
            name="start-angle"
            id="start-angle"
            min={0}
            max={360}
            value={ellipseAngles ? Math.round(ellipseAngles.start) : 0}
            handler={onAnglesChangeHandler}
          />
          <PropInput
            type="number"
            name="end-angle"
            id="end-angle"
            min={0}
            max={360}
            value={ellipseAngles ? Math.round(ellipseAngles.end) : 0}
            handler={onAnglesChangeHandler}
          />
        </div>
      </label>
    </>
  )
}

export default StartAngle
