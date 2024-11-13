import type { Banner } from '../../../pages/projects'
import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Component, Image, Record, Star, Text, ChartCircle, MinusSquare } from 'iconsax-react'
import { generateTextbox, generateTextbox2 } from '../../../utils/fabric/text'
import { generateRectangle } from '../../../utils/fabric/rectangle'
import { generateImage } from '../../../utils/fabric/image'
import { generateDonut } from '../../../utils/fabric/donut'
import { generateCircle } from '../../../utils/fabric/circle'
import { generateButton } from '../../../utils/fabric/button'
import { fontStyles, isSyncModeState } from '../../../store/EditorAtoms'
import { useCanvas } from '../../../hooks/useCanvas'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../../../settings/constants'
import { v4 as uuidv4 } from 'uuid'
import { generateSVG } from '../../../utils/fabric/svg'
import useImageUpload from '../../../hooks/useImageUpload'

const ElementList: React.FC = () => {
  const router = useRouter()
  const { frame } = useCanvas()
  const [_, setFontStyles] = useRecoilState(fontStyles)
  const [isSyncMode, setIsSyncMode] = useRecoilState(isSyncModeState)
  const queryClient = useQueryClient()
  const { projectId } = router.query
  const { uploadHandler } = useImageUpload()

  const list = useMemo(
    () => [
      {
        key: 'Image',
        title: 'Image',
        icon: Image,
        handler: () => {
          const uuid = uuidv4()
          // Image Event Listener created
          generateImage({ uuid })
          if (isSyncMode) {
            queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
              const banners = [...prevVal.data.banners] as Banner[]
              const result = banners.map((banner: Banner) => {
                const parsedJSON = JSON.parse(banner.json)
                generateImage({
                  returnJSON: true,
                  uuid,
                  width: banner.width / 2,
                  height: banner.height / 2,
                }).then((imageJSON) => {
                  parsedJSON.objects.push(imageJSON)
                  banner.json = JSON.stringify(parsedJSON)
                })
                return banner
              })

              return { ...prevVal, data: { ...prevVal.data, banners: result } }
            })
          }
          uploadHandler(projectId as string);
        },
      },
      // {
      //   key: 'TextBox',
      //   title: 'Text',
      //   icon: Text,
      //   handler: () => {
      //     setFontStyles([])
      //     generateTextbox({})
      //     const uuid = uuidv4()
      //     if (isSyncMode) {
      //       queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
      //         const banners = [...prevVal.data.banners] as Banner[]
      //         const result = banners.map((banner: Banner) => {
      //           const parsedJSON = JSON.parse(banner.json)
      //           const textJSON = generateTextbox({
      //             fontSize: banner.height / 10,
      //             returnJSON: true,
      //             uuid,
      //           })
      //           parsedJSON.objects.push(textJSON)
      //           banner.json = JSON.stringify(parsedJSON)
      //           return banner
      //         })

      //         return { ...prevVal, data: { ...prevVal.data, banners: result } }
      //       })
      //     }
      //   },
      // },
      {
        key: 'TextBox',
        title: 'Text',
        icon: Text,
        handler: () => {
          setFontStyles([])
          generateTextbox({})
          const uuid = uuidv4()
          if (isSyncMode) {
            queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
              const banners = [...prevVal.data.banners] as Banner[]
              const result = banners.map((banner: Banner) => {
                const parsedJSON = JSON.parse(banner.json)
                const textJSON = generateTextbox({
                  fontSize: banner.height / 10,
                  returnJSON: true,
                  uuid,
                })
                parsedJSON.objects.push(textJSON)
                banner.json = JSON.stringify(parsedJSON)
                return banner
              })

              return { ...prevVal, data: { ...prevVal.data, banners: result } }
            })
          }
        },
      },
      {
        key: 'Ellipse',
        title: 'Ellipse',
        icon: Record,
        handler: () => {
          generateCircle({
            radius: frame?.height! / 5,
          })

          const uuid = uuidv4()
          if (isSyncMode) {
            queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
              const banners = [...prevVal.data.banners] as Banner[]
              const result = banners.map((banner: Banner) => {
                const parsedJSON = JSON.parse(banner.json)
                const ellipseJSON = generateCircle({
                  radius: banner.height / 5,
                  returnJSON: true,
                  uuid,
                })
                parsedJSON.objects.push(ellipseJSON)
                banner.json = JSON.stringify(parsedJSON)
                return banner
              })

              return { ...prevVal, data: { ...prevVal.data, banners: result } }
            })
          }
        },
      },
      {
        key: 'Donut',
        title: 'Donut',
        icon: ChartCircle,
        handler: () => {
          generateDonut({
            radius: frame?.height! / 5,
            strokeWidth: frame?.height! / 25,
          })
          const uuid = uuidv4()

          if (isSyncMode) {
            queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
              const banners = [...prevVal.data.banners] as Banner[]
              const result = banners.map((banner: Banner) => {
                const parsedJSON = JSON.parse(banner.json)
                const donutJSON = generateDonut({
                  radius: banner.height / 5,
                  strokeWidth: banner.height / 25,
                  returnJSON: true,
                  uuid,
                })
                parsedJSON.objects.push(donutJSON)
                banner.json = JSON.stringify(parsedJSON)
                return banner
              })

              return { ...prevVal, data: { ...prevVal.data, banners: result } }
            })
          }
        },
      },
      {
        key: 'Rectangle',
        title: 'Rectangle',
        icon: Component,
        handler: () => {
          const uuid = uuidv4()
          generateRectangle({
            width: frame?.width! / 5,
            height: frame?.height! / 5,
            uuid: uuid,
          })
          if (isSyncMode) {
            queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
              const banners = [...prevVal.data.banners] as Banner[]
              const result = banners.map((banner: Banner) => {
                const parsedJSON = JSON.parse(banner.json)
                const rectJSON = generateRectangle({
                  width: banner.width / 5,
                  height: banner.height! / 5,
                  returnJSON: true,
                  uuid: uuid,
                })
                parsedJSON.objects.push(rectJSON)
                banner.json = JSON.stringify(parsedJSON)
                return banner
              })

              return { ...prevVal, data: { ...prevVal.data, banners: result } }
            })
          }
        },
      },
      {
        key: 'Button',
        title: 'Button',
        icon: MinusSquare,
        handler: () => {
          generateButton({})
          const uuid = uuidv4()
          if (isSyncMode) {
            queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
              const banners = [...prevVal.data.banners] as Banner[]
              const result = banners.map((banner: Banner) => {
                const parsedJSON = JSON.parse(banner.json)
                const buttonJSON = generateButton({
                  uuid,
                  returnJSON: true,
                  width: banner.width / 5,
                  height: banner.height / 20,
                })
                parsedJSON.objects.push(buttonJSON)
                banner.json = JSON.stringify(parsedJSON)
                return banner
              })

              return { ...prevVal, data: { ...prevVal.data, banners: result } }
            })
          }
        },
      },
    ],
    [isSyncMode, queryClient, projectId, setFontStyles, frame?.height, frame?.width, frame]
  )

  return (
    <ul className="ml-16 flex gap-4 text-white">
      {list.map((item) => {
        return (
          <li
            key={item.key}
            onClick={item.handler}
            className="flex cursor-pointer flex-col items-center justify-between space-y-[2px] text-xs"
          >
            <item.icon
              size="18"
              color="#ffffff"
              className={item.key === 'Rectangle' ? 'rotate-45' : ''}
            />
            <span>{item.title}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default ElementList
