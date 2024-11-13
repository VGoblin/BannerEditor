import type { Mode } from './Header'
import React, { useMemo, useState } from 'react'
import { GalleryEdit, GridEdit, Setting5 } from 'iconsax-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  activeMode: Mode
  setActiveMode: (mode: Mode) => void
}

const HeaderMode: React.FC<Props> = ({ activeMode, setActiveMode }) => {
  const router = useRouter()
  const { workspaceId, projectId } = router.query
  const list = useMemo(
    () => [
      {
        title: 'Edit',
        icon: GalleryEdit,
        url: `/projects/${projectId}/editor?workspaceId=${workspaceId}`,
      },
      {
        title: 'Data Editor',
        icon: GridEdit,
        url: `/projects/${projectId}/data-editor?workspaceId=${workspaceId}`,
      },
      {
        title: 'Generate',
        icon: Setting5,
        url: `/projects/${projectId}/settings?workspaceId=${workspaceId}`,
      },
    ],
    [workspaceId, projectId]
  )

  return (
    <ul className="flex gap-1">
      {list.map((el) => (
        <Link href={el.url} key={el.title}>
          <a>
            <li
              onClick={() => setActiveMode(el.title as Mode)}
              className={`flex min-w-[64px]  cursor-pointer flex-col items-center justify-between space-y-[2px] p-3 text-xs ${
                activeMode === el.title ? 'bg-white text-black' : ''
              }`}
            >
              <el.icon size={18} fill="#FFFFFF" />
              <span className="text-xs">{el.title}</span>
            </li>
          </a>
        </Link>
      ))}
    </ul>
  )
}

export default HeaderMode
