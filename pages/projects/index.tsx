import type { NextPage } from 'next'
import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../../components/Layout/index'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import ProjectCard from '../../components/Projects/ProjectCard'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../settings/constants'
import { getAction } from '../../settings/axiosConfig'
import { LoadingOverlay, TextInput, Box, Title } from '@mantine/core'
import { useRecoilState } from 'recoil'
import { useLocalStorage } from '@mantine/hooks'
import Head from 'next/head'
import { currentWorkSpaceState } from '../../store/EditorAtoms'

export interface Banner {
  id: string
  name: string
  width: number
  height: number
  json: string
  isActive: boolean
  projectId: number
}

export interface IProject {
  id: number
  templateId: number
  name: string
  image: string
  workspaceId: string
  createdAt: string
  updatedAt: string
  banners: Banner[]
}

const Projects: NextPage = () => {
  const [workSpace, setWorkSpace] = useRecoilState(currentWorkSpaceState)
  const [currentWorkSpace, setCurrentWorkspace] = useLocalStorage({
    key: 'currentWorkSpace',
    defaultValue: workSpace,
  })

  const { data } = useQuery(
    [QueryKeys.getProjects, currentWorkSpace.id],
    async () => {
      const response = await getAction(`project?workspaceId=${currentWorkSpace.id}`)
      if (response) return response.data as IProject[]
    },
    {
      // enabled: !!currentWorkSpace.id,
    }
  )

  const [filteredData, setFilteredData] = useState<IProject[]>([])
  const [search, setSearch] = useState('')

  const searchProjects = useCallback(
    (filter: string) => {
      const filtered = data?.filter((project) => {
        return project.name.trim().toLowerCase().includes(filter.trim().toLowerCase())
      })

      setFilteredData(filtered || [])
    },
    [data]
  )

  useEffect(() => {
    if (!search.trim()) return setFilteredData(data || [])
    searchProjects(search)
  }, [search, data, searchProjects])

  return (
    <>
      <Head>
        <title>Bannerfans | Projects</title>
      </Head>
      <Layout>
        <Title order={1} size="h4" mb={16} weight={500} pb={18} className="border-b">
          Projects
        </Title>
        <div>
          <div className="mb-4">
            <Box className="relative mt-1 w-1/4 rounded-md shadow-sm">
              <TextInput
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Search projects"
                rightSection={
                  <MagnifyingGlassIcon
                    className="h-5 w-5 cursor-pointer text-gray-400"
                    aria-hidden="true"
                  />
                }
              />
            </Box>
          </div>
          <div className="relative grid min-h-[200px] grid-cols-1 gap-y-4  sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
            {filteredData &&
              filteredData.map((project, idx) => (
                <ProjectCard key={`project-${idx}`} project={project} />
              ))}
            <LoadingOverlay visible={!data} overlayBlur={2} />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Projects
