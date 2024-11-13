import { Mode } from './Header'
import React, { useState } from 'react'
import { ArrowForward, Back } from 'iconsax-react'
import { useCanvas } from '../../../hooks/useCanvas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAction, pathcAction, postAction } from '../../../settings/axiosConfig'
import { useRouter } from 'next/router'
import { QueryKeys } from '../../../settings/constants'
import { Banner, IProject } from '../../../pages/projects'
import { currentBannerIdState, EditorZoomState } from '../../../store/EditorAtoms'
import { useRecoilState } from 'recoil'
import Spinner from '../../UI/Spinner'
import { getCanvasJson } from '../../../utils/fabric/fabric'
import { CustomObject } from '../../../utils/fabric/types'
import axios from 'axios'
import { isBase64 } from '../../../utils/helper'
import { Tooltip } from '@mantine/core'
import toast from 'react-hot-toast'

type Props = {
  activeMode: Mode
}

const REGEX = /https:\/\/bannerfans-images.s3.amazonaws.com\/\d+\/uploads\/\d+\.\w+/

const Actions: React.FC<Props> = ({ activeMode }) => {
  const { canvas, frame } = useCanvas()
  const router = useRouter()
  const { projectId } = router.query
  const queryClient = useQueryClient()
  const [updateIsLoading, setIsLoading] = useState(false)
  const [currentBannerId, setCurrentBannerId] = useRecoilState(currentBannerIdState)
  const [editorZoomState, setEditorZoomState] = useRecoilState(EditorZoomState)
  const projectData = queryClient.getQueryData([QueryKeys.getProjectById, projectId]) as {
    data: IProject
  }

  const canvasToPng = () => {
    if (!frame) return
    const legacyZoom = canvas.getZoom()
    canvas.zoomToPoint({ x: window.innerWidth / 2, y: (window.innerHeight - 60) / 2 }, 1)

    const dataURL = canvas.toDataURL({
      width: frame.width,
      height: frame.height,
      left: (window.innerWidth - frame.width!) / 2,
      top: (window.innerHeight - frame.height! - 50) / 2,
      format: 'png',
    })

    canvas.zoomToPoint({ x: window.innerWidth / 2, y: (window.innerHeight - 60) / 2 }, legacyZoom)
    return dataURL
  }

  const updateProject = useMutation(
    async ({ banners }: { banners: Banner[] }) => {
      const data = {
        // ! Ask for the banner name
        name: projectData.data.name,
        // image: canvasToPng(),
        image: 'https://picsum.photos/200',
        banners: [...banners],
      }
      return pathcAction(`project/${projectId}`, data)
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([QueryKeys.getProjectById, projectId])
        setIsLoading(false)
        toast.success('Saved!')
      },
      onError() {
        toast.error('Error Occurred!')
      },
    }
  )

  const replaceImageSources = async (banners: Banner[]) => {
    const imageSources: File[] = []
    const imageTypes: string[] = []
    banners.forEach((banner) => {
      const json = JSON.parse(banner.json)
      json.objects.forEach((obj: CustomObject) => {
        if (obj.type === 'image') {
          // @ts-ignore
          if (isBase64(obj.object.src)) {
            // @ts-ignore
            const file = dataURLtoFile(obj.object.src, 'image.jpeg')

            imageSources.push(file)

            // @ts-ignore
            imageTypes.push(obj.object.src.split(';')[0].split('/')[1])
          }
        }
      })
    })

    if (!imageTypes.length) return banners

    const presignedUrls = await getAction(
      `project/${projectId}/upload-urls?exts=${imageTypes.join('-')}`
    )

    await Promise.all(
      presignedUrls!.data.map((url: string, i: number) => {
        return axios.put(url, imageSources[i], {
          headers: {
            'x-amz-acl': 'public-read',
            'Content-Type': 'image/jpeg',
          },
        })
      })
    )

    banners.forEach((banner, i) => {
      const json = JSON.parse(banner.json)
      json.objects.forEach((obj: CustomObject) => {
        if (obj.type === 'image') {
          console.log('presigned', presignedUrls?.data[i])

          // @ts-ignore
          if (!isBase64(obj.object.src)) return
          // @ts-ignore
          obj.object.src = presignedUrls.data[i]?.match(REGEX)[0]
        }
      })
      banner.json = JSON.stringify(json)
    })

    return banners
  }

  const updateQueryCache = async () => {
    const banners = [...projectData.data.banners]

    const crntID = currentBannerId ? currentBannerId : banners[banners.length - 1].id
    const existingBannerIndex = banners.findIndex((item) => item.id === crntID)

    if (existingBannerIndex !== -1) {
      banners[existingBannerIndex].json = getCanvasJson()
    }

    const newBanners = await replaceImageSources(banners)

    queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
      return { ...prevVal, data: { ...prevVal.data, newBanners } }
    })

    // Fallback
    getCanvasJson()

    updateProject.mutate({ banners: newBanners })
  }

  const onSaveHandler = () => {
    setIsLoading(true)
    if (canvas) setEditorZoomState(canvas.getZoom())

    updateQueryCache()
  }

  const dataURLtoFile = (dataurl: string, filename: string) => {
    let arr = dataurl.split(','),
      // @ts-ignore
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  return (
    <>
      {(updateIsLoading || updateProject.isLoading) && <Spinner />}
      <div className="absolute right-6 flex gap-16">
        <div className="flex cursor-pointer items-center gap-2">
          <Tooltip label="Undo">
            <Back
              size="24"
              color="#FFFFFF"
              onClick={() => {
                // @ts-ignore
                canvas.undo()
              }}
            />
          </Tooltip>
          <Tooltip label="Redo">
            <ArrowForward
              size="24"
              color="#FFFFFF"
              onClick={() => {
                // @ts-ignore
                canvas.redo()
              }}
            />
          </Tooltip>
        </div>
        {activeMode === Mode.Edit && (
          <button
            className="rounded-[20px] bg-white px-[34px] py-[10px] font-bold text-black duration-500 hover:scale-105"
            onClick={onSaveHandler}
          >
            Save
          </button>
        )}
      </div>
    </>
  )
}

export default Actions
