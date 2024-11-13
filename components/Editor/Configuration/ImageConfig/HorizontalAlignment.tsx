import type { CustomObject } from '../../../../utils/fabric/types'
import React, { useMemo } from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import {
  HorizontalLeftAlignIcon,
  HorizontalCenterAlignIcon,
  HorizontalRightAlignIcon,
} from '../UI/Icons'
type Props = {
  horizontalAlign: string
  setHorizontalAlign: (a: string) => void
}

const options = [
  {
    title: 'left',
    icon: HorizontalLeftAlignIcon,
  },
  {
    title: 'center',
    icon: HorizontalCenterAlignIcon,
  },
  {
    title: 'right',
    icon: HorizontalRightAlignIcon,
  },
]

const HorizontalAlignment: React.FC<Props> = ({ horizontalAlign, setHorizontalAlign }) => {
  const { canvas } = useCanvas()
  const onChangeHandler = (e: React.MouseEvent) => {
    const target = e.target as HTMLUListElement

    const objects = canvas?.getActiveObjects() as CustomObject[]
    objects?.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        // Target.id one of them 'top', 'center', 'bottom'
        // Button is a  group and first element container, second element Textbox
        obj.getObjects('textbox')[0].set('horizontalAlign' as keyof fabric.Object, target.id)
      } else {
        obj.set('horizontalAlign' as keyof fabric.Object, target.id)
        obj.scaleX = 1
      }
      setHorizontalAlign(target.id)
    })

    canvas?.requestRenderAll()
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-editorGray">Horizontal Align</span>
      <ul className="flex gap-1 ">
        {options.map((option) => {
          return (
            <li
              id={option.title}
              className={`cursor-pointer rounded-md p-1 hover:bg-primaryLight ${
                horizontalAlign === option.title ? 'bg-primary hover:bg-primary' : ''
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

export default HorizontalAlignment
