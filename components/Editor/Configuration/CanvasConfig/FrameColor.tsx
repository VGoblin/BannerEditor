import React from 'react'
import { ColorResult } from 'react-color'
import { useCanvas } from '../../../../hooks/useCanvas'
import { rgbToHex } from '../../../../utils/helper'
import SkectInput from '../UI/SkectInput'

const FrameColor: React.FC = () => {
  const { canvas, frame } = useCanvas()
  const onFrameColorChangeHandler = (e: ColorResult) => {
    if (!frame || !frame.fill) return
    frame.fill = rgbToHex(e)
    frame.dirty = true
    canvas.fire('object:modified')
    canvas?.requestRenderAll()
  }
  return (
    <SkectInput
      label="Color"
      defaultColor={frame?.fill ? (frame.fill as string) : '#ffffff'}
      handler={onFrameColorChangeHandler}
    />
  )
}

export default FrameColor
