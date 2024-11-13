import type { ColorResult } from 'react-color'
import type { Object } from 'fabric/fabric-impl'
import type { IBorderValues } from '../Configuration'
import React, { ChangeEvent } from 'react'
import PropInput from '../UI/PropInput'
import { useCanvas } from '../../../../hooks/useCanvas'
import SkectInput from '../UI/SkectInput'
import { rgbToHex } from '../../../../utils/helper'
type Props = {
  objectBorderValues: IBorderValues
  setObjectBorderValues: (a: IBorderValues) => void
}

const Donut: React.FC<Props> = ({ objectBorderValues, setObjectBorderValues }) => {
  const { canvas } = useCanvas()

  const onStrokeWidthChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value < 0) return
    setObjectBorderValues({ color: objectBorderValues?.color!, width: +e.target.value })
    const objects = canvas?.getActiveObjects()
    objects?.map((object) => {
      object.set('strokeWidth', +e.target.value)
      canvas!.fire('object:modified')
    })
    canvas?.requestRenderAll()
  }

  const onStrokeColorChangeHandler = (color: ColorResult) => {
    setObjectBorderValues({ width: objectBorderValues.width, color: rgbToHex(color) })
    const objects = canvas?.getActiveObjects()
    if (objects) {
      objects.map((object) => {
        object.set('stroke', rgbToHex(color))
      })
    }
    canvas?.requestRenderAll()
  }

  return (
    <>
      <div className="group relative">
        <PropInput
          type="number"
          label="Donut"
          name="donut"
          id="donut"
          handler={onStrokeWidthChangeHandler}
          value={objectBorderValues ? objectBorderValues.width : 0}
          min={0}
        />
        <span className="pointer-events-none absolute top-0 right-1 group-focus-within:hidden group-hover:hidden">
          &deg;
        </span>
      </div>
      <div className="my-4 w-full pr-3">
        <SkectInput
          defaultColor={objectBorderValues ? objectBorderValues.color : '#FFFFFFFF'}
          handler={objectBorderValues ? onStrokeColorChangeHandler : () => {}}
          label="Color"
        />
      </div>
    </>
  )
}

export default Donut

// const onShadowColorChangeHandler = (color: ColorResult) => {
//   setObjectShadowValues({ ...(objectShadowValues as IShadowValues), color: color.hex })
//   const objects = canvas?.getActiveObjects()
//   if (objects) {
//     objects.map((object) => {
//       const shadow = object.shadow as Shadow
//       if (shadow) shadow.color = color.hex
//     })
//   }
//   canvas?.requestRenderAll()
// }
