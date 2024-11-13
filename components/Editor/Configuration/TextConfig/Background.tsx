import type { CustomTextbox } from '../../../../utils/fabric/types'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import { ColorResult } from 'react-color'
import { useCanvas } from '../../../../hooks/useCanvas'
import { rgbToHex } from '../../../../utils/helper'
import SkectInput from '../UI/SkectInput'

type Props = {
  textBackgroundColor: string
  setTextBackgroundColor: (color: string) => void
}

const TextBackground: React.FC<Props> = ({ textBackgroundColor, setTextBackgroundColor }) => {
  const { canvas } = useCanvas()
  const onOpen = () => {
    setTextBackgroundColor('#333')
    const objects = canvas?.getActiveObjects() as CustomTextbox[]
    if (objects) {
      objects.map((obj) => {
        if (obj.objType) {
          obj.set({ textBackgroundColor: '#333' })
        }
      })
    }
    canvas?.requestRenderAll()
  }

  const onClose = () => {
    setTextBackgroundColor('')
    const objects = canvas?.getActiveObjects() as CustomTextbox[]
    if (objects) {
      objects.map((obj) => {
        if (obj.objType) {
          obj.set({ textBackgroundColor: '' })
        }
      })
    }
    canvas?.requestRenderAll()
  }

  const [opened, handlers] = useDisclosure(!!textBackgroundColor, {
    onOpen,
    onClose,
  })

  const onBackgroundChangeHandler = (color: ColorResult) => {
    setTextBackgroundColor(rgbToHex(color))
    const objects = canvas?.getActiveObjects() as CustomTextbox[]
    if (objects) {
      objects.map((obj) => {
        if (obj.objType) {
          obj.set({ textBackgroundColor: rgbToHex(color) })
        }
      })
    }
    canvas?.requestRenderAll()
  }

  return (
    <>
      <div
        className=" mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold"
        onClick={() => handlers.toggle()}
      >
        <span>Background</span>
        <label
          htmlFor="small-toggle"
          className="pointer-events-none relative  inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id="small-toggle"
            className="peer sr-only"
            checked={opened}
            onChange={() => {}}
          />
          <div className="max-h  peer h-5 w-9 rounded-full border-2 border-black bg-white outline-none ring-0 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-white  after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full  peer-checked:after:border-white peer-focus:outline-none"></div>
        </label>
      </div>

      {opened && (
        <div>
          <SkectInput
            label="Background Color"
            handler={onBackgroundChangeHandler}
            defaultColor={textBackgroundColor}
          />
        </div>
      )}
    </>
  )
}

export default TextBackground
