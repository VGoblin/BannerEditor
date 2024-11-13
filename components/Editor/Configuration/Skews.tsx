import type { Canvas } from 'fabric/fabric-impl'
import type { ISkewValues } from './Configuration'
import type { ChangeEvent } from 'react'
import React from 'react'
import PropInput from './UI/PropInput'
import { useCanvas } from '../../../hooks/useCanvas'

type Props = {
  skewValues: ISkewValues | undefined
  setSkewValues: (a: ISkewValues) => void
}

const Skews: React.FC<Props> = ({ skewValues, setSkewValues }) => {
  const { canvas } = useCanvas()
  const onSkewChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const objects = canvas?.getActiveObjects()
    canvas!.fire('object:modified')
    if (e.target.name === 'skewX') {
      setSkewValues({ skewY: skewValues?.skewY!, skewX: +e.target.value })
      objects?.map((object) => {
        object.set('skewX', +e.target.value)
      })
    } else {
      setSkewValues({ skewX: skewValues?.skewX!, skewY: +e.target.value })
      objects?.map((object) => {
        object.set('skewY', +e.target.value)
      })
    }
    canvas?.requestRenderAll()
  }
  return (
    <div className="space-y-4">
      <PropInput
        type="number"
        name="skewX"
        id="skewX"
        value={skewValues ? Math.round(skewValues.skewX) : 0}
        handler={onSkewChangeHandler}
        label="SkewX"
      />
      <PropInput
        type="number"
        name="skewY"
        id="skewY"
        value={skewValues ? Math.round(skewValues.skewY) : 0}
        handler={onSkewChangeHandler}
        label="SkewY"
      />
    </div>
  )
}

export default Skews
