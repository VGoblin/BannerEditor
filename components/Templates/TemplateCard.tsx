import React, { useState } from 'react'
import { ITemplate } from '../../pages/templates'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { postAction } from '../../settings/axiosConfig'
import { AspectRatio, Box, Group, Image, Modal, Stack, TextInput } from '@mantine/core'
import Button from '../UI/Button'
import { useLocalStorage } from '@mantine/hooks'
import { sluggify } from '../../utils/helper'

type Props = {
  template: ITemplate
}

const TemplateCard: React.FC<Props> = ({ template }) => {
  const router = useRouter()
  const [currentWorkSpace, setCurrentWorkSpace] = useLocalStorage({
    key: 'currentWorkSpace',
    defaultValue: { id: '', name: '' },
  })
  const [showDetail, setShowDetail] = useState(false)
  const [projectName, setProjectName] = useState(template.name)
  const [nameInputVisible, setNameInputVisible] = useState(false)

  const createProjectMutation = useMutation(
    async ({ templateId, name }: { templateId: number; name: string }) => {
      const res = await postAction('project', {
        name,
        templateId,
        workspaceId: currentWorkSpace.id,
      })
      if (res) return res.data
    },
    {
      onSuccess(data) {
        setShowDetail(false)
        router.push(`/projects/${data.id}?workspaceId=${currentWorkSpace.id}`)
      },
    }
  )

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        key={template.id}
        className="group relative flex cursor-pointer flex-col self-baseline overflow-hidden rounded-lg border  border-gray-200 bg-white hover:border-bfpurple-600 hover:bg-bfpurple-50"
      >
        <Box>
          <AspectRatio ratio={400 / 300} sx={{ maxWidth: 400 }} mx="auto">
            <Image src={template.image} alt={template.name} />
          </AspectRatio>
        </Box>
        <div className="flex flex-1 flex-col justify-between space-y-1 p-2">
          <div>
            <h3 className="mb-0.5 text-sm font-medium text-gray-900">
              {/* We should redirect to slug */}

              <span aria-hidden="true" className="absolute inset-0" />
              {template.name}
            </h3>
          </div>
          <Modal
            opened={showDetail}
            onClose={() => {
              setNameInputVisible(false)
              setProjectName('')
              setShowDetail(false)
            }}
            title={template.name}
            centered
            overlayBlur={2}
          >
            <Stack>
              <div className="aspect-w-3 aspect-h-4 sm:aspect-none bg-gray-200 group-hover:opacity-75 sm:h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.image}
                  alt={template.name}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>
              <Group position="apart">
                <TextInput
                  label="Project name"
                  value={projectName}
                  onChange={(e) => setProjectName(sluggify(e.target.value))}
                  placeholder="Give your project a name"
                  required
                />
                <Button
                  className="self-end"
                  type="submit"
                  loading={createProjectMutation.isLoading}
                  onClick={() => {
                    if (!projectName) return
                    createProjectMutation.mutate({ templateId: template.id, name: projectName })
                  }}
                >
                  Use this template
                </Button>
              </Group>
            </Stack>
          </Modal>
        </div>
      </div>
    </>
  )
}

export default TemplateCard
