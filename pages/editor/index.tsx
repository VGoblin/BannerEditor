import type { NextPage } from 'next'

import React from 'react'
import EditorLayout from '../../components/Editor/EditorLayout'
import Head from 'next/head'
import { CanvasProvider } from '../../store/CanvasContext'

// !LEGACY CODE
// Keep this code for backup
const Editor: NextPage = () => {
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

export default Editor
