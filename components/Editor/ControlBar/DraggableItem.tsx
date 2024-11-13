import type { Identifier, XYCoord } from 'dnd-core'
import type { CustomGroup, CustomObject } from '../../../utils/fabric/types'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useCanvas } from '../../../hooks/useCanvas'
import { renderIcon } from '../Configuration/UI/Icons'
import { Lock1, LockSlash, Edit2, SaveAdd, Eye, EyeSlash } from 'iconsax-react'
import { sluggify } from '../../../utils/helper'
import { useRecoilState } from 'recoil'
import { isSyncModeState } from '../../../store/EditorAtoms'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../../../settings/constants'
import { useRouter } from 'next/router'
import { Banner } from '../../../pages/projects'
import { Tooltip } from '@mantine/core'

interface Props {
  object: CustomObject
  index: number
  moveCard: (dragIndex: number, hoverIndex: number, objectID: string) => void
  isActive: boolean
}

interface DragItem {
  index: number
  id: string
  type: string
}

const renderlistItem = (object: CustomObject, handler: () => void, dbCLickHandler: () => void) => {
  let content
  if (object.objType !== 'group') {
    content = (
      <span
        className="max-w-[120px] cursor-pointer overflow-hidden text-sm"
        onClick={handler}
        onDoubleClick={dbCLickHandler}
      >
        {object.name}
      </span>
    )
  } else {
    content = (
      <div className="flex flex-col">
        <span
          className="mb-1 cursor-pointer text-sm"
          onClick={handler}
          onDoubleClick={dbCLickHandler}
        >
          {object.name}
        </span>
        <ul className="space-y-1">
          {/* @ts-ignore */}
          {object.getObjects().map((item: CustomGroup) => (
            <li key={item.id} className="ml-4 text-sm">
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return content
}

/**
 * It toggles the lockMovementX, lockMovementY, evented, and hasControls properties of the object
 * passed to it
 * @param {Object} object - The object you want to lock or unlock.
 */
export const toggleObjectLock = (object: CustomObject) => {
  object.toggle('lockMovementX')
  object.toggle('lockMovementY')
  object.toggle('evented')
  object.toggle('hasControls')
  object.toggle('selectable')
}

const DraggableItem: React.FC<Props> = ({ object, index, moveCard, isActive }) => {
  const { canvas } = useCanvas()
  const draggableRef = useRef<HTMLLIElement>(null)
  const [isSyncMode, setIsSyncMode] = useRecoilState(isSyncModeState)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { projectId } = router.query

  const [isEditingMode, setIsEditingMode] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [objectName, setObjectName] = useState(object.name)
  const [isObjectVisible, setIsObjectVisible] = useState(!!object.opacity)

  const onNameChangeSubmitHandler = (e: FormEvent) => {
    e.preventDefault()
    if (objectName && objectName?.trim().length > 0) {
      if (isSyncMode) {
        queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
          const result = prevVal.data.banners.map((banner: Banner) => {
            const parsedJson = JSON.parse(banner.json)
            parsedJson.objects.map((o: CustomObject) => {
              if (o.id === object.id || o.name === object.name) {
                o.name = objectName
              }
            })
            banner.json = JSON.stringify(parsedJson)
            return banner
          })
          return { ...prevVal, data: { ...prevVal.data, banners: result } }
        })
      }
      object.set('name', objectName)
      // Trigger selection event for reflect name change to configuration component
      canvas.fire('selection:updated')
    } else setObjectName(object.name)
    setIsEditingMode(false)
  }

  const onLockObjectHandler = () => {
    setIsLocked((prevVal) => !prevVal)
    toggleObjectLock(object)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }

  const toggleVisibility = () => {
    if (object.opacity) object.hide()
    else object.show()
    setIsObjectVisible((prevVal) => !prevVal)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }

  let timer: any
  let delay = 100
  let prevent = false

  const selecObjectHandler = () => {
    timer = setTimeout(function () {
      if (!prevent) {
        canvas.setActiveObject(object)
        canvas.requestRenderAll()
      }
      prevent = false
    }, delay)
  }

  const dbClickHandler = () => {
    clearTimeout(timer)
    prevent = true
    setIsEditingMode(true)
  }

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'ITEM',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },

    hover(item: DragItem, monitor) {
      if (!draggableRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = draggableRef.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveCard(dragIndex, hoverIndex, item.id)
      // !! It is work but find a another meanfull solution
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: () => {
      return { id: object.id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  // I don't know what this line doing maybe HOC but do not remove :)
  drag(drop(draggableRef))
  return (
    <li
      ref={draggableRef}
      tabIndex={index}
      className={`flex  items-center justify-between  rounded-md  px-2 py-1 ${
        isActive ? 'bg-slate-100' : ''
      } ${isDragging ? 'opacity-20' : 'opacity-100'}`}
      data-handler-id={handlerId}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex min-w-[30px] cursor-move justify-center ${
            object.type === 'group' ? 'mt-[2px] self-start' : ''
          }`}
        >
          {renderIcon(object.objType!)}
        </span>

        {isEditingMode ? (
          <form onSubmit={onNameChangeSubmitHandler}>
            <input
              onBlur={(e) => {
                setObjectName(sluggify(e.target.value))
                onNameChangeSubmitHandler(e)
              }}
              className="max-w-[120px] overflow-hidden bg-slate-100"
              type="text"
              value={objectName}
              autoFocus
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setObjectName(sluggify(e.target.value))
              }
            />
          </form>
        ) : (
          renderlistItem(object, selecObjectHandler, dbClickHandler)
        )}
      </div>

      <div className="mt-1 flex justify-center gap-2 self-start">
        {isObjectVisible ? (
          <Tooltip label="Hide">
            <Eye size="18" color="#555555" className="cursor-pointer" onClick={toggleVisibility} />
          </Tooltip>
        ) : (
          <Tooltip label="Show">
            <EyeSlash
              size="18"
              color="#555555"
              className="cursor-pointer"
              onClick={toggleVisibility}
            />
          </Tooltip>
        )}
        {isEditingMode ? (
          <Tooltip label="Save">
            <SaveAdd
              size="18"
              color="#555555"
              className="cursor-pointer"
              onClick={onNameChangeSubmitHandler}
            />
          </Tooltip>
        ) : (
          <Tooltip label="Edit">
            <Edit2
              size="18"
              color="#555555"
              className="cursor-pointer"
              onClick={() => setIsEditingMode(true)}
            />
          </Tooltip>
        )}

        <span onClick={onLockObjectHandler}>
          {isLocked ? (
            <Tooltip label="Unlock">
              <LockSlash size="18" color="#555555" className="cursor-pointer" />
            </Tooltip>
          ) : (
            <Tooltip label="Lock">
              <Lock1 size="18" color="#555555" className="cursor-pointer" />
            </Tooltip>
          )}
        </span>
      </div>
    </li>
  )
}

export default DraggableItem
