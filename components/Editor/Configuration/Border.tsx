import React, { ChangeEvent, useState } from 'react'
import type { IBorderValues } from './Configuration'
import type { ColorResult } from 'react-color'
import { rgbToHex } from '../../../utils/helper'
import SkectInput from './UI/SkectInput'
import PropInput from './UI/PropInput'
import { useCanvas } from '../../../hooks/useCanvas'
import { CustomObject } from '../../../utils/fabric/types'

type Props = {
  objectBorderValues: IBorderValues | undefined
  setObjectBorderValues: (a: IBorderValues) => void
  widthLabel?: string
  colorLabel?: string
}

const Border: React.FC<Props> = ({ objectBorderValues, setObjectBorderValues }) => {
  const { canvas } = useCanvas()
  const [isOpen, setIsOpen] = useState(!!objectBorderValues)

  const onBorderColorChangeHandler = (color: ColorResult) => {
    setObjectBorderValues({ width: objectBorderValues?.width!, color: rgbToHex(color) })
    const objects = canvas?.getActiveObjects()
    objects?.map((object) => {
      object.set('stroke', rgbToHex(color))
    })
    canvas?.requestRenderAll()
  }

  const onBorderWidthChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const borderSize = +e.target.value
    if (borderSize <= 0) setIsOpen(false)
    setObjectBorderValues({ color: objectBorderValues?.color!, width: borderSize })
    const objects = canvas?.getActiveObjects() as CustomObject[]
    objects?.map((obj) => {
      if (obj.objType === 'image') {
        obj.clipPath?.set({ strokeWidth: 8, stroke: '#FF0000' })
        obj.dirty = true
      } else {
        obj.set('strokeWidth', borderSize)
      }
      canvas!.fire('object:modified')
    })
    canvas?.requestRenderAll()
  }

  const onVisibilityChangeHandler = () => {
    if (isOpen) {
      setIsOpen(false)
      canvas.getActiveObjects().map((object) => object.set({ stroke: '#000000', strokeWidth: 0 }))
      // @ts-ignore
      setObjectBorderValues(null)
    } else {
      setIsOpen(true)
      setObjectBorderValues({ color: '#000000', width: 2 })
      canvas.getActiveObjects().map((object) => object.set({ stroke: '#000000', strokeWidth: 2 }))
    }
    canvas.requestRenderAll()
  }

  return (
    <>
      <div
        className=" mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold"
        onClick={onVisibilityChangeHandler}
      >
        <span>Stroke</span>
        <label
          htmlFor="small-toggle"
          className="pointer-events-none relative  inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id="small-toggle"
            className="peer sr-only"
            checked={isOpen}
            onChange={() => {}}
          />
          <div className="max-h  peer h-5 w-9 rounded-full border-2 border-black bg-white outline-none ring-0 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-white  after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full  peer-checked:after:border-white peer-focus:outline-none"></div>
        </label>
      </div>
      {objectBorderValues && (
        <div className="space-y-2 text-gray-500 ">
          <div className="my-4 space-y-2 pr-3">
            <PropInput
              type="number"
              name="border-width"
              id="border-width"
              value={objectBorderValues?.width!}
              handler={onBorderWidthChangeHandler}
              label="Weight"
            />
            <SkectInput
              defaultColor={objectBorderValues && objectBorderValues.color}
              handler={onBorderColorChangeHandler}
              label="Color"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Border
