import { Accordion, Box, Center, Container, createStyles, Group, Text } from '@mantine/core'
import { ArrangeHorizontal, Bubble, Edit, Flashy, GridEdit, Image } from 'iconsax-react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import Header from '../../../components/Editor/Header/Header'
import { MakeComLogo } from '../../../components/UI/Icons'

const MirrorEditor = dynamic(() => import('../../../components/Projects/Settings/MirrorEditor'), {
  ssr: false,
})

const dataList = [
  {
    id: 6,
    title: 'Rest API',
    description: "Let's scale your image production via API",
    icon: ArrangeHorizontal,
    content: <MirrorEditor />,
  },
  // {
  //   id: 1,
  //   title: 'Single Generation',
  //   description: 'Quickly generate one image from this template',
  //   // eslint-disable-next-line jsx-a11y/alt-text
  //   icon: Image,
  //   content: <div>Quickly generate one image from this template</div>,
  // },
  {
    id: 2,
    title: 'Spreadsheet Generation',
    description: 'Import, connect or create data from scratch to generate images in bulk',
    icon: GridEdit,
    content: <div>Import, connect or create data from scratch to generate images in bulk</div>,
  },
  {
    id: 3,
    title: 'Dynamic Images',
    description: 'Personalized images using URL parameters… Perfect for email campaigns',
    icon: Flashy,
    content: <div>Personalized images using URL parameters… Perfect for email campaigns</div>,
  },
  // {
  //   id: 4,
  //   title: 'Image Forms',
  //   description: 'Share a form that allows anyone to generate images from this template',
  //   icon: Edit,
  //   content: <div>Share a form that allows anyone to generate images from this template</div>,
  // },
  // {
  //   id: 5,
  //   title: 'Make (formerly Integromat)',
  //   description: 'Connect Bannerfans to other apps',
  //   icon: MakeComLogo,
  //   content: <div>Connect Bannerfans to other apps</div>,
  // },
]

const ProjectSettings: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bannerfans | Settings</title>
      </Head>
      <Header />
      <Box sx={{ minHeight: 'calc(100vh - 30px)', paddingTop: 30, backgroundColor: '#eee' }}>
        <Container size={1368}>
          <Accordion variant="contained" className="rounded-md  bg-white shadow">
            {dataList.map((item) => {
              return (
                <Accordion.Item value={item.title} key={item.id}>
                  <Accordion.Control>
                    <Group>
                      <item.icon size="24" className="min-w-[60px] text-slate-400" />
                      <Box>
                        <Text size="md">{item.title}</Text>
                        <Text size="sm" className="text-slate-400">
                          {item.description}
                        </Text>
                      </Box>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>{item.content}</Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </Container>
      </Box>
    </>
  )
}

export default ProjectSettings
