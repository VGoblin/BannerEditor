import { Popover, Text, Tooltip } from '@mantine/core'

import React, { ReactNode } from 'react'
import Button from './Button'

type Props = {
  disabled: boolean
  onClick: () => void
  text: string
  btnText: string
  icon: ReactNode
}

const Confirm: React.FC<Props> = ({ disabled, onClick, text, btnText, icon }) => {
  return (
    <Popover width={200} withArrow shadow="md" disabled={disabled}>
      <Popover.Target>
        <Tooltip label="Delete">{icon}</Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size={'sm'} mb={8} className="text-center">
          {text}
        </Text>
        <Button fullWidth className="bg-red-500 hover:!bg-red-600" onClick={onClick}>
          {btnText}
        </Button>
      </Popover.Dropdown>
    </Popover>
  )
}

export default Confirm
