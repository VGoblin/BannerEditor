import type { CustomObject } from '../../../../utils/fabric/types'
import React, { ChangeEvent, useState } from 'react'
import type { ColorResult } from 'react-color'
import { fabric } from 'fabric'
import SkectInput from '../UI/SkectInput'
import PropInput from '../UI/PropInput'

import { IBorderValues } from '../Configuration'
import { rgbToHex } from '../../../../utils/helper'
import { useCanvas } from '../../../../hooks/useCanvas'

type Props = {
  objectBorderValues: IBorderValues | undefined
  setObjectBorderValues: (a: IBorderValues) => void
  widthLabel?: string
  colorLabel?: string
}

const ButtonStroke: React.FC<Props> = ({ objectBorderValues, setObjectBorderValues }) => {
  const { canvas } = useCanvas()
  const [isOpen, setIsOpen] = useState(!!objectBorderValues)

  const onBorderColorChangeHandler = (color: ColorResult) => {
    setObjectBorderValues({ width: objectBorderValues?.width!, color: rgbToHex(color) })
    const objects = canvas?.getActiveObjects() as CustomObject[]
    objects?.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        obj.getObjects('rect')[0].set({ stroke: rgbToHex(color) })
      }
    })
    canvas?.requestRenderAll()
  }

  const onBorderWidthChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const borderSize = +e.target.value
    if (borderSize <= 0) setIsOpen(false)
    setObjectBorderValues({ color: objectBorderValues?.color!, width: borderSize })
    const objects = canvas?.getActiveObjects() as CustomObject[]
    objects?.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        obj.getObjects('rect')[0].set({ strokeWidth: borderSize })
      }
      canvas!.fire('object:modified')
    })
    canvas?.requestRenderAll()
  }

  const onVisibilityChangeHandler = () => {
    if (isOpen) {
      setIsOpen(false)
      const objects = canvas?.getActiveObjects() as CustomObject[]
      objects.map((obj) => {
        if (obj.objType === 'button' && obj instanceof fabric.Group) {
          obj.getObjects('rect')[0].set({ strokeWidth: 0, stroke: '#000000' })
        }
      })
      // @ts-ignore
      setObjectBorderValues(null)
    } else {
      setIsOpen(true)
      setObjectBorderValues({ color: '#000000', width: 2 })
      const objects = canvas?.getActiveObjects() as CustomObject[]
      objects.map((obj) => {
        if (obj.objType === 'button' && obj instanceof fabric.Group) {
          obj.getObjects('rect')[0].set({ strokeWidth: 2, stroke: '#000000' })
        }
      })
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

export default ButtonStroke
