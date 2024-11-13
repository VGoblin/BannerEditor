import type { ChangeEvent } from 'react'
import type { Object } from 'fabric/fabric-impl'
import type { CustomTextbox } from '../../../../utils/fabric/types'
import React from 'react'
import { fabric } from 'fabric'
import PropInput from '../UI/PropInput'
import { useCanvas } from '../../../../hooks/useCanvas'

type Props = {
  objectFontSize: number
  setObjectFontSize: (value: number) => void
}

const FontSize = ({ objectFontSize, setObjectFontSize }: Props) => {
  const { canvas } = useCanvas()
  const onFontSizeChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return
    setObjectFontSize(+e.target.value)
    const objects = canvas.getActiveObjects() as CustomTextbox[]
    objects.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        obj.getObjects('textbox')[0].set('fontSize' as keyof Object, +e.target.value)
      } else obj.set('fontSize', +e.target.value)

      obj.set('fontSize', +e.target.value)
    })
    canvas.requestRenderAll()
  }

  return (
    <>
      <PropInput
        type="number"
        name="font-size"
        id="font-size"
        value={objectFontSize}
        handler={onFontSizeChangeHandler}
        label="Font Size"
      />
    </>
  )
}

export default FontSize
