import React from 'react'
import { useCanvas } from '../../../../hooks/useCanvas'
import PropInput from '../UI/PropInput'

const FrameSize: React.FC = () => {
  const { canvas, frame } = useCanvas()
  const onFrameSizeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!frame || +e.target.value < 0) return
    if (e.target.name === 'width') {
      frame.set('width', +e.target.value)
    } else {
      frame.set('height', +e.target.value)
    }
    canvas.fire('object:modified')
    canvas.requestRenderAll()
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
            value={frame?.width ? Math.round(frame.width).toString() : 0}
            handler={onFrameSizeChangeHandler}
          />
          <PropInput
            type="number"
            name="height"
            id="height"
            min={0}
            value={frame?.height ? Math.round(frame.height).toString() : 0}
            handler={onFrameSizeChangeHandler}
          />
        </div>
      </label>
    </>
  )
}

export default FrameSize
