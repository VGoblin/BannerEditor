import type { CustomObject } from '../../../utils/fabric/types'
import React, { ChangeEvent } from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../hooks/useCanvas'
import PropInput from './UI/PropInput'

type Props = {
  objectOpacity: number
  setObjectOpacity: (a: number) => void
  target?: 'textbox' | 'rect'
}

const Opacity: React.FC<Props> = ({ objectOpacity, setObjectOpacity, target = 'textbox' }) => {
  const { canvas } = useCanvas()

  const onOpacityChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const objects = canvas?.getActiveObjects() as CustomObject[]
    setObjectOpacity(+e.target.value / 100)
    objects?.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        obj.getObjects(target)[0].set({ opacity: +e.target.value / 100 })
      } else obj.set({ opacity: +e.target.value / 100 })
    })
    canvas.requestRenderAll()
  }

  return (
    <>
      <PropInput
        type="range"
        name="opacity"
        id="opacity"
        value={objectOpacity ? objectOpacity * 100 : 1}
        handler={onOpacityChangeHandler}
        label="Opacity"
        suffix={
          <span className="min-w-[42px] pr-3 text-right font-bold text-black">
            {Math.round(objectOpacity * 100)}%
          </span>
        }
      />
    </>
  )
}

export default Opacity
