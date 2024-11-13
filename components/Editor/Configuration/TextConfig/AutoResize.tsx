import React from 'react'
import { useCanvas } from '../../../../hooks/useCanvas'

type Props = {
  objectAutoResize: boolean
  setObjectAutoResize: (value: boolean) => void
}

const AutoResize: React.FC<Props> = ({ objectAutoResize, setObjectAutoResize }) => {
  const { canvas } = useCanvas()
  const onAutoResizeToggleHandler = () => {
    canvas.getActiveObjects().map((obj) => {
      if ('autoResize' in obj) {
        // @ts-ignore
        obj.toggle('autoResize')
        setObjectAutoResize(!objectAutoResize)
      }
    })
  }

  return (
    <>
      <div
        className=" mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold"
        onClick={onAutoResizeToggleHandler}
      >
        <span>Auto Resize</span>
        <label
          htmlFor="small-toggle"
          className="pointer-events-none relative  inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id="small-toggle"
            className="peer sr-only"
            checked={objectAutoResize}
            // for prevent es-lint warning
            onChange={() => {}}
          />
          <div className="max-h  peer h-5 w-9 rounded-full border-2 border-black bg-white outline-none ring-0 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-white  after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full  peer-checked:after:border-white peer-focus:outline-none"></div>
        </label>
      </div>
    </>
  )
}

export default AutoResize
