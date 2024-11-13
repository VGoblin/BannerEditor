import type { CustomObject } from '../../../../utils/fabric/types'
import React, { useMemo } from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import { VerticalTopAlignIcon, VerticalCenterAlignIcon, VerticalBottomAlignIcon } from '../UI/Icons'
type Props = {
  verticalAlign: string
  setVerticalAlign: (a: string) => void
}

const options = [
  {
    title: 'top',
    icon: VerticalTopAlignIcon,
  },
  {
    title: 'middle',
    icon: VerticalCenterAlignIcon,
  },
  {
    title: 'bottom',
    icon: VerticalBottomAlignIcon,
  },
]

const VerticalAlignment: React.FC<Props> = ({ verticalAlign, setVerticalAlign }) => {
  const { canvas } = useCanvas()
  const onChangeHandler = (e: React.MouseEvent) => {
    const target = e.target as HTMLUListElement

    const objects = canvas?.getActiveObjects() as CustomObject[]
    objects?.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        // Target.id one of them 'top', 'center', 'bottom'
        // Button is a  group and first element container, second element Textbox
        obj.getObjects('textbox')[0].set('verticalAlign' as keyof fabric.Object, target.id)
      } else {
        obj.set('verticalAlign' as keyof fabric.Object, target.id)
      }
      setVerticalAlign(target.id)
    })

    canvas?.requestRenderAll()
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-editorGray">Vertical Align</span>
      <ul className="flex gap-1 ">
        {options.map((option) => {
          return (
            <li
              id={option.title}
              className={`cursor-pointer rounded-md p-1 hover:bg-primaryLight ${
                verticalAlign === option.title ? 'bg-primary hover:bg-primary' : ''
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

export default VerticalAlignment
