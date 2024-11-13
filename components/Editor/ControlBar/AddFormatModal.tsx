import React, { useState, Fragment } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Banner, IProject } from '../../../pages/projects'
import { pathcAction, postAction } from '../../../settings/axiosConfig'
import { useRouter } from 'next/router'
import { QueryKeys } from '../../../settings/constants'
import { useRecoilState } from 'recoil'
import { currentBannerIdState } from '../../../store/EditorAtoms'
import {
  destroyCanvasInstance,
  getCanvasInstance,
  getCanvasJson,
} from '../../../utils/fabric/fabric'
import { Group, Modal, Select, Stack, TextInput } from '@mantine/core'
import Button from '../../UI/Button'
import { useCanvas } from '../../../hooks/useCanvas'
import { showNotification } from '@mantine/notifications'
import Spinner from '../../UI/Spinner'
import { sluggify } from '../../../utils/helper'

type ISelectedFormat = {
  width: number
  height: number
}

const formatList = [
  {
    id: 18,
    measurement: { width: 1200, height: 1200 },
    value: '18',
    label: '1200x1200 - Facebook Post',
    group: 'Facebook',
  },
  {
    id: 19,
    measurement: { width: 1200, height: 628 },
    value: '19',
    label: '1200x628 - Facebook Feed',
    group: 'Facebook',
  },
  {
    id: 20,
    measurement: { width: 800, height: 312 },
    value: '20',
    label: '800x312 - Facebook Cover',
    group: 'Facebook',
  },
  {
    id: 21,
    measurement: { width: 728, height: 90 },
    value: '21',
    label: '728x90 - Overlay Ads',
    group: 'Youtube',
  },
  {
    id: 22,
    measurement: { width: 1280, height: 720 },
    label: '1280x720 - Youtube Thumbnail',
    value: '22',
    group: 'Youtube',
  },
  {
    id: 23,
    measurement: { width: 2560, height: 423 },
    label: '2560x423 - Youtube Channel Art (Desktop)',
    value: '23',
    group: 'Youtube',
  },
  {
    id: 24,
    measurement: { width: 1080, height: 1080 },
    label: '1080x1080 - Instagram Post(1:1)',
    value: '24',
    group: 'Instagram',
  },
  {
    id: 25,
    measurement: { width: 1000, height: 1200 },
    label: '1000x1200 - Instagram Story(1:1,2)',
    value: '25',
    group: 'Instagram',
  },
  {
    id: 26,
    measurement: { width: 1080, height: 1920 },
    label: '1080x1920 - Instagram Story(9:16)',
    value: '26',
    group: 'Instagram',
  },
  {
    id: 27,
    measurement: { width: 300, height: 250 },
    label: '300x250 - Linkedin Message Ads',
    value: '27',
    group: 'Linkedin',
  },
  {
    id: 28,
    measurement: { width: 1200, height: 628 },
    label: '1200x628 - Linkedin Feed',
    value: '28',
    group: 'Linkedin',
  },
  {
    id: 29,
    measurement: { width: 1200, height: 1200 },
    label: '1200x1200 - Linkedin Message Ads',
    value: '29',
    group: 'Linkedin',
  },
  {
    id: 30,
    measurement: { width: 735, height: 1102 },
    label: '735x1102 - Pinterest Pins',
    value: '30',
    group: 'Pinterest',
  },
  {
    id: 31,
    measuremnet: 'px',
    measurement: { width: 1000, height: 1500 },
    label: '1000x1500 - Pinterest Prometed Pins',
    value: '31',
    group: 'Pinterest',
  },
  {
    id: 32,
    measurement: { width: 1200, height: 628 },
    label: '1200x628 - Twitter Post',
    value: '32',
    group: 'Twitter',
  },
  {
    id: 33,
    measurement: { width: 1000, height: 675 },
    label: '1200x675 - Twitter Prometed Post',
    value: '33',
    group: 'Twitter',
  },
]
const AddFormatModal: React.FC = () => {
  const router = useRouter()
  const { projectId } = router.query
  const queryClient = useQueryClient()
  const { setCanvas } = useCanvas()
  const [currentBannerId, setCurrentBannerId] = useRecoilState(currentBannerIdState)
  const [formatName, setFormatName] = useState('')
  const [isAddFormatModalOpen, setIsAddFormatModalOpen] = useState(false)

  const [selectedFormat, setSelectedFormat] = useState<ISelectedFormat | null>(null)

  const projectData = queryClient.getQueryData([QueryKeys.getProjectById, projectId]) as {
    data: IProject
  }

  const addNewBannerMutation = useMutation(
    (banner: Banner) => {
      return pathcAction(`project/${projectId}`, {
        // ! Ask for the banner name
        name: projectData.data.name,
        image: 'https://picsum.photos/200',
        banners: [...projectData.data.banners, banner],
      })
    },
    {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries([QueryKeys.getProjectById, projectId])

        // Set the current banner id
        setCurrentBannerId(variables.id)

        // Reset format name
        setFormatName('')

        // Close modal
        setIsAddFormatModalOpen(false)
      },
    }
  )

  const createNewBanner = useMutation(
    async ({ width, height }: { width: number; height: number }) => {
      return postAction(`project/${projectId}/new-banner`, {
        name: formatName,
        width,
        height,
      }) as Promise<{ data: Banner }>
    },
    {
      onSuccess(data, variables, context) {
        queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
          const banners = [...prevVal.data.banners]
          const crntID = currentBannerId ? currentBannerId : banners[banners.length - 1].id
          const existingBannerIndex = banners.findIndex((item) => item.id === crntID)

          if (existingBannerIndex !== -1) {
            banners[existingBannerIndex].json = getCanvasJson()
          }

          return { ...prevVal, data: { ...prevVal.data, banners } }
        })

        // Destroy current canvass
        destroyCanvasInstance()

        // Create new canvas
        getCanvasInstance(variables.width, variables.height)

        // Get new canvas json
        const json = getCanvasJson()

        addNewBannerMutation.mutate({ ...data.data, json })
      },
    }
  )

  const loadFormatHandler = () => {
    //  formatName validation
    if (!formatName.trim()) {
      return showNotification({
        message: 'Please enter a valid format name',
        color: 'red',
      })
    }

    if (!selectedFormat) {
      return showNotification({
        message: 'Please select a format',
        color: 'red',
      })
    }

    // Destroy current canvass
    // destroyCanvasInstance()

    // Create new canvas
    // const newCanvas = getCanvasInstance(selectedFormat.width, selectedFormat.height)

    // Get new canvas json
    // const json = getCanvasJson()

    // queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
    //   const banners = [...prevVal.data.banners]
    //   const crntID = currentBannerId ? currentBannerId : banners[0].id

    //   const existingBannerIndex = banners.findIndex((item) => item.id === crntID)

    //   if (existingBannerIndex !== -1) {
    //     banners[existingBannerIndex].json = getCanvasJson()
    //   }

    //   return { ...prevVal, data: { ...prevVal.data, banners } }
    // })

    // Generate new banner with new canvas json, width and height
    createNewBanner.mutate({ width: selectedFormat.width, height: selectedFormat.height })

    // Set new canvas to canvas state
    // setCanvas(newCanvas)

    // setSelectedFormat(null)
    // setFormatName('')
  }

  return (
    <div className="py-4">
      {createNewBanner.isLoading && <Spinner />}
      <Button size="xs" center onClick={() => setIsAddFormatModalOpen(true)}>
        Create new format
      </Button>
      <Modal
        centered
        overlayBlur={2}
        opened={isAddFormatModalOpen}
        onClose={() => setIsAddFormatModalOpen(false)}
        title="Create new format"
      >
        <Stack spacing={'xs'}>
          <Select
            label="Select a template"
            placeholder="Pick one"
            maxDropdownHeight={250}
            data={formatList}
            onChange={(value) => {
              setSelectedFormat(formatList.find((item) => item.value === value)!.measurement)
            }}
          />
          <TextInput
            required
            label="Format Name"
            value={formatName}
            onChange={(e) => {
              setFormatName(sluggify(e.target.value))
            }}
          />

          <Group className="flex justify-end gap-4">
            <Button
              ghost
              onClick={() => {
                setIsAddFormatModalOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              loading={createNewBanner.isLoading || addNewBannerMutation.isLoading}
              onClick={() => {
                loadFormatHandler()
              }}
            >
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  )
}

export default AddFormatModal
