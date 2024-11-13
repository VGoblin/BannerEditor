import type { CustomObject } from '../../../../utils/fabric/types'
import React, { useMemo } from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import { LeftAlignIcon, CenterAlignIcon, RightAlignmentIcon } from '../UI/Icons'
type Props = {
  textAlign: string
  setTextAlign: (a: string) => void
}

const options = [
  {
    title: 'left',
    icon: LeftAlignIcon,
  },
  {
    title: 'center',
    icon: CenterAlignIcon,
  },
  {
    title: 'right',
    icon: RightAlignmentIcon,
  },
]

const TextAlignment: React.FC<Props> = ({ textAlign, setTextAlign }) => {
  const { canvas } = useCanvas()
  const onChangeHandler = (e: React.MouseEvent) => {
    const target = e.target as HTMLUListElement

    const objects = canvas?.getActiveObjects() as CustomObject[]
    objects?.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        // Target.id one of them 'center', 'left', 'right'
        // Button is a  group and first element container, second element Textbox
        obj.getObjects('textbox')[0].set('textAlign' as keyof fabric.Object, target.id)
      } else {
        obj.set('textAlign' as keyof fabric.Object, target.id)
      }
      setTextAlign(target.id)
    })

    canvas?.requestRenderAll()
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-editorGray">Text Align</span>
      <ul className="flex gap-1 ">
        {options.map((option) => {
          return (
            <li
              id={option.title}
              className={`cursor-pointer rounded-md p-1 hover:bg-primaryLight ${
                textAlign === option.title ? 'bg-primary hover:bg-primary' : ''
              } `}
              key={option.title}
              onClick={onChangeHandler}
            >
              <option.icon />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TextAlignment
