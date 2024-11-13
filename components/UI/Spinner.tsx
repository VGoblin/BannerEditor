import { Loader } from '@mantine/core'
import React from 'react'

const Spinner = () => {
  return (
    <div className=" absolute top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center backdrop-blur-sm">
      <Loader />
    </div>
  )
}
export default Spinner
