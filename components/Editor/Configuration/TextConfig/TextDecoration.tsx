import type { MouseEvent } from 'react'
import React, { useState } from 'react'
import { Canvas, Object } from 'fabric/fabric-impl'
import { Italic, LineThrough, OverLine, UnderLine } from '../UI/Icons'
import { useCanvas } from '../../../../hooks/useCanvas'

type Props = {
  textDecorationOptions: Option[]
  setTextDecorationOptions: (a: Option[] | any) => void
}

export interface Option {
  key: string
  icon: React.FC<{}>
  value: boolean | string
}

const optionStatus = (value: boolean | string) => {
  if (typeof value === 'string') {
    if (value === 'italic') return true
  } else return value
}

const TextDecoration: React.FC<Props> = ({ textDecorationOptions, setTextDecorationOptions }) => {
  const { canvas } = useCanvas()

  /**
   * It takes an array of objects, an option, and a target, and then it maps over the objects and sets
   * the value of the option to the value of the target
   * @param {Object[]} objects - Object[] - The array of objects that are selected
   * @param {Option} option - Option - this is the option object that is passed to the function.
   * @param {HTMLUListElement} target - HTMLUListElement - The target element that was clicked.
   */
  const changeObjectValue = (objects: Object[], option: Option, target: HTMLUListElement) => {
    objects?.map((object) => {
      if (target.id in object) {
        if (target.id === 'fontStyle') {
          option.value = option.value === 'normal' ? 'italic' : 'normal'
          object.set('fontStyle' as keyof Object, option.value)
        } else {
          option.value = !option.value
          object.set(target.id as keyof Object, option.value)
        }
      }
    })
  }

  /**
   * We're mapping over the textDecorationOptions array, and if the id of the target element matches
   * the key of the option, we're calling the changeObjectValue function
   * @param {MouseEvent} e - MouseEvent - the event that is triggered when the user clicks on the
   * list element
   */
  const onClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLUListElement
    const objects = canvas?.getActiveObjects()
    const res = textDecorationOptions.map((option) => {
      if (option.key === target.id) {
        changeObjectValue(objects!, option, target)
      }
      return option
    })
    setTextDecorationOptions(res)
    canvas?.requestRenderAll()
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-editorGray">Text Decoration</span>
      <ul className="flex gap-1">
        {textDecorationOptions &&
          textDecorationOptions!.map((option) => {
            return (
              <li
                key={option.key}
                id={option.key}
                className={` cursor-pointer rounded-md p-1 hover:bg-primaryLight ${
                  optionStatus(option.value) ? 'bg-primary hover:bg-[#A259FF36]' : ''
                }`}
                onClick={onClickHandler}
              >
                <option.icon />
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default TextDecoration
