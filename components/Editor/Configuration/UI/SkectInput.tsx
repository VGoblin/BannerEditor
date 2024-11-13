import type { ColorResult } from 'react-color'
import React from 'react'
import { Popover } from '@headlessui/react'
import { SketchPicker } from 'react-color'

type Props = {
  handler: (a: ColorResult) => void
  defaultColor?: string
  label: string
}

// !! Hex code onCLick copy clipboard

const SkectInput: React.FC<Props> = ({ defaultColor = '#000', handler, label }) => {
  return (
    <Popover className="relative pr-3 text-sm">
      <Popover.Button className="w-full">
        <label htmlFor={label} className="flex justify-between text-editorGray">
          {label}
          <div className="flex items-center gap-1 text-black">
            <span
              style={{ backgroundColor: defaultColor, border: '1px solid gray' }}
              className="inline-block h-[20px] w-[20px] cursor-pointer rounded-md"
            ></span>
            <span className="text-sm font-bold">{defaultColor}</span>
          </div>
        </label>
      </Popover.Button>

      <Popover.Panel className="relative z-10">
        <SketchPicker color={defaultColor} onChange={handler} />
      </Popover.Panel>
    </Popover>
  )
}

export default SkectInput
