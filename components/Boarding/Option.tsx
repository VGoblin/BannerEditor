import { CheckCircleIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { IOption } from '../../pages/boarding'

type Props = {
  option: IOption
  active: boolean
  onChange: (a: any) => void
  desc?: boolean
}

const Option: React.FC<Props> = ({ option, active, onChange, desc }) => {
  return (
    <div
      key={option.id}
      className={`flex cursor-pointer items-center justify-between rounded-md border-2  p-4 ${
        active ? 'border-blue-500' : 'border-gray-200'
      }`}
      onClick={onChange}
    >
      <div>
        <h3 className="block text-sm font-medium text-gray-900">{option.title}</h3>
        {desc && (
          <p className="mt-1 flex items-center text-sm text-gray-500">{option.description}</p>
        )}
      </div>
      {active && <CheckCircleIcon className="h-5 w-5  text-[#2563eb]" aria-hidden="true" />}
    </div>
  )
}

export default Option
