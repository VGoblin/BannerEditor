import type { CustomObject } from '../../../utils/fabric/types'
import React, { ChangeEvent } from 'react'
import { fabric } from 'fabric'
import type { IObjectSize } from './Configuration'
import PropInput from './UI/PropInput'
import { useCanvas } from '../../../hooks/useCanvas'
type Props = {
  objectSize: IObjectSize
  setObjectSize: (a: IObjectSize) => void
}

const MeasurementInput = ({ objectSize, setObjectSize }: Props) => {
  const { canvas } = useCanvas()

  const onSizeChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const objects = canvas?.getActiveObjects() as CustomObject[]
    const isWidthChanged = e.target.name === 'width'
    // !! Check input.value - strokeWidth must be above zero
    if (+e.target.value <= 0) return

    objects?.map((obj) => {
      if (obj.width) {
        const { scaleX, scaleY } = obj.getObjectScaling()
        const strokeWidth = obj.get('strokeWidth')
        const skewX = obj.get('skewX')!
        const skewY = obj.get('skewY')!

        /* This is the formula for calculating the width of an object. */
        const newWidthValue =
          +e.target.value / scaleX -
          strokeWidth! -
          (obj.getScaledHeight() * Math.tan(skewX! * (Math.PI / 180))) / scaleX

        /* This is the formula for calculating the height of an object. */
        const newHeightValue =
          +e.target.value / scaleY -
          strokeWidth! -
          (obj.getScaledWidth() * Math.tan(skewY! * (Math.PI / 180))) / scaleY!

        /* This is a special case for buttons. Buttons are a group of objects. The first object in the group is
          the button container. The button container is a rectangle. The button container is the object that
          is resized. */
        if (obj.objType === 'button' && obj instanceof fabric.Group) {
          /* Setting the width of the button container. */
          const [container, btnText] = obj.getObjects()
          container.set({
            [e.target.name]: isWidthChanged ? newWidthValue : newHeightValue,
          })
          btnText.set({ width: newWidthValue - 20 })
        }

        console.log(e.target.name, newHeightValue)
        /* Setting the width or height of the object. */
        obj.set({
          [e.target.name]: isWidthChanged ? newWidthValue : newHeightValue,
        })
        console.log(obj)

        // Setting the width of the clipPath.
        if (obj.clipPath) {
          obj.clipPath.set({
            [e.target.name]: isWidthChanged ? newWidthValue : newHeightValue,
          })
        }

        setObjectSize({
          ...objectSize,
          [e.target.name]: +e.target.value,
        })
      }
      canvas?.requestRenderAll()
    })
  }

  return (
    <>
      <label htmlFor="width" className="flex justify-between text-sm text-editorGray">
        Size
        <div>
          <PropInput
            type="number"
            name="width"
            id="width"
            min={0}
            value={objectSize ? Math.round(objectSize.width) : 0}
            handler={onSizeChangeHandler}
          />
          <PropInput
            type="number"
            name="height"
            id="height"
            min={0}
            value={objectSize ? Math.round(objectSize.height) : 0}
            handler={onSizeChangeHandler}
          />
        </div>
      </label>
    </>
  )
}

export default MeasurementInput
