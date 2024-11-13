import type { NextPage } from 'next'
import React, { useEffect } from 'react'
import Layout from '../../components/Layout/index'
import Head from 'next/head'
import Statics from '../../components/Dashboard/statics'
import Usage from '../../components/Dashboard/usage'
import { LoadingOverlay, Title } from '@mantine/core'

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bannerfans | Dashboard</title>
      </Head>
      <Layout>
        <Title order={1} size="h4" mb={16} weight={500} pb={18} className="border-b">
          Dashboard
        </Title>
        <div className="grid  grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="col-span-2">
            <Statics />
          </div>
          <div className="col-span-1">
            <Usage />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Dashboard
