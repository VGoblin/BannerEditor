import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition, Popover, Listbox } from '@headlessui/react'
import Image from 'next/image'
import {
  Bars3Icon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  BellAlertIcon,
  WifiIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useUser, useSessionContext, User } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'
import { getAction } from '../../settings/axiosConfig'
import { QueryKeys } from '../../settings/constants'
import { useLocalStorage } from '@mantine/hooks'
import Logo from '../UI/Logo'
import { useRecoilState } from 'recoil'
import { currentWorkSpaceState } from '../../store/EditorAtoms'
import Avvvatars from 'avvvatars-react'
import { LoadingOverlay } from '@mantine/core'
import { Toaster } from 'react-hot-toast'

export interface IWorkspace {
  id: string
  name: string
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, isActive: false },
  { name: 'Projects', href: '/projects', icon: FolderIcon, isActive: false },
  { name: 'Templates', href: '/templates', icon: CalendarIcon, isActive: false },
  { name: 'Settings', href: '/settings/organization', icon: InboxIcon, isActive: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }: any) {
  const router = useRouter()
  const { supabaseClient } = useSessionContext()
  const user = useUser() as User

  const [sidebarOpen, setSidebarOpen] = useState(false)
  // const [selectedWorkSpace, setSelectedWorkSpaces] = useState<IWorkspace>()
  const [workSpace, setWorkSpace] = useRecoilState(currentWorkSpaceState)
  const [currentWorkSpace, setCurrentWorkSpace] = useLocalStorage({
    key: 'currentWorkSpace',
    defaultValue: workSpace.id ? workSpace : { id: '', name: '' },
  })

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.push('/login')
  }

  const onWorkspaceChange = (workspace: IWorkspace) => {
    setCurrentWorkSpace(workspace)
    setWorkSpace(workspace)
  }

  const { data: workspaceList, isLoading } = useQuery(
    [QueryKeys.getWorkspaces],
    () => {
      return getAction('workspace') as Promise<{ data: IWorkspace[] }>
    },
    {
      staleTime: 60 * 1000,
      onSuccess(data) {
        // If there is no workspace redirect to boarding
        if (data.data.length === 0) {
          // reset local storage
          setCurrentWorkSpace({ id: '', name: '' })
          return router.push('/boarding')
        }

        // If there is no current workspace, set the first one as current workspace

        if (!currentWorkSpace.name) {
          setCurrentWorkSpace(data.data[0])
          setWorkSpace(data.data[0])
        } else {
          setCurrentWorkSpace(currentWorkSpace)
          setWorkSpace(currentWorkSpace)
        }
      },
      onError(error) {
        // Reset local storage
        setCurrentWorkSpace({ id: '', name: '' })
      },
    }
  )

  return (
    <>
      <div>
        <Toaster />
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <>
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <Logo dark size="sm" />
                    </div>
                    <nav className="mt-5 space-y-1 px-2">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.isActive
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center rounded-lg px-2 py-2 text-base font-medium'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.isActive
                                ? 'text-gray-500'
                                : 'text-gray-400 group-hover:text-gray-500',
                              'mr-4 h-6 w-6 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                    <Link href="/settings/profile" className="group block flex-shrink-0">
                      <div className="flex items-center">
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="avatar"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            {user && user.user_metadata.full_name}
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            View profile
                          </p>
                          <p
                            className="cursor-pointer text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-black group-hover:text-gray-700"
                            onClick={handleLogout}
                          >
                            Logout
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <Logo dark size="sm" />
              </div>
              <Listbox value={workSpace} onChange={onWorkspaceChange}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="mt-4 block px-2 text-sm font-medium text-gray-700">
                      Workspace
                    </Listbox.Label>
                    <div className="relative py-1">
                      <Listbox.Button className="relative w-full cursor-default border-b border-gray-200 bg-white pb-2 pl-2 pr-10 text-left outline-none sm:text-sm">
                        {workSpace && <span className="block truncate">{workSpace.name}</span>}
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {workspaceList &&
                            workspaceList.data.map((space) => (
                              <Listbox.Option
                                key={space.id}
                                className={({ active }) =>
                                  classNames(
                                    active ? 'bg-bfpurple-400 text-white' : 'text-gray-900',
                                    'relative cursor-default select-none py-2 px-4'
                                  )
                                }
                                value={space}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected ? 'font-semibold' : 'font-normal',
                                        'block truncate'
                                      )}
                                    >
                                      {space.name}
                                    </span>
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              <nav className="flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => {
                  item.isActive = item.href.startsWith(router.asPath)
                  return (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={classNames(
                          item.isActive
                            ? 'bg-bfpurple-100 font-medium text-black'
                            : 'hover:bg-bfpurple-50',
                          'group flex items-center rounded-lg px-2 py-2 text-sm'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.isActive
                              ? 'text-bfpurple-900'
                              : 'text-black group-hover:text-bfpurple-500',
                            'mr-3 h-6 w-6 flex-shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex flex-col p-4">
              <div className="flex flex-col space-y-2 text-xs">
                <div>
                  <Link href={'https://help.bannerfans.com'}>
                    <a target="_blank" className="flex">
                      <QuestionMarkCircleIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      Help
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href={'https://help.bannerfans.com'}>
                    <a target="_blank" className="flex">
                      <BellAlertIcon className="mr-2 h-4 w-4" aria-hidden="true" /> {"What's new?"}
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href={'https://help.bannerfans.com'}>
                    <a target="_blank" className="flex">
                      <WifiIcon className="mr-2 h-4 w-4" aria-hidden="true" /> Docs
                    </a>
                  </Link>
                </div>
              </div>
              <span className="my-4 border-t border-gray-100"></span>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">Basic Plan</span>
                  <span className="min-w-[46px] rounded-lg bg-bfpurple-50 px-2 py-1 text-center text-xs font-medium text-bfpurple-600">
                    32/100
                  </span>
                  {/* <span className="min-w-[46px] rounded-lg bg-teal-50 px-2 py-1 text-center text-xs font-medium text-teal-400">
                    25%
                  </span> */}
                </div>
                <div className="my-2 h-1 w-full bg-slate-100">
                  <div className="h-1 rounded bg-bfpurple-600" style={{ width: '25%' }}></div>
                </div>
                <Link href="/billing">
                  <a>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-slate-500 shadow-sm hover:border-gray-300 hover:text-bfpurple-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Upgrade
                    </button>
                  </a>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <Link href="/settings/profile" className="group flex-shrink-0">
                  <div className="flex">
                    {user && user.user_metadata.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src={user.user_metadata.avatar_url}
                        alt="User Profile Picture"
                      />
                    ) : (
                      <Avvvatars size={40} value={user && user.user_metadata.full_name} />
                    )}

                    <div className="ml-3 cursor-pointer">
                      <p className="text-sm font-medium text-black group-hover:text-gray-900">
                        {user && user.user_metadata.full_name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        View profile
                      </p>
                    </div>
                  </div>
                </Link>
                <p
                  className="cursor-pointer text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-black group-hover:text-gray-700"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
          <LoadingOverlay visible={isLoading} overlayBlur={2} />
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="max-w-7xl flex-1">
            <div className="px-10 py-4">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
