import { More, Youtube } from 'iconsax-react'
import React from 'react'
import GroupTitle from '../UI/GroupTitle'
import FrameSize from './FrameSize'
import FrameColor from './FrameColor'

const CanvasConfigWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <header className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2 ">
          <Youtube size="18" color="#000000" />
          <p className="font-semibold">Artboard</p>
        </div>
        <More size={18} fill="#000000" className="rotate-90 cursor-pointer" />
      </header>
      <hr className="-mx-6" />
      <div className="mt-4 space-y-4 text-sm">
        <GroupTitle title="Layout" />
        <FrameSize />
        <FrameColor />
      </div>
    </div>
  )
}

export default CanvasConfigWrapper
