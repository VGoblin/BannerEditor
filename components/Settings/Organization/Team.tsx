import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import Avvvatars from 'avvvatars-react'
import { useLocalStorage } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../../../settings/constants'
import { getAction, postAction } from '../../../settings/axiosConfig'
import { Badge, LoadingOverlay, Popover, Skeleton, Text, Tooltip } from '@mantine/core'
import { Crown1, UserRemove } from 'iconsax-react'
import { useUser } from '@supabase/auth-helpers-react'
import { showNotification } from '@mantine/notifications'
import Button from '../../UI/Button'
import Confirm from '../../UI/Confirm'

type Props = {}

export interface ITeamMember {
  id: string
  email: string
  fullname: string
  isActive: boolean
  isOwner?: boolean
}

const Team = (props: Props) => {
  const user = useUser()
  const queryClient = useQueryClient()
  const [inviteMail, setInviteMail] = useState('')
  const [isPopoverDisable, setIsPopoverDisable] = useState(false)
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

  const onDismissTeamMember = useMutation(
    (userId: string) => {
      return postAction(`workspace/${currentWorkSpace.id}/dismiss`, {
        userId,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([QueryKeys.getTeamMembers, currentWorkSpace.id])
      },
    }
  )

  const onInviteTeamMember = useMutation(
    (email: string) => {
      return postAction(`workspace/${currentWorkSpace.id}/invite`, {
        email,
      })
    },
    {
      onSuccess() {
        setIsPopoverDisable(false)
        queryClient.invalidateQueries([QueryKeys.getTeamMembers, currentWorkSpace.id])
      },
    }
  )

  const onInviteTeamMemberHandler = () => {
    // ! Email validation
    if (!inviteMail.trim() || /^\S+@\S+$/.test(inviteMail) === false) {
      return showNotification({
        message: 'Please enter a valid email',
        color: 'red',
      })
    }
    const alreadyExist = data?.data.find((member) => member.id === inviteMail)
    if (alreadyExist) {
      return showNotification({
        message: 'This email already exist in your workspace',
        color: 'red',
      })
    }
    onInviteTeamMember.mutate(inviteMail)

    setInviteMail('')
  }

  const onDissmissTeamMemberHandler = (userId: string) => {
    setIsPopoverDisable(true)
    onDismissTeamMember.mutate(userId)
  }

  return (
    <div className="relative max-w-lg rounded border border-gray-200 sm:rounded-lg">
      <h2 className="p-6 text-lg">Team</h2>
      <div className="space-y-2 px-6 pb-6">
        <div className="space-y-1">
          <label htmlFor="add-team-members" className="block text-sm font-medium text-gray-700">
            Add Team Member
          </label>
          <p id="add-team-members-helper" className="sr-only">
            Search by email address
          </p>
          <div className="flex">
            <div className="flex-grow">
              <input
                value={inviteMail}
                onChange={(e) => setInviteMail(e.target.value)}
                type="text"
                name="add-team-members"
                id="add-team-members"
                className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-bfpurple-500 focus:ring-bfpurple-500 sm:text-sm"
                placeholder="Email address"
                aria-describedby="add-team-members-helper"
              />
            </div>
            <span className="ml-3">
              <Button onClick={onInviteTeamMemberHandler} ghost>
                Add
              </Button>
            </span>
          </div>
        </div>

        <div className="relative border-b border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {(isLoading || isFetching) && (
              <li key={'loader'} className={`flex w-full items-center justify-between p-4`}>
                <div className="flex w-full">
                  <Skeleton height={40} circle mb="xl" />
                  <div className="ml-3 flex-1">
                    <Skeleton height={8} mt={6} width="20%" radius="xl" />
                    <Skeleton height={8} mt={6} width="50%" radius="xl" />
                  </div>
                </div>
              </li>
            )}
            {data &&
              data.data.map((member) => {
                return (
                  <li
                    key={member.id}
                    className={`flex items-center justify-between p-4 ${
                      member.id === user?.id ? 'bg-bfpurple-50' : ''
                    }`}
                  >
                    <div className="flex">
                      <Avvvatars size={40} value={member.email} />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{member.fullname}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                        {!member.isActive && <Badge>Pending</Badge>}
                      </div>
                    </div>
                    {member.isOwner ? (
                      <Tooltip label="Owner">
                        <Crown1 size="24" color="#e35b3f" className={`mr-4 cursor-pointer`} />
                      </Tooltip>
                    ) : (
                      currentWorkSpace.ownerId === user?.id && (
                        <Confirm
                          btnText="Delete"
                          disabled={isPopoverDisable || isFetching}
                          icon={
                            <UserRemove size="24" color="#e35b3f" className="mr-4 cursor-pointer" />
                          }
                          onClick={() => {
                            onDissmissTeamMemberHandler(member.id)
                          }}
                          text="Are you sure you want to delete this user?"
                        />
                      )
                    )}
                  </li>
                )
              })}
          </ul>
        </div>
        {data && (
          <p className="align-right text-right text-xs text-gray-400">{`${data.data.length} Member`}</p>
        )}
      </div>

      <LoadingOverlay visible={onDismissTeamMember.isLoading || onInviteTeamMember.isLoading} />
    </div>
  )
}

export default Team
