import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import EditorLayout from '../../../components/Editor/EditorLayout'
import { CanvasProvider } from '../../../store/CanvasContext'

const EditorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bannerfans | Editor</title>
      </Head>
      <CanvasProvider>
        <EditorLayout />
      </CanvasProvider>
    </>
  )
}

export default EditorPage
