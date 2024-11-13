import type { Banner } from '../pages/projects'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { useRecoilState } from 'recoil'
import { QueryKeys } from '../settings/constants'
import { isSyncModeState } from '../store/EditorAtoms'
import { useCanvas } from './useCanvas'
import { CustomObject } from '../utils/fabric/types'

const useListeners = () => {
  const router = useRouter()
  const { canvas } = useCanvas()
  const queryClient = useQueryClient()
  const [isSyncMode, setIsSyncMode] = useRecoilState(isSyncModeState)

  const { projectId } = router.query

  /**
   * If the user presses the backspace or delete key, and the active element is not the body, then remove
   * all active objects from the canvas
   * @param {KeyboardEvent} e - KeyboardEvent - The event object that is passed to the function.
   */
  const deleteObjectListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (document.activeElement?.tagName === 'BODY') {
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

          const activeObjects = canvas?.getActiveObjects()
          activeObjects?.map((object) => {
            canvas?.remove(object)
          })
          canvas.discardActiveObject()
        }
      }
    },
    [isSyncMode, canvas, queryClient, projectId]
  )

  /**
   * When the user presses the escape key, the active object is unselected and the selection:cleared
   * event is fired
   * @param {KeyboardEvent} e - KeyboardEvent - the event object
   */
  const unSelectObjectListener = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      canvas.discardActiveObject()
      canvas.fire('selection:cleared')
      canvas.requestRenderAll()
    }
  }

  return { deleteObjectListener, unSelectObjectListener }
}

export default useListeners
