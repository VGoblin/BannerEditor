import React from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { useState } from 'react'
import JobList from '../../components/Boarding/JobList'
import IntegrationList from '../../components/Boarding/IntegrationList'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postAction } from '../../settings/axiosConfig'
import WorkspaceName from '../../components/Boarding/WorkspaceName'

import { useRouter } from 'next/router'
import { QueryKeys } from '../../settings/constants'
import { useRecoilState } from 'recoil'
import { useLocalStorage } from '@mantine/hooks'

export interface IOption {
  id: number
  title: string
  description: string
}

export default function Boarding() {
  const router = useRouter()
  const { supabaseClient } = useSessionContext()
  const queryClient = useQueryClient()
  const userCtx = useSessionContext()

  const [selectedjob, setSelectedjob] = useState<IOption>()
  const [selectedintegrationLists, setSelectedintegrationLists] = useState<string[]>([])
  const [scene, setScene] = useState(0)

  const [currentWorkSpace, setCurrentWorkSpace] = useLocalStorage({
    key: 'currentWorkSpace',
    defaultValue: { id: '', name: '' },
  })

  const onSaveJob = async (e: any) => {
    e.preventDefault()

    const { error } = await supabaseClient.auth.updateUser({
      data: { job: selectedjob?.title },
    })
    if (!error) {
      setScene(1)
      return showNotification({
        message: 'Profile updated',
        color: 'green',
      })
    } else {
      return showNotification({
        message: 'Something went wrong',
        color: 'red',
      })
    }
  }

  const onSaveIntegration = async (e: any) => {
    e.preventDefault()
    const integrationString = selectedintegrationLists.join(', ')
    const { error } = await supabaseClient.auth.updateUser({
      data: { integrations: integrationString },
    })
    if (!error) {
      setScene(2)
      return showNotification({
        message: 'Profile updated',
        color: 'green',
      })
    } else {
      return showNotification({
        message: 'Something went wrong',
        color: 'red',
      })
    }
  }

  const createWorkSpaceMutation = useMutation(
    async (name) => {
      return await postAction('workspace', { name })
    },
    {
      onSuccess: (data) => {
        //  Update current workspace
        setCurrentWorkSpace(data!.data)
        queryClient.invalidateQueries([QueryKeys.getWorkspaces])
        router.push('/dashboard')
      },
      onError: (error) => {
        showNotification({
          message: 'Something went wrong',
          color: 'red',
        })
      },
    }
  )

  const show = () => {
    if (scene == 0)
      return (
        <JobList selectedJob={selectedjob!} setSelectedJob={setSelectedjob} onSave={onSaveJob} />
      )
    if (scene == 1)
      return (
        <IntegrationList
          selectedintegrationLists={selectedintegrationLists}
          setSelectedintegrationLists={setSelectedintegrationLists}
          onSave={onSaveIntegration}
          desc
        />
      )
    if (scene == 2) return <WorkspaceName onSave={createWorkSpaceMutation} />
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Bannerfans | Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="px-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="h-36 w-auto"
          src="/images/bannerfans-logo.svg"
          height={60}
          width={200}
          layout="responsive"
          alt="bannerfans logo"
        />
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">{show()}</div>
    </div>
  )
}
