import type { IProject } from '..'
import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { createServerSupabaseClient, Session } from '@supabase/auth-helpers-nextjs'
import {
  AspectRatio,
  Box,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import Layout from '../../../components/Layout'
import Button from '../../../components/UI/Button'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useLocalStorage } from '@mantine/hooks'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAction } from '../../../settings/axiosConfig'
import { QueryKeys } from '../../../settings/constants'

type Props = {
  projectData: IProject
}

const dataList = [
  {
    id: 6,
    title: 'Rest API',
    description: "Let's scale your image production via API",
  },
  // {
  //   id: 1,
  //   title: 'Single Generation',
  //   description: 'Quickly generate one image from this template',
  // },
  {
    id: 2,
    title: 'Spreadsheet Generation',
    description: 'Import, connect or create data from scratch to generate images in bulk',
  },
  {
    id: 3,
    title: 'Dynamic Images',
    description: 'Personalized images using URL parameters… Perfect for email campaigns',
  },
  // {
  //   id: 4,
  //   title: 'Image Forms',
  //   description: 'Share a form that allows anyone to generate images from this template',
  // },
  // {
  //   id: 5,
  //   title: 'Make (formerly Integromat)',
  //   description: 'Connect Bannerfans to other apps',
  // },
]

const ProjectDetail: NextPage<Props> = ({ projectData }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { projectId } = router.query

  const [currentWorkSpace, setCurrentWorkSpace] = useLocalStorage({
    key: 'currentWorkSpace',
    defaultValue: { id: '', name: '', ownerId: '' },
  })

  const test = queryClient.getQueryData([QueryKeys.getProjects, currentWorkSpace.id])

  const deleteProjectMutation = useMutation(
    (id: number) => {
      return deleteAction(`project/${id}`)
    },
    {
      onSuccess(data, variables) {
        queryClient.setQueryData([QueryKeys.getProjects, currentWorkSpace.id], (prevVal: any) => {
          return prevVal.filter((project: any) => project.id !== variables)
        })
        router.push('/projects')
      },
    }
  )

  return (
    <>
      <Head>
        <title>Bannerfans | {projectData.name}</title>
      </Head>
      <Layout>
        <Grid>
          <Grid.Col span={12}>
            <Title order={1} size="h4" weight={500} pb={18} className="border-b">
              {projectData.name}
            </Title>
          </Grid.Col>
          <Grid.Col xs={12} md={6}>
            <AspectRatio ratio={1 / 1} className="bg-gradient-to-r from-violet-300 to-violet-400">
              <Image src={projectData.image} alt="Project Preview" />
            </AspectRatio>
            <Group position="right" mt={16}>
              <Button
                loading={deleteProjectMutation.isLoading}
                className="bg-red-400 hover:bg-red-600"
                onClick={() => {
                  deleteProjectMutation.mutate(projectData.id)
                }}
              >
                Delete Project
              </Button>
              <Button
                component="a"
                href={`/projects/${projectId}/editor?workspaceId=${currentWorkSpace.id}`}
              >
                Edit Project
              </Button>
            </Group>
          </Grid.Col>
          <Grid.Col xs={12} md={6} p={16}>
            <Box>
              <Title order={3} size="h4" weight={700} pb={18}>
                Banners
              </Title>
              <Flex direction="column" gap={4}>
                {projectData.banners.map((banner) => (
                  <Text key={banner.id}>
                    <span className="font-medium">{banner.name}</span> - {banner.width} x{' '}
                    {banner.height}
                  </Text>
                ))}
              </Flex>
            </Box>
            <Divider my={18} />
            <Box>
              <Title order={3} size="h4" weight={700} pb={18}>
                Details
              </Title>
              <Group spacing={4}>
                <Text weight={500}>Creation Time:</Text>
                <Text>{dayjs(projectData.createdAt).format('DD MMMM YYYY')}</Text>
              </Group>
              <Group spacing={4}>
                <Text weight={500}>Last Edited:</Text>
                <Text>{dayjs(projectData.updatedAt).format('DD MMMM YYYY')}</Text>
              </Group>
            </Box>
            <Divider my={18} />
            <Box>
              <Title order={3} size="h4" weight={700} pb={18}>
                Integrations
              </Title>
              <Stack spacing={4} align="flex-start">
                {dataList.map((item) => (
                  <Link
                    href={`/projects/${projectId}/settings?workspaceId=${currentWorkSpace.id}`}
                    key={item.id}
                  >
                    <a className="inline">
                      <Text weight={500}>{item.title}</Text>
                    </a>
                  </Link>
                ))}
              </Stack>
            </Box>
          </Grid.Col>
        </Grid>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }

  let config = { headers: { Authorization: 'Bearer ' + session.access_token } }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}project/${ctx.query.projectId}`,
    config
  )
  const data = await res.json()

  return {
    props: {
      projectData: data,
    },
  }
}

export default ProjectDetail
