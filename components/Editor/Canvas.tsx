import type { CustomTextbox } from '../../utils/fabric/types'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import {
  selectionCountState,
  objectModifiedState,
  currentObjectCountState,
  currentBannerIdState,
  isSyncModeState,
  EditorZoomState,
} from '../../store/EditorAtoms'
import { loadCustomJson } from '../../utils/fabric/fabric'
import { useCanvas } from '../../hooks/useCanvas'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { QueryKeys } from '../../settings/constants'
import { getAction } from '../../settings/axiosConfig'
import { Banner, IProject } from '../../pages/projects'
import { LoadingOverlay } from '@mantine/core'
import useListeners from '../../hooks/useListeners'
import useImageUpload from '../../hooks/useImageUpload'

const CanvasWrapper = () => {
  const router = useRouter()
  const { canvas, setCanvas } = useCanvas()
  const [_, setSelectionCount] = useRecoilState(selectionCountState)
  const [modified, setObjectModified] = useRecoilState(objectModifiedState)
  const [count, setCurrentObjectCountState] = useRecoilState(currentObjectCountState)
  const [currentBannerId, setCurrentBannerId] = useRecoilState(currentBannerIdState)
  const [isSyncMode, setIsSyncMode] = useRecoilState(isSyncModeState)
  const [editorZoomState, setEditorZoomState] = useRecoilState(EditorZoomState)
  const { projectId } = router.query
  const queryClient = useQueryClient()
  const { uploadHandler } = useImageUpload()
  const { deleteObjectListener, unSelectObjectListener } = useListeners()

  useQuery(
    [QueryKeys.getProjectById, projectId],
    async () => {
      return getAction(`project/${projectId}`) as Promise<{ data: IProject }>
    },
    {
      cacheTime: 0,
      staleTime: 12 * 60 * 60 * 1000,
      // ıf projectId is not defined, do not run the query
      enabled: !!projectId,
      onSuccess: async (data) => {
        // console.log('onSuccess çalıştı')
        // //! I know this is a little bit complicated, but I must do this
        // // I'll definitely refactor this part
        let json: string = ''
        // Get json data from server
        if (currentBannerId) {
          const banner = data.data.banners.find((b) => b.id === currentBannerId)
          if (banner) {
            json = banner.json
            setCurrentBannerId(banner.id)
          } else {
            try {
              json = data.data.banners[data.data.banners.length - 1].json
              setCurrentBannerId(data.data.banners[data.data.banners.length - 1].id)
            } catch (error) {}
          }
        } else {
          try {
            json = data.data.banners[data.data.banners.length - 1].json
            setCurrentBannerId(data.data.banners[data.data.banners.length - 1].id)
          } catch (error) {}
        }

        const newCanvas = loadCustomJson(json, editorZoomState)

        // Set canvas instance to context
        if (newCanvas) setCanvas(newCanvas)
        canvas.fire('selection:cleared')
      },
    }
  )

  useEffect(() => {
    window.addEventListener('keydown', deleteObjectListener)
    window.addEventListener('keydown', unSelectObjectListener)
    return () => {
      window.removeEventListener('keydown', deleteObjectListener)
      window.removeEventListener('keydown', unSelectObjectListener)
    }
  }, [deleteObjectListener, unSelectObjectListener, canvas])

  useEffect(() => {
    if ('width' in canvas) {
      if (isSyncMode)
        canvas.on('text:changed', (e: any) => {
          queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
            const result = prevVal.data.banners.map((banner: Banner) => {
              const parsedJson = JSON.parse(banner.json)
              parsedJson.objects.map((obj: CustomTextbox) => {
                if (obj.name === e.target.name) {
                  obj.text = e.target.text
                }
              })
              return { ...banner, json: JSON.stringify(parsedJson) }
            })
            return { ...prevVal, data: { ...prevVal.data, banners: result } }
          })
        })
      // Canvas zoom feature
      canvas.on('mouse:wheel', function (opt) {
        var delta = opt.e.deltaY
        var zoom = canvas.getZoom()
        zoom *= (opt.e.ctrlKey ? 0.99 : 0.9999) ** delta
        if (zoom > 20) zoom = 20
        if (zoom < 0.01) zoom = 0.01
        canvas.zoomToPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, zoom)
        opt.e.preventDefault()
        opt.e.stopPropagation()
        canvas.fire('object:modified')
      })
      canvas.on('object:added', () => setCurrentObjectCountState((oldValue) => oldValue + 1))
      canvas.on('object:removed', () => setCurrentObjectCountState((oldValue) => oldValue - 1))
      canvas.on('selection:created', () => setSelectionCount((oldValue) => oldValue + 1))
      canvas.on('selection:updated', () => setSelectionCount((oldValue) => oldValue + 1))
      canvas.on('object:modified', () => setObjectModified((oldValue) => oldValue + 1))
      canvas.on('selection:cleared', () => {
        setSelectionCount(0)
        setObjectModified(0)
      })
      canvas.on('mouse:dblclick', (e) => {
        if (e.target && e.target.type === 'image') {
          // @ts-ignore
          if (e.target.hasImage) return
          uploadHandler(projectId as string)
        }
      })
    }
    return () => {
      if (canvas && canvas.removeListeners) canvas.removeListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas])

  return (
    <div className="grid h-[calc(100vh-61px)] w-screen select-none place-items-center overflow-hidden bg-[#eeeeee]">
      <canvas id="canvas" className=" h-full w-full " />
    </div>
  )
}

export default CanvasWrapper
