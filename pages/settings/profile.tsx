import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Switch } from '@headlessui/react'
import { useSessionContext, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import { Title } from '@mantine/core'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Profile() {
  const { session, supabaseClient } = useSessionContext()
  const user = useUser()

  const [availableToHire, setAvailableToHire] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (user && user.user_metadata.full_name) setUserName(user?.user_metadata.full_name)
  }, [user])

  /**
   *  If user input lenght zero return the function
   * Update user via supabaseClient
   * For invalidate User context call setSession methed with current session object
   */
  const onChangeUserName = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userName.trim()) return

    try {
      const { error, data } = await supabaseClient.auth.updateUser({
        data: { full_name: userName },
      })
      supabaseClient.auth.setSession(session!)
      if (!data || error) {
        throw new Error('User update failed!')
        // ! Should show toast
        // ! Should throw Sentry request
      }
    } catch (error) {}
  }

  return (
    <>
      <Head>
        <title>Bannerfans | Settings</title>
      </Head>
      <Layout>
        <Title order={1} size="h4" mb={16} weight={500} pb={18} className="border-b">
          Profile
        </Title>
        <div className="space-y-6">
          <form
            className="max-w-lg rounded border border-gray-200 sm:rounded-lg"
            onSubmit={onChangeUserName}
          >
            <h2 className="p-6 text-lg">Your account credentials</h2>
            <div className="mb-6 space-y-6 px-6">
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
                  The account name is:
                </label>
                <div className="mt-1">
                  <input
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    name="projectName"
                    id="project-name"
                    className="block w-full rounded-md border border-gray-300 p-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    value={userName}
                    placeholder="Enter an user name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
                  The account email is:
                </label>
                <div className="mt-1 font-semibold sm:text-sm">{user?.email}</div>
              </div>
            </div>
            <div className="overflow-hidden rounded-b-lg bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-bfpurple-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-bfpurple-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </form>

          {/* Updates */}
          <div className="max-w-lg rounded border border-gray-200 sm:rounded-lg">
            <h2 className="p-6 text-lg">Newsletter</h2>
            <ul role="list" className="mb-6 divide-y divide-gray-200 px-6">
              <Switch.Group as="li" className="flex items-center justify-between py-4">
                <div className="flex flex-col">
                  <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                    Software updates
                  </Switch.Label>
                  <Switch.Description className="text-sm text-gray-500">
                    Keep up to date with updates on the project
                  </Switch.Description>
                </div>
                <Switch
                  checked={availableToHire}
                  onChange={setAvailableToHire}
                  className={classNames(
                    availableToHire ? 'bg-bfpurple-500' : 'bg-gray-200',
                    'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      availableToHire ? 'translate-x-5' : 'translate-x-0',
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </Switch.Group>
              <Switch.Group as="li" className="flex items-center justify-between py-4">
                <div className="flex flex-col">
                  <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                    New Templates
                  </Switch.Label>
                  <Switch.Description className="text-sm text-gray-500">
                    Keep up to date with new templates on the Bannerfans
                  </Switch.Description>
                </div>
                <Switch
                  checked={privateAccount}
                  onChange={setPrivateAccount}
                  className={classNames(
                    privateAccount ? 'bg-bfpurple-500' : 'bg-gray-200',
                    'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      privateAccount ? 'translate-x-5' : 'translate-x-0',
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </Switch.Group>
            </ul>
            <div className="overflow-hidden rounded-b-lg bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-bfpurple-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-bfpurple-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>

          {/* Account Delete */}
          <div className="max-w-lg rounded border border-gray-200 sm:rounded-lg">
            <h2 className="p-6 text-lg">Delete my account</h2>
            <div className="mb-6 space-y-4 px-6">
              <p className="text-sm">
                If you do this, all your bannerfans data removed from our system{' '}
                <strong>forever</strong>.
              </p>
              <div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                  className="mt-4 text-sm text-red-600"
                >
                  <span>Delete my account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
