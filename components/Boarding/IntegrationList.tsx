import React from 'react'
import { IOption } from '../../pages/boarding'
import Button from '../UI/Button'
import Option from './Option'

type Props = {
  selectedintegrationLists: string[]
  setSelectedintegrationLists: (a: string[]) => void
  onSave: (e: any) => void
  desc?: boolean
}

const IntegrationList: React.FC<Props> = ({
  selectedintegrationLists,
  setSelectedintegrationLists,
  onSave,
  desc,
}) => {
  return (
    <div className="flex w-full flex-1 flex-col border border-gray-200 bg-white py-8 px-4 sm:rounded-lg sm:px-10">
      <h1 className="mb-4 text-2xl font-medium text-gray-900">
        Which method to generate images in bulk?
      </h1>
      <div className="flex flex-col gap-4">
        {integrationLists.map((item) => {
          const isActive = selectedintegrationLists.includes(item.title)
          return (
            <Option
              desc
              key={item.id}
              option={item}
              active={isActive}
              onChange={() => {
                if (isActive) {
                  // @ts-ignore
                  setSelectedintegrationLists((prevVal) => {
                    return [...prevVal.filter((i: string) => i !== item.title)]
                  })
                } else {
                  // @ts-ignore
                  setSelectedintegrationLists((prevVal) => {
                    return [...prevVal, item.title]
                  })
                }
              }}
            />
          )
        })}
      </div>
      <Button
        fullWidth
        onClick={onSave}
        className="mt-4 w-full rounded-lg  border-bfpurple-900 bg-bfpurple-900 py-2 pl-5 pr-5 text-white"
      >
        <span>Send</span>
      </Button>
    </div>
  )
}

export default IntegrationList

const integrationLists = [
  { id: 1, title: 'Make.com', description: 'Integrate with make.com (formerly integromat)' },
  {
    id: 2,
    title: 'Rest API',
    description: 'Integrate with your code',
  },
  { id: 3, title: 'URL to Image', description: 'Have URL with props' },
  {
    id: 4,
    title: 'Form to Image',
    description: 'Get form according to your template',
  },
  { id: 5, title: 'I have no idea', description: 'I will decide later' },
]
