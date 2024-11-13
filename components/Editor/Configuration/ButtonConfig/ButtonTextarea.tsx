import type { CustomObject, CustomTextbox } from '../../../../utils/fabric/types'
import React from 'react'
import { useCanvas } from '../../../../hooks/useCanvas'
import { fabric } from 'fabric'

type Props = {
  btnText: string
  setBtnText: (a: string) => void
}

const ButtonTextarea: React.FC<Props> = ({ btnText, setBtnText }) => {
  const { canvas } = useCanvas()
  const onTextChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setBtnText(e.target.value)

    const objects = canvas.getActiveObjects() as CustomObject[]
    objects.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        const [text] = obj.getObjects('textbox') as CustomTextbox[]
        if (text) text.set('text', e.target.value)
      }
    })
    canvas.requestRenderAll()
  }

  return (
    <label
      htmlFor="button-text"
      className="flex items-center justify-between gap-2 text-sm text-editorGray"
    >
      Text
      <input
        id="button-text"
        className=" max-w-[175px] flex-1 rounded border px-2  py-1 text-sm font-bold  text-black outline-none ring-0 "
        placeholder="Text for button"
        value={btnText}
        onChange={onTextChangeHandler}
      />
    </label>
  )
}

export default ButtonTextarea
