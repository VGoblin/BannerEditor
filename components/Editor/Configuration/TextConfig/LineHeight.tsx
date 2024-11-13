import React, { ChangeEvent } from 'react'
import { useCanvas } from '../../../../hooks/useCanvas'
import PropInput from '../UI/PropInput'

type Props = {
  lineHeight: number
  setLineHeight: (a: number) => void
}

const LineHeight: React.FC<Props> = ({ lineHeight, setLineHeight }) => {
  const { canvas } = useCanvas()
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLineHeight(+e.target.value)
    const objects = canvas?.getActiveObjects()
    objects?.map((object) => {
      object.set('lineHeight' as keyof fabric.Object, +e.target.value)
    })
    canvas?.requestRenderAll()
  }

  return (
    <PropInput
      type="number"
      name="line-height"
      id="line-height"
      value={lineHeight}
      handler={onChangeHandler}
      label="Line Height"
      step="0.01"
    />
  )
}

export default LineHeight
