import type { NextPage } from 'next'
import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../../components/Layout/index'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../settings/constants'
import { getAction } from '../../settings/axiosConfig'
import TemplateCard from '../../components/Templates/TemplateCard'
import { TextInput, Box, LoadingOverlay, Title } from '@mantine/core'
import Head from 'next/head'

export interface ITemplate {
  id: number
  image: string
  name: string
  slug: string
}

interface IPaginationData {
  currentPage: number
  pageSize: number
  total: number
}
interface ITemplatesData {
  data: ITemplate[]
  pagination: IPaginationData
}

const Templates: NextPage = () => {
  const { data } = useQuery([QueryKeys.getTemplates], async () => {
    // ! Page 1 static, should change
    const response = await getAction('template?page=1')
    if (response) return response.data as ITemplatesData
  })

  const [filteredData, setFilteredData] = useState<ITemplate[]>([])
  const [search, setSearch] = useState('')

  const searchProjects = useCallback(
    (filter: string) => {
      if (!data) return
      const filtered = data.data?.filter((project) => {
        return project.name.trim().toLowerCase().includes(filter.trim().toLowerCase())
      })

      setFilteredData(filtered || [])
    },
    [data]
  )

  useEffect(() => {
    if (!search.trim()) return setFilteredData(data?.data || [])
    searchProjects(search)
  }, [search, data, searchProjects])

  return (
    <>
      <Head>
        <title>Bannerfans | Templates</title>
      </Head>
      <Layout>
        <Title order={1} size="h4" mb={16} weight={500} pb={18} className="border-b">
          Templates
        </Title>
        {/* Don't remove grid. This added for safari layout */}
        <div className="grid">
          <div className="mb-4">
            <Box className="relative w-1/4 rounded-md shadow-sm">
              <TextInput
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Search templates"
                rightSection={
                  <MagnifyingGlassIcon
                    className="h-5 w-5 cursor-pointer text-gray-400"
                    aria-hidden="true"
                  />
                }
                // {...form.getInputProps('filter')}
              />
            </Box>
          </div>
          <div className="grid  min-h-[200px] grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
            {filteredData &&
              filteredData.map((template, idx) => (
                <TemplateCard key={`project-${template.id}`} template={template} />
              ))}
            <LoadingOverlay visible={!data} overlayBlur={2} />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Templates
