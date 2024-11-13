import type { CustomObject } from '../../../utils/fabric/types'
import { fabric } from 'fabric'
import { Copy, Trash, FolderAdd, FolderMinus, Mask } from 'iconsax-react'
import React, { useState, useEffect, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import {
  currentObjectCountState,
  isSyncModeState,
  selectionCountState,
} from '../../../store/EditorAtoms'
import { useCanvas } from '../../../hooks/useCanvas'
import DraggableItem from './DraggableItem'
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Banner } from '../../../pages/projects'
import { QueryKeys } from '../../../settings/constants'
import { Tooltip } from '@mantine/core'
import { CustomImage } from '../../../utils/fabric/types'

export interface Item {
  id: string
  text: string
}

const Layers: React.FC = () => {
  const router = useRouter()
  const { canvas } = useCanvas()
  const queryClient = useQueryClient()
  const currentObjectCount = useRecoilValue(currentObjectCountState) as number
  const selectionCount = useRecoilValue(selectionCountState) as number
  const isSyncMode = useRecoilValue(isSyncModeState)
  const { projectId } = router.query

  const [objects, setObjects] = useState<CustomObject[]>()
  const [activeObjects, setActiveObjects] = useState<CustomObject[]>()

  useEffect(() => {
    if ('width' in canvas) {
      setObjects(canvas.getObjects() as CustomObject[])
      setActiveObjects(canvas.getActiveObjects() as CustomObject[])
    }
  }, [currentObjectCount, selectionCount, canvas])

  const onGroupHandler = () => {
    if (canvas.getActiveObject().type !== 'activeSelection') return
    // @ts-ignore
    const res = canvas.getActiveObject().toGroup().set({
      name: 'Group',
      id: uuidv4(),
    })
    res.clipPath = new fabric.Rect({
      width: res.getScaledWidth(),
      height: res.getScaledHeight(),
      originX: 'center',
      originY: 'center',
      name: 'Mask',
    })

    canvas.setActiveObject(res)
    canvas.fire('selection:updated')
    canvas.requestRenderAll()
  }

  const unGroupHandler = () => {
    if (canvas.getActiveObject().type !== 'group') return
    // @ts-ignore
    canvas.getActiveObject().toActiveSelection()
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }

  const onCopyObjectHandler = () => {
    if (activeObjects) {
      activeObjects.map((object) => {
        canvas.discardActiveObject()
        object.clone((clonedObj: CustomObject) => {
          clonedObj.set({
            left: clonedObj.left! + 10,
            top: clonedObj.top! + 10,
            evented: true,
            objType: object.objType,
            name: `${object.name} - Copy`,
            id: uuidv4(),
          })
          canvas.add(clonedObj)
        })
      })
      canvas.requestRenderAll()
    }
  }

  const deleteObjectHandler = () => {
    if (isSyncMode) {
      const removedNames = canvas?.getActiveObjects().map((o) => o.name)
      queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
        const result = prevVal.data.banners.map((banner: Banner) => {
          const parsedJson = JSON.parse(banner.json)
          const res = parsedJson.objects.filter((o: CustomObject) => {
            return !removedNames?.includes(o.name)
          })
          parsedJson.objects = res
          banner.json = JSON.stringify(parsedJson)
          return banner
        })
        return { ...prevVal, data: { ...prevVal.data, banners: result } }
      })
    }

    activeObjects?.map((object) => canvas.remove(object))
    canvas.discardActiveObject()
  }

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number, objectID: string) => {
      const dragingObject = objects?.find((object: CustomObject) => object.id === objectID)

      if (dragIndex - hoverIndex < 0) {
        dragingObject?.bringForward()
      } else {
        dragingObject?.sendBackwards()
      }
      setObjects(canvas.getObjects() as CustomObject[])
    },
    [objects]
  )

  const renderCard = useCallback(
    (object: CustomObject, index: number) => {
      return (
        <DraggableItem
          key={object.id}
          index={index}
          object={object}
          moveCard={moveCard}
          isActive={!!activeObjects && activeObjects.some((item) => item.id === object.id)}
        />
      )
    },
    [moveCard]
  )

  const applyMaskHandler = () => {
    // find activeobject's index
    if (activeObjects?.length === 0) return
    const activeObject = activeObjects![0] as CustomImage
    const activeObjectIndex = objects?.findIndex((o) => o.id === activeObject.id)
    const behindObject = objects?.[activeObjectIndex! - 1]

    if (!behindObject) return

    behindObject.clone((clonedObj: CustomObject) => {
      clonedObj.set({
        left: 0,
        top: 0,
        originX: 'center',
        originY: 'center',
        evented: false,
      })
      activeObject.clipPath = clonedObj
    })
    console.log('Layers', activeObject.clipPath)

    activeObject.set({ dirty: true, maskType: behindObject.name })
    // For update Configuration Mask property
    canvas.fire('object:modified')
    canvas.requestRenderAll()
  }

  const footerActions = [
    {
      icon: FolderAdd,
      isDisabled: activeObjects && activeObjects.length < 2,
      handler: onGroupHandler,
      label: 'Group',
    },
    {
      icon: FolderMinus,
      isDisabled: activeObjects && activeObjects[0]?.type !== 'group',
      handler: unGroupHandler,
      label: 'Ungroup',
    },
    {
      icon: Mask,
      isDisabled: activeObjects && activeObjects[0]?.type !== 'image',
      handler: applyMaskHandler,
      label: 'Apply Mask',
    },
    {
      icon: Copy,
      isDisabled: activeObjects && activeObjects.length < 1,
      handler: onCopyObjectHandler,
      label: 'Copy',
    },
    {
      icon: Trash,
      isDisabled: activeObjects && activeObjects.length < 1,
      handler: deleteObjectHandler,
      label: 'Delete',
    },
  ]

  return (
    <>
      <ul className="flex flex-col-reverse">
        {objects && objects.slice(1).map((object: CustomObject, i) => renderCard(object, i))}
      </ul>
      <hr className="my-2" />
      <div className="flex items-center justify-end space-x-2 ">
        {footerActions.map((action, i) => (
          <span
            key={i}
            className={`cursor-pointer rounded p-1 shadow ${
              action.isDisabled && 'cursor-default  shadow-none'
            }`}
            onClick={() => {
              if (!action.isDisabled) action.handler()
            }}
          >
            <Tooltip label={action.label}>
              <action.icon size="18" color={action.isDisabled ? '#c6c0c0' : '#000000'} />
            </Tooltip>
          </span>
        ))}
      </div>
    </>
  )
}

export default Layers
