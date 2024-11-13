import React, { useState } from 'react'
import { Anchor, Box, Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import { User, useUser } from '@supabase/auth-helpers-react'
import { useMutation } from '@tanstack/react-query'
import { getAction } from '../../settings/axiosConfig'
type Props = {
  name: string
  onCustomerPortal: Function
}

const PlanCard: React.FC<Props> = ({ name, onCustomerPortal }: Props) => {
  const [isLoading, setLoading] = useState(false)
  const user = useUser()
  if (!user) return null

  return (
    <Container bg="#ffffff" p={0} size={600} mt={65} className="rounded-lg border text-gray-800">
      <Box>
        <Stack p={24}>
          <Text size={'lg'}>Your Plan</Text>
          <Text size={'lg'} weight={'bold'}>
            {name}
          </Text>
        </Stack>
        <Group bg={'#c2c2c2'} p={24} className="rounded-b-lg" position="apart">
          <Text size={'sm'}>Manage your subscription on Stripe.</Text>
          <Button
            color="dark"
            size={'sm'}
            loading={isLoading}
            onClick={() => {
              setLoading(true)
              onCustomerPortal()
            }}
          >
            Open customer portal
          </Button>
        </Group>
      </Box>
    </Container>
  )
}

export default PlanCard
