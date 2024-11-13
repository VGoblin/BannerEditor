import React, { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'
import PlanCard from './PlanCard'
import Layout from '../Layout'
import { Title } from '@mantine/core'
import Script from 'next/script'
import { useLocalStorage } from '@mantine/hooks'
import { getAction } from '../../settings/axiosConfig'
import { useMutation, useQuery } from '@tanstack/react-query'

type Props = {}

const tiers = [
  // {
  //   name: 'Free',
  //   href: '#',
  //   priceId: '',
  //   priceMonthly: 0,
  //   description: 'All the basics for starting a new business',
  //   includedFeatures: ['50 Credits'],
  // },
  {
    name: 'Basic',
    href: '#',
    priceId: 'price_1M9mbLBO461Knf9OoD3Qn0lL',
    priceMonthly: 29,
    description: 'For businesses that are just getting started',
    includedFeatures: ['1000 Credits', 'Live Chat Support', 'Access +300 Templates'],
  },
  {
    name: 'Pro',
    href: '#',
    priceId: 'price_1MA76gBO461Knf9OgSqab8I9',
    priceMonthly: 99,
    description: 'For established businesses that need more',
    includedFeatures: [
      '10.000 Credits',
      'Make.com Integration',
      'Technical Support',
      'Team Availabile',
    ],
  },
  {
    name: 'Expert',
    href: '#',
    priceId: 'price_1MA77FBO461Knf9Oe0G0JQGT',
    priceMonthly: 299,
    description: 'For businesses that need a lot of support',
    includedFeatures: [
      '50.000 Credits',
      'Custom Domain',
      'SSO',
      'Dedicated Success Manager',
      '100% CDN SLA',
      'Advenced Security',
    ],
  },
]

const BillingWrapper: React.FC<Props> = ({}) => {
  const [currentWorkSpace, setCurrentWorkSpace] = useLocalStorage({
    key: 'currentWorkSpace',
    defaultValue: { id: undefined, name: '', ownerId: '' },
  })

  const { data, isLoading } = useQuery(
    [currentWorkSpace.id],
    async () => {
      return getAction(`stripe/status/${currentWorkSpace.id}`) as Promise<{ data: any }>
    },
    {
      cacheTime: 0,
      staleTime: 0,
      // ıf projectId is not defined, do not run the query
      enabled: !!currentWorkSpace.id,
      onSuccess: async (data) => {
        console.log(data)
      },
    }
  )

  const createStripeLink = useMutation(
    async ({ priceId }: { priceId: string }) => {
      return getAction(`stripe/create-checkout-session/${currentWorkSpace.id}?priceId=${priceId}`)
    },
    {
      onSuccess(data: any, variables, context) {
        if (data.data.url) window.location.href = data.data.url
      },
    }
  )

  return (
    <Layout>
      <Title order={1} size="h4" mb={16} weight={500} pb={18} className="border-b">
        Pricing
      </Title>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <PlanCard
            name={
              data?.data?.subscription
                ? tiers.find((t) => t.priceId == data.data?.subscription?.plan?.id)?.name || ''
                : ' Free'
            }
            onCustomerPortal={() => {
              return getAction(`stripe/customer-portal-link/${currentWorkSpace.id}`).then(
                (data: any) => {
                  if (data.data.url) window.location.href = data.data.url
                }
              )
            }}
          />

          <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="p-6">
                  <h2 className="text-lg font-medium leading-6 text-gray-900">{tier.name}</h2>
                  <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      ${tier.priceMonthly}
                    </span>{' '}
                    <span className="text-base font-medium text-gray-500">/mo</span>
                  </p>
                  <button
                    onClick={() => createStripeLink.mutate({ priceId: tier.priceId })}
                    className="mt-8 block w-full rounded-md border border-gray-800 bg-gray-800 py-2 text-center text-sm font-semibold text-white hover:bg-gray-900"
                  >
                    Buy {tier.name}
                  </button>
                </div>
                <div className="px-6 pt-6 pb-8">
                  <h3 className="text-sm font-medium text-gray-900">What&apos;s included</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {tier.includedFeatures.map((feature) => (
                      <li key={feature} className="flex space-x-3">
                        <CheckIcon
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BillingWrapper
