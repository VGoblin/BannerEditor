import type { ColorResult } from 'react-color'
import React from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import SkectInput from '../UI/SkectInput'
import { rgbToHex } from '../../../../utils/helper'

type Props = {
  containerColor: string
  setContainerColor: (a: string) => void
}

const ButtonContainerColor: React.FC<Props> = ({ containerColor, setContainerColor }) => {
  const { canvas } = useCanvas()

  const onBtnTextColorChangeHandler = (color: ColorResult) => {
    canvas.getActiveObjects().map((obj) => {
      if (obj instanceof fabric.Group) {
        const hexColor = rgbToHex(color)
        setContainerColor(hexColor)
        obj.getObjects('rect')[0].set({ fill: hexColor })
      }
    })
    canvas.requestRenderAll()
  }
  return (
    <div className="my-4 w-full">
      <SkectInput
        defaultColor={containerColor}
        handler={onBtnTextColorChangeHandler}
        label="Color"
      />
    </div>
  )
}

export default ButtonContainerColor
