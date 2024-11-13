import React from 'react'
import { IOption } from '../../pages/boarding'
import Button from '../UI/Button'
import Option from './Option'

type Props = {
  selectedJob: IOption
  setSelectedJob: (option: IOption) => void
  onSave: (e: any) => void
}

const JobList: React.FC<Props> = ({ selectedJob, setSelectedJob, onSave }) => {
  return (
    <div className="flex w-full flex-1 flex-col border border-gray-200 bg-white py-8 px-4 sm:rounded-lg sm:px-10">
      <h1 className="mb-4 text-2xl font-medium text-gray-900">
        What kind of work do you do mainly?
      </h1>
      <div className="flex flex-col gap-4">
        {jobLists.map((job) => {
          return (
            <Option
              key={job.id}
              option={job}
              active={selectedJob?.id === job.id}
              onChange={() => setSelectedJob(job)}
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

export default JobList

const jobLists: IOption[] = [
  { id: 1, title: 'Marketer', description: 'Last message sent an hour ago' },
  {
    id: 2,
    title: 'Designer',
    description: 'Last message sent 2 weeks ago',
  },
  { id: 3, title: 'Developer', description: 'Last message sent 4 days ago' },
  {
    id: 4,
    title: 'Entreprenuer',
    description: 'Last message sent 4 days ago',
  },
  { id: 5, title: 'Other', description: 'Last message sent 4 days ago' },
]
