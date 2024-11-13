import type { CustomTextbox } from '../../../utils/fabric/types'
import {
  Badge,
  Box,
  Group,
  LoadingOverlay,
  Popover,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState, Fragment } from 'react'
import { useRecoilState } from 'recoil'
import { useCanvas } from '../../../hooks/useCanvas'
import { Banner, IProject } from '../../../pages/projects'
import { deleteAction } from '../../../settings/axiosConfig'
import { QueryKeys } from '../../../settings/constants'
import {
  currentBannerIdState,
  EditorZoomState,
  isSyncModeState,
  objectModifiedState,
  selectionCountState,
} from '../../../store/EditorAtoms'
import { destroyCanvasInstance, getCanvasJson, loadCustomJson } from '../../../utils/fabric/fabric'
import { getJSON } from '../../../utils/helper'
import Button from '../../UI/Button'
import Confirm from '../../UI/Confirm'

import AddFormatModal from './AddFormatModal'

export interface IFormatSection {
  title: string
  icon: React.FC
  formats: IFormat[]
}
export interface IFormat {
  width: number
  height: number
  text: string
}

const Formats: React.FC = () => {
  const { canvas, setCanvas } = useCanvas()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [currentBannerId, setCurrentBannerId] = useRecoilState(currentBannerIdState)
  const [isSyncMode, setIsSyncMode] = useRecoilState(isSyncModeState)
  const [_, setSelectionCount] = useRecoilState(selectionCountState)
  const [modified, setObjectModified] = useRecoilState(objectModifiedState)
  const [editorZoomState, setEditorZoomState] = useRecoilState(EditorZoomState)
  const { projectId } = router.query
  const [isPopoverDisable, setIsPopoverDisable] = useState(false)
  const projectData = queryClient.getQueryData([
    QueryKeys.getProjectById,
    router.query.projectId,
  ]) as { data: IProject }

  const onFormatChangeHandler = (banner: Banner) => {
    if (canvas) {
      setEditorZoomState(canvas.getZoom())
    }
    // Reset selected object count
    setSelectionCount(0)
    setObjectModified(0)

    queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
      const banners = [...prevVal.data.banners]
      const crntID = currentBannerId ? currentBannerId : banners[banners.length - 1].id
      const existingBannerIndex = banners.findIndex((item) => item.id === crntID)

      if (existingBannerIndex !== -1) {
        banners[existingBannerIndex].json = getCanvasJson()
      }

      return { ...prevVal, data: { ...prevVal.data, banners } }
    })

    // If SYNC Layer mode is open we need to get fresh data from react query
    const freshData = queryClient.getQueryData([QueryKeys.getProjectById, projectId]) as {
      data: IProject
    }

    const targetBanner = freshData.data.banners.find((item) => item.id === banner.id)
    if (!targetBanner) return

    const newCanvas = loadCustomJson(targetBanner.json, canvas.getZoom())
    if (newCanvas) {
      setCanvas(newCanvas)
    }
    setCurrentBannerId(banner.id)
  }

  const addEventListenerToTextboxes = (result: boolean) => {
    if (!result) {
      return canvas.off('text:changed')
    }

    canvas.on('text:changed', (e: any) => {
      queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
        const result = prevVal.data.banners.map((banner: Banner) => {
          const parsedJson = JSON.parse(banner.json)
          parsedJson.objects.map((obj: CustomTextbox) => {
            if (obj.name === e.target.name || obj.id === e.target.id) {
              obj.text = e.target.text
            }
          })
          banner.json = JSON.stringify(parsedJson)
          return banner
        })
        return { ...prevVal, data: { ...prevVal.data, banners: result } }
      })
    })
  }

  const deleteBannerMutation = useMutation(
    (id: string) => {
      return deleteAction(`project/${projectId}/banner/${id}`)
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([QueryKeys.getProjectById, projectId])
      },
    }
  )

  return (
    <div className="relative max-h-[calc(100vh-196px)] select-none space-y-2">
      <div className="flex items-end justify-between px-2">
        <Text>Sync Layers</Text>
        <Switch
          onLabel="ON"
          offLabel="OFF"
          checked={isSyncMode}
          onChange={(event) => {
            setIsSyncMode(event.currentTarget.checked)
            addEventListenerToTextboxes(event.currentTarget.checked)
          }}
        />
      </div>

      <LoadingOverlay visible={!projectData || deleteBannerMutation.isLoading} overlayBlur={2} />
      {projectData &&
        projectData.data.banners.map((banner) => {
          return (
            <Group
              position="apart"
              key={banner.id}
              className={`rounded-md px-2 py-1 ${
                currentBannerId === banner.id ? 'bg-slate-100' : ''
              }`}
            >
              <Stack
                spacing={0}
                className="cursor-pointer"
                onClick={() => {
                  onFormatChangeHandler(banner)
                }}
              >
                <span className="text-sm font-bold">{banner.name}</span>
                <span className="text-xs font-normal text-gray-500">
                  {banner.width} x {banner.height}
                </span>
              </Stack>

              <Confirm
                btnText="Delete"
                icon={
                  <Trash
                    size={18}
                    className="cursor-pointer text-red-400 transition-colors duration-150 hover:text-red-600"
                  />
                }
                text="Are you sure you want to delete this banner?"
                onClick={() => deleteBannerMutation.mutate(banner.id)}
                disabled={isPopoverDisable}
              />
            </Group>
          )
        })}

      <AddFormatModal />
    </div>
  )
}

export default Formats
