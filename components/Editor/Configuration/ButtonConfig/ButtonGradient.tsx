import type { CustomObject } from '../../../../utils/fabric/types'
import React, { useState, useEffect } from 'react'
import { rgbToHex } from '../../../../utils/helper'
import { useCanvas } from '../../../../hooks/useCanvas'
import SkectInput from '../UI/SkectInput'
import { ColorResult } from 'react-color'
import { fabric } from 'fabric'
import { Gradient, Rect } from 'fabric/fabric-impl'
import { CrossGradient, Horizontal, VerticalIcon } from '../../../UI/Icons'

export type GradientDirection = 'vertical' | 'horizontal' | 'cross'

type GradientCoords = {
  x1: number
  y1: number
  x2: number
  y2: number
}

type Option = {
  title: GradientDirection
  icon: React.FC<{}>
  coords(width: number, height: number): GradientCoords
}

const options: Option[] = [
  {
    title: 'vertical',
    icon: VerticalIcon,
    coords(width, height) {
      return { x1: 0, y1: height, x2: 0, y2: 0 }
    },
    // 0 50 0 0
  },
  {
    title: 'horizontal',
    icon: Horizontal,
    coords(width, height) {
      return { x1: 0, y1: 0, x2: width, y2: height }
    },
    // 0 0 200 50
  },
  {
    title: 'cross',
    icon: CrossGradient,
    coords(width, height) {
      return { x1: 0, y1: width / 2, x2: height / 2, y2: 0 }
    },
    // 0, width/2, height/2, 0
  },
]

type Props = {
  btnGradient: Gradient
  setBtnGradient: (a: Gradient) => void
  firstColor: string
  setFirstColor: (a: string) => void
  secondColor: string
  setSecondColor: (a: string) => void
  btnGradientDirection: GradientDirection
  setBtnGradientDirection: (a: GradientDirection) => void
}

const ButtonGradient: React.FC<Props> = ({
  btnGradient,
  setBtnGradient,
  firstColor,
  setFirstColor,
  secondColor,
  setSecondColor,
  btnGradientDirection,
  setBtnGradientDirection,
}) => {
  const { canvas } = useCanvas()
  const [isOpen, setIsOpen] = useState(!!btnGradient)

  const addGradient = (container: Rect) => {
    const gradient = new fabric.Gradient({
      coords: {
        x1: 0,
        y1: 0,
        x2: container.width,
        y2: container.height,
      },
      colorStops: [
        {
          offset: 0,
          color: '#00FF00',
        },
        {
          offset: 1,
          color: '#0000FF',
        },
      ],
    })
    container.set({
      fill: gradient,
    })
    setBtnGradient(gradient)
  }

  useEffect(() => {
    setIsOpen(!!btnGradient)
  }, [btnGradient])

  const onVisibilityChangeHandler = () => {
    const objects = canvas?.getObjects() as CustomObject[]
    objects.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        const container = obj.getObjects('rect')[0]
        if (container.fill instanceof fabric.Gradient) {
          container.set({ fill: '#3f82dfff' })
          setIsOpen(false)
        } else {
          addGradient(container)
          setIsOpen(true)
        }
      }
      canvas.fire('object:modified')
      canvas.requestRenderAll()
    })
  }

  const onColorChangeHandler = (color: ColorResult, order: number) => {
    if (order) setSecondColor(rgbToHex(color))
    else setFirstColor(rgbToHex(color))
    const objects = canvas.getActiveObjects() as CustomObject[]
    objects.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        const gradient = obj.getObjects('rect')[0].fill as fabric.Gradient
        gradient.colorStops![order].color = rgbToHex(color)
        obj.set({ dirty: true })
      }
    })
    canvas.requestRenderAll()
  }

  const onChangeGradientDireection = (option: Option) => {
    setBtnGradientDirection(option.title)
    const objects = canvas.getActiveObjects() as CustomObject[]
    objects.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        // @ts-ignore
        obj.set({ gradientDirection: option.title })
        const gradient = obj.getObjects('rect')[0].fill as fabric.Gradient
        gradient.coords = option.coords(obj.width!, obj.height!)
        obj.set({ dirty: true })
      }
    })
    canvas.requestRenderAll()
  }

  return (
    <>
      <div
        className=" mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold"
        onClick={onVisibilityChangeHandler}
      >
        <span>Gradient</span>
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
      {btnGradient && (
        <div className="space-y-2 text-gray-500 ">
          <div className="my-4 space-y-2 pr-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-editorGray">Text Align</span>
              <ul className="flex gap-1 ">
                {options.map((option) => {
                  return (
                    <li
                      id={option.title}
                      className={`cursor-pointer rounded-md p-1 hover:bg-primaryLight ${
                        btnGradientDirection === option.title ? 'bg-primary hover:bg-primary' : ''
                      } `}
                      key={option.title}
                      onClick={() => onChangeGradientDireection(option)}
                    >
                      <option.icon />
                    </li>
                  )
                })}
              </ul>
            </div>

            <SkectInput
              defaultColor={firstColor}
              handler={(color) => {
                onColorChangeHandler(color, 0)
              }}
              label="Color"
            />
            <SkectInput
              defaultColor={secondColor}
              handler={(color) => {
                onColorChangeHandler(color, 1)
              }}
              label="Color"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ButtonGradient
