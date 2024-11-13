import type { IProject } from '../../pages/projects'
import React from 'react'
import { AspectRatio, Box, Image } from '@mantine/core'
import Link from 'next/link'

const randomColor = () => {
  const color = Math.floor(Math.random() * 4) + 1
  if (color == 1) {
    return 'bg-red-100 text-red-800'
  } else if (color == 2) {
    return 'bg-green-100 text-green-800'
  } else if (color == 3) {
    return 'bg-blue-100 text-blue-800'
  } else if (color == 4) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (color == 5) {
    return 'bg-indigo-100 text-indigo-800'
  }
  return 'bg-pink-100 text-pink-800'
}

type Props = {
  project: IProject
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    // <Link href={`/projects/${project.id}/editor/?workspaceId=${project.workspaceId}`}>
    <Link href={`/projects/${project.id}`}>
      <a
        key={project.id}
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-bfpurple-600 hover:bg-bfpurple-50"
      >
        <Box>
          <AspectRatio ratio={400 / 300} sx={{ maxWidth: 400 }} mx="auto">
            <Image src={project.image} alt={project.name} />
          </AspectRatio>
        </Box>
        <div className="flex flex-1 flex-col justify-between space-y-1 p-2">
          <div>
            <h3 className="mb-0.5 text-sm font-medium text-gray-900">
              <span aria-hidden="true" className="absolute inset-0" />
              {project.name}
            </h3>
            {/* <p className="text-sm text-gray-500">{project.description}</p> */}
          </div>
          <div className="">
            {project.banners.map((banner, idx) => (
              <span
                key={banner.id}
                className={`mr-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${randomColor()}`}
              >
                {banner.name}
              </span>
            ))}
          </div>
        </div>
      </a>
    </Link>
  )
}

export default ProjectCard
