import React, { useEffect, useState } from 'react'
// import { useUser } from '@supabase/supabase-auth-helpers/react'
// import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import Router, { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { Google } from 'iconsax-react'
// import { supabaseClient } from '../utils/supabase'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Logo from '../components/UI/Logo'

const LoginPage = () => {
  const user = useUser()
  const router = useRouter()
  const supabaseClient = useSupabaseClient()
  const [email, setEmail] = useState('')
  const [isLoginLoading, setLoginLoading] = useState(false)
  const [isMagicAlertShown, setMagicAlertShown] = useState(false)

  const handleLoginWithMagicLink = async (email: string) => {
    try {
      setLoginLoading(true)
      try {
        const { data, error } = await supabaseClient.auth.signInWithOtp({
          email,
        })
      } catch (error) {
        console.log(error)
      }

      setMagicAlertShown(true)
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      setLoginLoading(false)
    }
  }

  useEffect(() => {
    // ! Find a better way to do this
    if (user) {
      router.push('/dashboard')
    }
  }, [user])

  const handleLoginWithGoogle = async () => {
    try {
      setLoginLoading(true)
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) throw error
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      setLoginLoading(false)
    }
  }

  if (!user)
    return (
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Head>
          <title>Bannerfans | Login</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        {/* {error && <p>{error.message}</p>}
        {isLoading ? <h1>Loading...</h1> : <h1>Loaded!</h1>} */}
        <div className="px-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Logo center dark size="lg" />
          <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border border-gray-200 bg-white py-8 px-4 sm:rounded-lg sm:px-10">
            {isLoginLoading ? (
              'Sending...'
            ) : isMagicAlertShown ? (
              <div className="text-center">
                <span className="font-bold">Check your email!</span>
                <p className="mt-2">
                  We emailed a magic link to <strong>{email}</strong> <br />
                  <span className="text-sm text-gray-500">
                    {' '}
                    click the link in email to sign in{' '}
                  </span>
                </p>
              </div>
            ) : (
              <div>
                <button
                  className="font-roboto w-full rounded-lg bg-gray-100 px-4 py-2 text-center text-sm font-normal text-gray-800 transition duration-100 hover:shadow-lg focus:outline-none md:text-lg"
                  onClick={handleLoginWithGoogle}
                >
                  <span className="flex items-center justify-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="h-5 w-5 text-xs"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png"
                      alt="google_logo"
                    ></img>
                    <span>Continue with Google</span>
                  </span>
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <form className="flex flex-col items-center">
                  <p className="mb-4">Sign in via magic link with your email below</p>
                  <input
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault()
                      handleLoginWithMagicLink(email)
                    }}
                    className="mt-4 w-full rounded-lg  border-bfpurple-900 bg-bfpurple-900 py-2 pl-5 pr-5 text-white"
                  >
                    <span>Send magic link</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    )
}

export default LoginPage
