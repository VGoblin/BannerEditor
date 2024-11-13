import React, { useCallback, useState } from 'react'
import { fabric } from 'fabric'
import { generateSVG } from '../utils/fabric/svg'
import { useCanvas } from './useCanvas'
import { useRecoilValue } from 'recoil'
import { isSyncModeState } from '../store/EditorAtoms'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../settings/constants'
import { CustomImage } from '../utils/fabric/types'
import { Banner } from '../pages/projects'

type Props = {
  file: File
  projectId: string
}

const useImageUpload = () => {
  const { canvas } = useCanvas()
  const isSyncMode = useRecoilValue(isSyncModeState)
  // const [imageUrl, setImageUrl] = useState<string | null>(null)
  const queryClient = useQueryClient()

  /* Updating the image on the canvas. */
  const updateObjectHandler = useCallback(
    (imageUrl: string, projectId: string) => {
      const activeObject = canvas?.getActiveObject() as CustomImage;
      if (!activeObject) return;
      if (activeObject.objType === 'image') {
        fabric.Image.fromURL(imageUrl, (img2) => {
          if (isSyncMode) {
            queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
              const result = prevVal.data.banners.map((banner: Banner) => {
                const parsedJson = JSON.parse(banner.json)
                parsedJson.objects.map((o: CustomImage) => {
                  // @ts-ignore
                  if (o.name === activeObject.name) {
                    // @ts-ignore
                    o.object.src = imageUrl
                  }
                })
                banner.json = JSON.stringify(parsedJson)
                return banner
              })
              return { ...prevVal, data: { ...prevVal.data, banners: result } }
            })
          }
          activeObject.setObject(img2);
          activeObject.recompute();
          activeObject.hasImage = true;
          canvas.fire('object:modified');
          canvas.requestRenderAll();
        })
      }
    },
    [canvas, isSyncMode, queryClient]
  )

  /* Reading the file and converting it to base64. */
  const uploadImageHandler = useCallback(
    (file: File, projectId: string) => {
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            // setImageUrl(reader.result as string)
            if (file.type === 'image/svg+xml') {
              generateSVG(reader.result as string)
              canvas.remove(canvas.getActiveObject())
            } else {
              // setImagePreviewURL(reader.result as string)
              updateObjectHandler(reader.result as string, projectId);
            }
          }
        }
        reader.readAsDataURL(file);
      }
    },
    [canvas, updateObjectHandler]
  )

  /* Creating a file input element and clicking it. */
  const openClickFileInput = useCallback(
    (projectId: string) => {
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/jpeg, image/png, image/jpg, image/svg, image/*'
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          return uploadImageHandler(file, projectId)
        }
      }

      fileInput.click()

      fileInput.remove()
    },
    [uploadImageHandler]
  )

  /* A callback function that is used to upload the image. */
  const uploadHandler = useCallback(
    (projectId: string) => {
      openClickFileInput(projectId)
    },
    [openClickFileInput]
  )

  return { uploadHandler }
}

export default useImageUpload
