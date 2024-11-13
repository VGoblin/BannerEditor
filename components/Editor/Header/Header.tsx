import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Logo from '../../UI/Logo'
import Actions from './Actions'
import ElementList from './ElementList'
import HeaderMode from './HeaderMode'

// type Mode = 'Edit' | 'Data Editor' | 'Settings'

export enum Mode {
  Edit = 'Edit',
  DataEditor = 'Data Editor',
  Settings = 'Settings',
}

const Header: React.FC = () => {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState<Mode>(Mode.Edit)
  useEffect(() => {
    if (router.pathname.includes('data-editor')) {
      setActiveMode(Mode.DataEditor)
    } else if (router.pathname.includes('settings')) {
      setActiveMode(Mode.Settings)
    }
  }, [router.pathname])
  return (
    <header className="relative top-0 z-50 flex h-[60px] items-center justify-center bg-[#222222] px-6 text-white">
      <Toaster />
      <div className="absolute left-6 flex items-center gap-4">
        <Logo size="sm" />
        {activeMode === Mode.Edit && <ElementList />}
      </div>
      <HeaderMode activeMode={activeMode} setActiveMode={setActiveMode} />
      <Actions activeMode={activeMode} />
    </header>
  )
}

export default Header
