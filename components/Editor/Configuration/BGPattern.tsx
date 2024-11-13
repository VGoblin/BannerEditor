import type { CustomObject, CustomGroup } from '../../../utils/fabric/types'
import Image from 'next/future/image'
import React, { useEffect, useState } from 'react'
import { useCanvas } from '../../../hooks/useCanvas'
import { loadPattern, deleteBGPattern, changeBGPattern } from '../../../utils/fabric/fabric'
import { fabric } from 'fabric'
type Props = {
  objectHasBGPattern: boolean
  setObjectHasBGPattern: (value: boolean) => void
}

const patterns = [
  {
    id: 1,
    name: 'pattern1',
    url: '/images/patterns/pattern1.jpeg',
  },
  {
    id: 2,
    name: 'pattern2',
    url: '/images/patterns/pattern2.png',
  },
  {
    id: 3,
    name: 'pattern3',
    url: '/images/patterns/pattern3.png',
  },
  {
    id: 4,
    name: 'pattern1',
    url: '/images/patterns/pattern1.jpeg',
  },
  {
    id: 5,
    name: 'pattern2',
    url: '/images/patterns/pattern2.png',
  },
  {
    id: 6,
    name: 'pattern3',
    url: '/images/patterns/pattern3.png',
  },
  {
    id: 7,
    name: 'pattern3',
    url: '/images/patterns/pattern3.png',
  },
]

const BGPattern: React.FC<Props> = ({ objectHasBGPattern, setObjectHasBGPattern }) => {
  const { canvas } = useCanvas()
  const [isOpen, setIsOpen] = useState(objectHasBGPattern)

  const onVisiblityChangeHandler = () => {
    const objects = canvas.getActiveObjects()
    if (isOpen) {
      setIsOpen(false)
      setObjectHasBGPattern(false)
      objects.forEach((obj) => {
        obj.set('fill', '#3f82dfff')
        if (obj instanceof fabric.Group) deleteBGPattern(obj)
      })
    } else {
      setIsOpen(true)
    }
    canvas.fire('object:modified')
    canvas.requestRenderAll()
  }

  const onPatternChangeHandler = (url: string) => {
    const obj = canvas.getActiveObject() as CustomGroup
    setObjectHasBGPattern(true)
    if (obj.fill instanceof fabric.Pattern) {
      changeBGPattern(url, obj, 'repeat')
    } else {
      loadPattern(url, obj as CustomObject, 'repeat')
    }
  }

  useEffect(() => {
    setIsOpen(objectHasBGPattern)
  }, [objectHasBGPattern])

  return (
    <>
      <div
        className=" mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold"
        onClick={onVisiblityChangeHandler}
      >
        <span>BG Pattern</span>
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

      {isOpen && (
        <ul className="grid grid-cols-3 gap-2">
          {patterns.map((pattern) => (
            <li
              key={pattern.id}
              className="cursor-pointer rounded border border-slate-100 p-1 hover:scale-105"
              onClick={onPatternChangeHandler.bind(null, pattern.url)}
            >
              <Image src={pattern.url} width={30} height={30} alt="Pattern" className="mx-auto" />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default BGPattern
