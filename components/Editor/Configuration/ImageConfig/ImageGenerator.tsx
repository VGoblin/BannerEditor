import React, { useState } from 'react'
import { useCanvas } from '../../../../hooks/useCanvas'

const ImageGenerator: React.FC = () => {
  const { canvas } = useCanvas()
  const [isOpen, setIsOpen] = useState(false)

  const onChangeHandler = () => {
    setIsOpen((prevVal) => !prevVal)
  }

  return (
    <>
      <div
        className=" mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold"
        onClick={onChangeHandler}
      >
        <span>DALL·E Image Generator</span>
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
      {/* Content comes here */}
    </>
  )
}

export default ImageGenerator
