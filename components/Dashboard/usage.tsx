import React from 'react'
import Button from '../UI/Button'

const Usage: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-5 sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium leading-5 text-gray-900">Usage</h3>
        <span className="text-xs text-gray-400">Last 15 days</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-black">Image Request</span>
        <span className="min-w-[46px] rounded-lg bg-indigo-50 px-2 py-1 text-center text-xs font-medium text-indigo-400">
          32 of 100
        </span>
      </div>
      <div className="my-2 mb-6 h-4 w-full rounded bg-indigo-50">
        <div className="h-4 rounded bg-indigo-400" style={{ width: '25%' }}></div>
      </div>

      <Button fullWidth>Buy Now</Button>
    </div>
  )
}

export default Usage
