import React from 'react'

import { useRouter } from 'next/router'

import useImageUpload from '../../../../hooks/useImageUpload'

type Props = {
  imagePreviewURL: string
  setImagePreviewURL: (url: string) => void
}

const ImageReplace: React.FC<Props> = ({ imagePreviewURL, setImagePreviewURL }) => {
  const router = useRouter()
  const { projectId } = router.query

  const { uploadHandler } = useImageUpload()

  return (
    <>
      <div className=" mt-4 flex h-5 w-full justify-between pr-3 text-start text-sm font-semibold">
        <span>Image</span>
        <label htmlFor="small-toggle" className="relative  inline-flex cursor-pointer items-center">
          <button
            className="cursor-pointer rounded-md bg-primary py-1 px-2 text-sm  font-semibold hover:bg-primary"
            onClick={() => uploadHandler(projectId as string)}
          >
            Image Replace
            <input
              // ref={uploadInputRef}
              // type="file"
              id="image-input"
              className="hidden"
              // onChange={uploadImageHandler}
              // onClick={() => uploadHandler(projectId as string)}
            />
          </button>
        </label>
      </div>
      {/* Uploaded image preview */}
      {imagePreviewURL && (
        <div className="bg-slate-100 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreviewURL} alt="preview" className="mx-auto block max-h-32" />
        </div>
      )}
    </>
  )
}

export default ImageReplace
