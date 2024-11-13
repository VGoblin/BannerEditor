import React, { useState } from 'react'
import Button from '../UI/Button'

type Props = {
  onSave: any
}

const WorkspaceName: React.FC<Props> = ({ onSave }) => {
  const [workspaceName, setWorkspaceName] = useState('')

  return (
    <div className="border border-gray-200 bg-white py-8 px-4 sm:rounded-lg sm:px-10">
      <p className="text-2xl font-medium text-gray-900">
        <h1 className="mb-4 text-2xl font-medium text-gray-900">Workspace Name</h1>
      </p>
      <input
        className="mt-6 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        type="email"
        placeholder="Caglar's WorkSpace"
        value={workspaceName}
        onChange={(e) => {
          setWorkspaceName(e.target.value)
        }}
      />
      <Button
        loading={onSave.isLoading}
        fullWidth
        onClick={() => {
          onSave.mutate(workspaceName)
        }}
        className="mt-4 w-full rounded-lg  border-bfpurple-900 bg-bfpurple-900 py-2 pl-5 pr-5 text-white"
      >
        <span>Let&apos;s Start!</span>
      </Button>
    </div>
  )
}

export default WorkspaceName
