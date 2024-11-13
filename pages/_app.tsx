import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { RouterTransition } from '../components/UI/RouterTransition'
import { QueryKeys } from '../settings/constants'
import { getAction } from '../settings/axiosConfig'
import { useRouter } from 'next/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: 1500,
      refetchOnReconnect: false,
      refetchOnMount: false,
      cacheTime: 60 * 60 * 24 * 1000,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  useEffect(() => {
    const getToken = async () => {
      const sessionCtx = await supabaseClient.auth.getSession()
      if (sessionCtx.data.session?.access_token) {
        localStorage.setItem('authToken', sessionCtx.data.session.access_token)
      }
    }
    getToken()
  }, [supabaseClient])

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <MantineProvider
            withCSSVariables
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: 'light',
            }}
          >
            <ModalsProvider>
              <NotificationsProvider>
                <Component {...pageProps} />
                <RouterTransition />
              </NotificationsProvider>
            </ModalsProvider>
          </MantineProvider>
        </SessionContextProvider>
      </RecoilRoot>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}

export default MyApp
