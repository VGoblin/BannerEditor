import type { ColorResult } from 'react-color'
import React from 'react'
import SkectInput from '../UI/SkectInput'
import { useCanvas } from '../../../../hooks/useCanvas'
import { fabric } from 'fabric'
import { rgbToHex } from '../../../../utils/helper'

type Props = {
  buttonTextColor: string
  setButtonTextColor: (a: string) => void
}

const ButtonTextColor: React.FC<Props> = ({ buttonTextColor, setButtonTextColor }) => {
  const { canvas } = useCanvas()

  const onBtnTextColorChangeHandler = (color: ColorResult) => {
    canvas.getActiveObjects().map((obj) => {
      if (obj instanceof fabric.Group) {
        const hexColor = rgbToHex(color)
        setButtonTextColor(hexColor)
        obj.getObjects('textbox')[0].set({ fill: hexColor })
      }
    })
    canvas.requestRenderAll()
  }

  return (
    <div className="my-4 w-full">
      <SkectInput
        defaultColor={buttonTextColor}
        handler={onBtnTextColorChangeHandler}
        label="Color"
      />
    </div>
  )
}

export default ButtonTextColor
