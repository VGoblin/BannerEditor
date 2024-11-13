import type { ChangeEvent } from 'react'
import React from 'react'
import PropInput from './UI/PropInput'
import { useCanvas } from '../../../hooks/useCanvas'
import { circleInputValidation } from '../../../utils/helper'

type Props = {
  objectAngle: number
  setObjectAngle: (a: number) => void
}

const Angle = ({ objectAngle, setObjectAngle }: Props) => {
  const { canvas } = useCanvas()

  const onRotationChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const objects = canvas?.getActiveObjects()
    const intValue = circleInputValidation(+e.target.value)

    setObjectAngle(intValue)
    objects?.map((object) => {
      object.rotate(intValue)
    })
    canvas?.requestRenderAll()
  }

  return (
    <div className="group relative">
      <PropInput
        type="number"
        name="rotation"
        id="rotation"
        label="Rotation"
        value={Math.round(objectAngle)}
        handler={onRotationChangeHandler}
        min={0}
        max={360}
      />
      <span className="pointer-events-none absolute top-0 right-1 group-focus-within:hidden group-hover:hidden">
        &deg;
      </span>
    </div>
  )
}

export default Angle
