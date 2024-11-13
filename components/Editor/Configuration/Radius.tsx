import type { CustomRect } from '../../../utils/fabric/types'
import type { Rect } from 'fabric/fabric-impl'
import type { ChangeEvent } from 'react'
import React from 'react'
import { useCanvas } from '../../../hooks/useCanvas'
import PropInput from './UI/PropInput'

type Props = {
  objectRadius: number
  setObjectRadius: (a: number) => void
  label?: string
}

const Radius = ({ objectRadius, setObjectRadius, label = 'Corner Radius' }: Props) => {
  const { canvas } = useCanvas()

  const onRadiusChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const objects = canvas?.getActiveObjects() as CustomRect[]
    objects?.map((obj: CustomRect) => {
      if (obj.type === 'group' || obj.objType === 'image') {
        const mask = obj.clipPath as Rect
        mask.set({
          rx: +e.target.value,
          ry: +e.target.value,
        })
        obj.set({ dirty: true })
      } else {
        obj.set({
          rx: +e.target.value,
          ry: +e.target.value,
        })
        if (obj.clipPath) {
          // if obj has clipPath this mean it has bgPattern
          // Because of that we should keep sync clipPath's rx with Object rx
          const clipPath = obj.clipPath as Rect
          clipPath.set({
            rx: +e.target.value,
            ry: +e.target.value,
          })
        }
      }
    })
    setObjectRadius(+e.target.value)
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

export default Radius
