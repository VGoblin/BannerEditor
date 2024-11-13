import { useLocalStorage } from '@mantine/hooks'
import React from 'react'
import Layout from '../../components/Layout'
import Head from 'next/head'
import Team from '../../components/Settings/Organization/Team'
import { Title } from '@mantine/core'
import API from '../../components/Settings/Organization/Api'

export default function Organization() {
  const [currentWorkSpace, setCurrentWorkSpace] = useLocalStorage({
    key: 'currentWorkSpace',
    defaultValue: { id: '', name: '' },
  })

  return (
    <>
      <Head>
        <title>Bannerfans | Settings</title>
      </Head>
      <Layout>
        <Title order={1} size="h4" mb={16} weight={500} pb={18} className="border-b">
          {`${currentWorkSpace.name}'s settings`}
        </Title>
        <div className="space-y-6">
          <Team />
          <API />

          {/* Account Delete */}
          {/* <div className="max-w-lg rounded border border-gray-200 sm:rounded-lg">
            <h2 className="p-6 text-lg">Delete organization</h2>
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
                  <span>Delete organization</span>
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </Layout>
    </>
  )
}
