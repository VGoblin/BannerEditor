import { IObjectFit } from 'fabricjs-object-fit'
import React from 'react'
import { useCanvas } from '../../../../hooks/useCanvas'

type Props = {
  imageFitting: 'contain' | 'cover'
  setImageFitting: (a: 'contain' | 'cover') => void
}

const ImageFitting: React.FC<Props> = ({ imageFitting, setImageFitting }) => {
  const { canvas } = useCanvas()
  const onChangeHandler = (e: React.MouseEvent) => {
    const target = e.target as HTMLUListElement
    const container = canvas.getActiveObject() as IObjectFit

    if (target.id === 'contain') {
      setImageFitting(target.id)
      container.mode = 'contain'
      container.recompute()
    } else {
      setImageFitting('cover')
      container.mode = 'cover'
      container.recompute()
    }
    canvas.requestRenderAll()
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-editorGray">Image Fitting</span>
      <ul className="flex gap-1 ">
        <li
          id={'contain'}
          className={`cursor-pointer rounded-md py-1 px-2 text-sm font-semibold hover:bg-primaryLight ${
            imageFitting === 'contain' ? 'bg-primary hover:bg-primary' : ''
          } `}
          key={1}
          onClick={onChangeHandler}
        >
          Contain
        </li>
        <li
          id={'cover'}
          className={`cursor-pointer rounded-md py-1 px-2 text-sm font-semibold hover:bg-primaryLight ${
            imageFitting === 'cover' ? 'bg-primary hover:bg-primary' : ''
          } `}
          key={2}
          onClick={onChangeHandler}
        >
          Cover
        </li>
      </ul>
    </div>
  )
}

export default ImageFitting
