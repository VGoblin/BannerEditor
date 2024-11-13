import type { Shadow } from 'fabric/fabric-impl'
import type { IShadowValues } from '../../../utils/fabric/types'
import { ChangeEvent, useEffect } from 'react'
import React, { useState } from 'react'
import { ColorResult } from 'react-color'
import { generateShadow } from '../../../utils/fabric/fabric'

import SkectInput from './UI/SkectInput'
import PropInput from './UI/PropInput'
import type { InputNames } from './Configuration'
import { useCanvas } from '../../../hooks/useCanvas'
import { rgbToHex } from '../../../utils/helper'

type Props = {
  objectShadowValues: IShadowValues
  setObjectShadowValues: (a: IShadowValues) => void
  title?: string
}

const BoxShadow = ({ objectShadowValues, setObjectShadowValues, title = 'Shadow' }: Props) => {
  const { canvas } = useCanvas()
  const [isOpen, setIsOpen] = useState(!!objectShadowValues)

  const onShadowChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!objectShadowValues) return
    setObjectShadowValues({ ...objectShadowValues, [e.target.name]: e.target.value })
    const objects = canvas?.getActiveObjects()
    const changedInputName = e.target.name as InputNames
    if (objects) {
      objects.map((object) => {
        const shadow = object.shadow as Shadow
        shadow[changedInputName] = +e.target.value
      })
    }
    canvas?.requestRenderAll()
  }

  const onVisibilityChangeHandler = () => {
    if (isOpen) {
      setIsOpen(false)
      canvas.getActiveObjects().map((object) => object.set('shadow', undefined))
      // @ts-ignore
      setObjectShadowValues(null)
    } else {
      setIsOpen(true)
      setObjectShadowValues({ offsetX: 3, offsetY: 3, blur: 1, color: '#FFFFFF' })
      canvas.getActiveObjects().map((object) => object.set('shadow', generateShadow()))
    }
    canvas.fire('object:modified')
    canvas.requestRenderAll()
  }

  const onShadowColorChangeHandler = (color: ColorResult) => {
    setObjectShadowValues({ ...(objectShadowValues as IShadowValues), color: rgbToHex(color) })
    const objects = canvas?.getActiveObjects()
    if (objects) {
      objects.map((object) => {
        const shadow = object.shadow as Shadow
        if (shadow) shadow.color = rgbToHex(color)
      })
    }
    canvas?.requestRenderAll()
  }

  useEffect(() => {
    setIsOpen(!!objectShadowValues)
  }, [objectShadowValues])

  return (
    <>
      <div
        className=" mt-4 flex h-5 w-full items-center justify-between pr-3 text-start text-sm font-semibold"
        onClick={onVisibilityChangeHandler}
      >
        <span>{title}</span>
        <label
          htmlFor="small-toggle"
          className="pointer-events-none relative inline-flex cursor-pointer items-center"
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
      {objectShadowValues && (
        <div className="space-y-2 text-gray-500">
          <label htmlFor="offsetX" className="flex justify-between text-sm text-editorGray">
            Offset
            <div>
              <PropInput
                type="number"
                name="offsetX"
                id="offsetX"
                min={0}
                value={objectShadowValues.offsetX ? Math.round(objectShadowValues.offsetX) : 0}
                handler={onShadowChangeHandler}
              />
              <PropInput
                type="number"
                name="offsetY"
                id="offsetY"
                min={0}
                value={objectShadowValues.offsetY ? Math.round(objectShadowValues.offsetY) : 0}
                handler={onShadowChangeHandler}
              />
            </div>
          </label>

          <PropInput
            type="number"
            name="blur"
            id="blur"
            value={objectShadowValues ? objectShadowValues.blur : 0}
            handler={onShadowChangeHandler}
            disabled={!objectShadowValues}
            label="Blur"
          />

          <SkectInput
            label="Shadow Color"
            defaultColor={objectShadowValues ? objectShadowValues.color : '#FFFFFF'}
            handler={onShadowColorChangeHandler}
          />
        </div>
      )}
    </>
  )
}

export default BoxShadow
