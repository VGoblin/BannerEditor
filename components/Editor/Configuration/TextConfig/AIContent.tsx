import React from 'react'
import Button from '../../../UI/Button'
import { useDisclosure } from '@mantine/hooks'

const AIContent = () => {
  const [opened, handlers] = useDisclosure(false, {
    onOpen: () => {},
    onClose: () => {},
  })
  return (
    <>
      <div
        className=" mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold"
        onClick={() => handlers.toggle()}
      >
        <span>AI Content</span>
        <label
          htmlFor="small-toggle"
          className="pointer-events-none relative  inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id="small-toggle"
            className="peer sr-only"
            checked={opened}
            onChange={() => {}}
          />
          <div className="max-h  peer h-5 w-9 rounded-full border-2 border-black bg-white outline-none ring-0 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-white  after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full  peer-checked:after:border-white peer-focus:outline-none"></div>
        </label>
      </div>

      {opened && (
        <div>
          <textarea
            rows={2}
            placeholder="Prompt"
            className="min-h-[35px] w-full resize-none rounded-md border px-2 py-1 placeholder:text-sm"
          />
          <Button fullWidth>Write</Button>
        </div>
      )}
    </>
  )
}

export default AIContent
