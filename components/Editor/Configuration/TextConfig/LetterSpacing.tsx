import type { CustomObject } from '../../../../utils/fabric/types'
import React, { ChangeEvent } from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import PropInput from '../UI/PropInput'

type Props = {
  objectLetterSpacing: number
  setLetterSpacing: (a: number) => void
}

const LetterSpacing: React.FC<Props> = ({ objectLetterSpacing, setLetterSpacing }) => {
  const { canvas } = useCanvas()
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLetterSpacing(+e.target.value)
    const objects = canvas?.getActiveObjects() as CustomObject[]
    objects?.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        obj.getObjects('textbox')[0].set('charSpacing' as keyof fabric.Object, +e.target.value)
      } else {
        obj.set('charSpacing' as keyof fabric.Object, +e.target.value)
      }
    })
    canvas?.requestRenderAll()
  }

  return (
    <PropInput
      type="number"
      name="letter-spacing"
      id="letter-spacing"
      value={objectLetterSpacing}
      handler={onChangeHandler}
      label="Letter Spacing"
    />
  )
}

export default LetterSpacing
