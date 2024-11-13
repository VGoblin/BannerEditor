import type { Object } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import React, { ChangeEvent } from 'react'
import { useCanvas } from '../../../../hooks/useCanvas'
import PropInput from '../UI/PropInput'
type Props = {
  ellipseRadius: number
  setEllipseRadius: (a: number) => void
}

const EllipseSize: React.FC<Props> = ({ ellipseRadius, setEllipseRadius }) => {
  const { canvas } = useCanvas()

  const onSizeChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value < 0) return
    canvas.getActiveObjects().map((obj) => {
      if ('radius' in obj) {
        setEllipseRadius(+e.target.value)
        obj.set('radius' as keyof Object, +e.target.value)
        canvas.requestRenderAll()
        // If object has BgPattern we should keep sync clipPath's radius value with Circle radius
        if (obj.clipPath) {
          obj.clipPath.set('radius' as keyof Object, +e.target.value)
        }
      }
    })
  }

  return (
    <>
      <PropInput
        type="number"
        name="ellipse-size"
        id="ellipse-size"
        label="Size"
        value={ellipseRadius}
        handler={onSizeChangeHandler}
        min={0}
      />
    </>
  )
}

export default EllipseSize
