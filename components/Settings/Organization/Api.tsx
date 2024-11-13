import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import Avvvatars from 'avvvatars-react'
import { useLocalStorage } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../../../settings/constants'
import { getAction, postAction } from '../../../settings/axiosConfig'
import {
  Badge,
  CopyButton,
  LoadingOverlay,
  PasswordInput,
  Popover,
  Text,
  Tooltip,
} from '@mantine/core'
import { Copy, Crown1, UserRemove } from 'iconsax-react'
import { useUser } from '@supabase/auth-helpers-react'
import { showNotification } from '@mantine/notifications'
import Button from '../../UI/Button'
import Confirm from '../../UI/Confirm'
import toast from 'react-hot-toast'

type Props = {}

export interface ITeamMember {
  id: string
  email: string
  fullname: string
  isActive: boolean
  isOwner?: boolean
}

const API = (props: Props) => {
  const user = useUser()
  const queryClient = useQueryClient()
  const [inviteMail, setInviteMail] = useState('')
  const [currentWorkSpace, setCurrentWorkSpace] = useLocalStorage({
    key: 'currentWorkSpace',
    defaultValue: { id: '', name: '', ownerId: '' },
  })

  const { data, isLoading, isFetching } = useQuery(
    [QueryKeys.getTeamMembers, currentWorkSpace.id],
    () => {
      return getAction(`workspace/${currentWorkSpace.id}`) as Promise<{ data: ITeamMember[] }>
    },
    {
      enabled: !!currentWorkSpace.id,
    }
  )

  // const onDismissTeamMember = useMutation(
  //   (userId: string) => {
  //     return postAction(`workspace/${currentWorkSpace.id}/dismiss`, {
  //       userId,
  //     })
  //   },
  //   {
  //     onSuccess() {
  //       queryClient.invalidateQueries([QueryKeys.getTeamMembers, currentWorkSpace.id])
  //     },
  //   }
  // )

  // const onInviteTeamMember = useMutation(
  //   (email: string) => {
  //     return postAction(`workspace/${currentWorkSpace.id}/invite`, {
  //       email,
  //     })
  //   },
  //   {
  //     onSuccess() {
  //       setIsPopoverDisable(false)
  //       queryClient.invalidateQueries([QueryKeys.getTeamMembers, currentWorkSpace.id])
  //     },
  //   }
  // )

  // const onInviteTeamMemberHandler = () => {
  //   // ! Email validation
  //   if (!inviteMail.trim() || /^\S+@\S+$/.test(inviteMail) === false) {
  //     return showNotification({
  //       message: 'Please enter a valid email',
  //       color: 'red',
  //     })
  //   }
  //   const alreadyExist = data?.data.find((member) => member.id === inviteMail)
  //   if (alreadyExist) {
  //     return showNotification({
  //       message: 'This email already exist in your workspace',
  //       color: 'red',
  //     })
  //   }
  //   onInviteTeamMember.mutate(inviteMail)

  //   setInviteMail('')
  // }

  // const onDissmissTeamMemberHandler = (userId: string) => {
  //   setIsPopoverDisable(true)
  //   onDismissTeamMember.mutate(userId)
  // }

  return (
    <div className="relative max-w-lg rounded border border-gray-200 sm:rounded-lg">
      <h2 className="p-6 text-lg">API Keys</h2>
      <div className="space-y-2 px-6 pb-6">
        <div className="space-y-1">
          <div className="flex items-end ">
            <PasswordInput
              placeholder="api-key"
              label="API Key"
              defaultValue={'bfk_aisjdbfapisjdbf-iajbdspfiajbds'}
              className="mr-2 block w-full rounded-md shadow-sm sm:text-sm"
            />
            <CopyButton value="https://mantine.dev">
              {({ copied, copy }) => (
                <Button
                  ghost
                  onClick={() => {
                    copy()
                    toast.success('Copied!')
                  }}
                >
                  <Copy size="14" color={copied ? '#000000' : '#858e96'} />
                </Button>
              )}
            </CopyButton>
          </div>
        </div>

        <LoadingOverlay visible={isFetching} />
      </div>
    </div>
  )
}

export default API
