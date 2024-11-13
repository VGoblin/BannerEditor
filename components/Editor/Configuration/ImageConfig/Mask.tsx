import { fabric } from 'fabric'
import { Tooltip } from '@mantine/core'

import React, { ChangeEvent, useState } from 'react'
import { useCanvas } from '../../../../hooks/useCanvas'
import Radius from '../Radius'
import { CustomObject } from '../../../../utils/fabric/types'
import { Trash } from 'iconsax-react'
import PropInput from '../UI/PropInput'

type Props = {
  imageMaskType: string //'circle' | 'rounded_corners'
  setImageMaskType: (a: string | undefined) => void
  objectRadius: number
  setObjectRadius: (a: number) => void
}

const updateObjectMask = (canvas: fabric.Canvas, maskType: string | undefined) => {
  const imageObjects = canvas?.getActiveObjects()

  imageObjects?.map((obj) => {
    // @ts-ignore
    obj.maskType = maskType
    obj.set('dirty', true)
    // @ts-ignore
    obj.updateMask()
    // canvas.fire('object:modified')
    canvas.requestRenderAll()
  })
}

const Mask: React.FC<Props> = ({
  imageMaskType,
  setImageMaskType,
  objectRadius,
  setObjectRadius,
}) => {
  const { canvas } = useCanvas()

  const onChangeHandler = () => {
    if (imageMaskType) {
      setImageMaskType(undefined)
      setObjectRadius(0)
      updateObjectMask(canvas, undefined)
    } else {
      // TODO: clipPath sifirlanacak
      setImageMaskType('rounded_corners')
      setObjectRadius(20)
      updateObjectMask(canvas, 'rounded_corners')
    }
    canvas.requestRenderAll()
  }

  const onRadiusChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value)
    setObjectRadius(newRadius)
    const imageObjects = canvas?.getActiveObjects()
    imageObjects?.map((obj) => {
      // @ts-ignore
      obj.maskProperties['radius'] = newRadius
      // @ts-ignore
      obj.updateMask()
    })
  }

  const onImageMaskTypeChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    updateObjectMask(canvas, e.target.value)
    setImageMaskType(e.target.value.toString())
  }

  // const removeMaskHandler = () => {
  //   const activeObjects = canvas?.getActiveObjects() as CustomObject[]
  //   if (activeObjects.length) {
  //     activeObjects.map((obj) => {
  //       if (obj.objType === 'image') {
  //         const clipPath = new fabric.Rect({
  //           width: obj.getScaledWidth(),
  //           height: obj.getScaledHeight(),
  //           originX: 'center',
  //           originY: 'center',
  //           name: 'Mask',
  //           rx: 0,
  //           ry: 0,
  //         })
  //         obj.clipPath = clipPath
  //         obj.set('dirty', true)
  //         setImageMaskType(undefined)
  //         setObjectRadius(0)
  //         updateObjectMask(canvas, undefined, 0)
  //       }
  //     })
  //   }

  //   canvas.requestRenderAll()
  // }

  let content

  // TODO: Eski kod, ilerideki versiyonlarda tekrar devreye alinacak
  // if (imageMaskType && imageMaskType !== 'circle' && imageMaskType !== 'rounded_corners') {
  //   content = (
  //     <div className={`flex justify-between pr-3 text-sm text-editorGray`}>
  //       <span>{imageMaskType}</span>
  //       <Tooltip label="Remove Mask">
  //         <span className="cursor-pointer text-sm font-bold text-black" onClick={removeMaskHandler}>
  //           <Trash
  //             size={18}
  //             className="cursor-pointer text-red-400 transition-colors duration-150 hover:text-red-600"
  //           />
  //         </span>
  //       </Tooltip>
  //     </div>
  //   )
  // } else
  if (imageMaskType) {
    content = (
      <>
        <label htmlFor="canvas-format" className={`flex justify-between text-sm text-editorGray`}>
          Type
          <select
            name="canvas-format"
            id="canvas-format"
            className="cursor-pointer bg-white px-2 font-bold text-black focus:border-none focus:outline-none"
            value={imageMaskType}
            onChange={onImageMaskTypeChangeHandler}
          >
            <option value="circle">Circle</option>
            <option value="rounded_corners">Rounded Corner</option>
            <option value="blob">Blob</option>
            <option value="squircle">Squircle</option>
            <option value="hexagon">Hexagon</option>
            <option value="pentagon">Pentagon</option>
            <option value="parallelogram">Parallelogram</option>
          </select>
        </label>
        {imageMaskType === 'rounded_corners' && (
          <div className="group relative">
            <PropInput
              type="number"
              name="radius"
              id="radius"
              label="Radius"
              value={Math.round(objectRadius)}
              handler={onRadiusChangeHandler}
              min={0}
              max={200}
            />
          </div>
        )}
      </>
    )
  } else content = null

  return (
    <>
      <div
        className={`mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold`}
        onClick={onChangeHandler}
      >
        <span>Mask</span>
        <label
          htmlFor="small-toggle"
          className="pointer-events-none relative  inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id="small-toggle"
            className="peer sr-only"
            checked={!!imageMaskType}
            onChange={() => {
              onChangeHandler()
            }}
          />
          <div className="max-h  peer h-5 w-9 rounded-full border-2 border-black bg-white outline-none ring-0 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-white  after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full  peer-checked:after:border-white peer-focus:outline-none"></div>
        </label>
      </div>
      {content}
    </>
  )
}

export default Mask
