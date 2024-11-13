import type { CustomObject } from '../../../utils/fabric/types'
import React from 'react'
import type { ColorResult } from 'react-color'
import { rgbToHex } from '../../../utils/helper'
import SkectInput from './UI/SkectInput'
import { useCanvas } from '../../../hooks/useCanvas'
import { useRecoilState } from 'recoil'
import { isSyncModeState } from '../../../store/EditorAtoms'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../../../settings/constants'
import { useRouter } from 'next/router'
import { Banner } from '../../../pages/projects'

type Props = {
  objectFillColor: string | undefined
  setObjectFillColor: (a: string) => void
}

const ColorInput: React.FC<Props> = ({ objectFillColor, setObjectFillColor }) => {
  const router = useRouter()
  const { canvas } = useCanvas()
  const { projectId } = router.query
  const queryClient = useQueryClient()

  const [isSyncMode, setIsSyncMode] = useRecoilState(isSyncModeState)

  const onFillColorChangeHandler = (color: ColorResult) => {
    setObjectFillColor(rgbToHex(color))
    const objects = canvas?.getActiveObjects() as CustomObject[]

    objects?.map((obj) => {
      if (obj.hasBgPattern) {
        // When BgPattern created we adding to current object type's an endWith flag
        obj.set({ backgroundColor: rgbToHex(color) })
      } else if (obj.fill) {
        obj.set({
          fill: rgbToHex(color),
          dirty: true,
        })

        // If sync mode is active we need to change all objects with same type
        if (isSyncMode) {
          queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
            const result = prevVal.data.banners.map((banner: Banner) => {
              const parsedJson = JSON.parse(banner.json)
              parsedJson.objects.map((o: CustomObject) => {
                if (o.id === obj.id || o.name === obj.name) {
                  o.fill = rgbToHex(color)
                }
              })
              banner.json = JSON.stringify(parsedJson)
              return banner
            })
            return { ...prevVal, data: { ...prevVal.data, banners: result } }
          })
        }
      }
    })
    canvas?.requestRenderAll()
  }

  return (
    <div className="my-4 w-full">
      <SkectInput defaultColor={objectFillColor} handler={onFillColorChangeHandler} label="Color" />
    </div>
  )
}

export default ColorInput
