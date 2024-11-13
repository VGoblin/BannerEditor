import type { CustomObject } from '../../../../utils/fabric/types'
import type { Object } from 'fabric/fabric-impl'
import React, { ChangeEvent } from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import PropInput from '../UI/PropInput'

type Props = {
  objectRadius: number
  setObjectRadius: (a: number) => void
  label: string
}

const ButtonContainerRadius: React.FC<Props> = ({ objectRadius, setObjectRadius, label }) => {
  const { canvas } = useCanvas()
  const onRadiusChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const objects = canvas.getActiveObjects() as CustomObject[]
    objects.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        setObjectRadius(+e.target.value)
        obj
          .getObjects('rect')[0]
          .set('rx' as keyof Object, +e.target.value)
          .set('ry' as keyof Object, +e.target.value)
      }
    })
    canvas?.requestRenderAll()
  }

  return (
    <PropInput
      type="range"
      name="radius"
      id="radius"
      value={objectRadius}
      handler={onRadiusChangeHandler}
      label={label}
      className="pr-3"
      suffix={
        <span className="min-w-[42px] text-right font-bold text-black">
          {Math.round(objectRadius)}%
        </span>
      }
    />
  )
}

export default ButtonContainerRadius
