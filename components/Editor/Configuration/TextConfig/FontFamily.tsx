import type { CustomTextbox } from '../../../../utils/fabric/types'
import React, { useState, useEffect } from 'react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/future/image'
import { useVirtualizer } from '@tanstack/react-virtual'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import { fontData } from '../../../../utils/fonts'
import { loadFonts } from '../../../../utils/helper'
import PropInput from '../UI/PropInput'
import { isSyncModeState } from '../../../../store/EditorAtoms'
import { useRecoilState } from 'recoil'
import { useQueryClient } from '@tanstack/react-query'
import { Banner } from '../../../../pages/projects'
import { QueryKeys } from '../../../../settings/constants'
import { useRouter } from 'next/router'

type Props = {
  fontFamily: string
  setFontFamily: (a: string) => void
}

export interface IFont {
  id: string
  family: string
  full_name: string
  postscript_name: string
  preview: string
  style: string
  url: string
  category: string
  variants: IFontVariant[]
}

export interface IFontVariant {
  name: string
  url: string
}

const FontFamily: React.FC<Props> = ({ fontFamily, setFontFamily }) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const { canvas } = useCanvas()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { projectId } = router.query
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSyncMode, setIsSyncMode] = useRecoilState(isSyncModeState)

  useEffect(() => {
    if (fontFamily) setQuery(fontFamily)
  }, [fontFamily])

  const updateObjectFontFamily = (fontFamily: IFont) => {
    const objects = canvas.getActiveObjects() as CustomTextbox[]
    objects.map((obj) => {
      if (obj.objType === 'button' && obj instanceof fabric.Group) {
        const [btnText] = obj.getObjects('textbox') as CustomTextbox[]
        btnText.set({
          fontFamily: fontFamily.family,
          fontVariants: fontFamily.variants,
          selectedFontFamily: fontFamily.family,
          selectedFontVariant: fontFamily.variants[0]?.name,
        })
        canvas.fire('object:modified')
      } else if (obj) {
        obj.set({
          fontFamily: fontFamily.family,
          fontVariants: fontFamily.variants,
          selectedFontFamily: fontFamily.family,
          selectedFontVariant: fontFamily.variants[0]?.name,
        })
        canvas.fire('object:modified')
        // if sync mode is on, update all other objects
        if (isSyncMode) {
          queryClient.setQueryData([QueryKeys.getProjectById, projectId], (prevVal: any) => {
            const result = prevVal.data.banners.map((banner: Banner) => {
              const parsedJson = JSON.parse(banner.json)
              parsedJson.objects.map((o: CustomTextbox) => {
                if (o.id === obj.id || o.name === obj.name) {
                  o.fontFamily = fontFamily.family
                  o.fontVariants = fontFamily.variants
                  o.selectedFontFamily = fontFamily.family
                  o.selectedFontVariant = fontFamily.variants[0]?.name
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
    canvas.requestRenderAll()
  }

  const filteredData =
    query === ''
      ? Object.keys(fontData)
      : Object.keys(fontData).filter((fontName) =>
          fontName
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  const loadFontHandler = async (fontString: string) => {
    // @ts-ignore
    const foundedFont = fontData[fontString] as IFont
    // setFontStyles(fontData.variants)
    await loadFonts([{ name: foundedFont.family, url: foundedFont.url }, ...foundedFont.variants])
    setFontFamily(foundedFont.family)
    updateObjectFontFamily(foundedFont)
  }

  const rowVirtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 28,
  })

  return (
    <>
      <PropInput
        type="text"
        id="fontFamily"
        label="Font Family"
        name="fontFamily"
        value={query}
        className={`pr-2 transition-all duration-200 ${isExpanded ? '' : '!-mb-4'}`}
        inputClassName="w-28"
        handler={(e) => {
          setIsExpanded(true)
          setQuery(e.target.value)
        }}
        suffix={
          <ChevronUpDownIcon
            className="h-5 w-5 cursor-pointer text-gray-400"
            aria-hidden="true"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        }
      />

      <div
        ref={parentRef}
        className={`max-h-40 overflow-x-auto  rounded transition-all duration-200 ease-in-out ${
          isExpanded ? '!mt-1 border border-slate-200' : ''
        }`}
        style={{
          maxHeight: isExpanded ? '200px' : '0px',
          minHeight: isExpanded ? '200px' : '0px',
        }}
      >
        <ul
          className="relative w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {filteredData.length > 0 &&
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              // @ts-ignore
              const foundedData = fontData[filteredData[virtualRow.index]] as IFont
              const shouldRender = (fontName: string): boolean => {
                return fontName
                  .toLowerCase()
                  .replace(/\s+/g, '')
                  .includes(query.toLowerCase().replace(/\s+/g, ''))
              }
              return (
                <li
                  key={foundedData.id}
                  className="absolute top-0 left-0 flex w-full cursor-pointer items-center rounded px-1 hover:bg-primary"
                  style={{
                    height: shouldRender(foundedData.family) ? `${virtualRow.size}px` : '0px',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  onClick={() => {
                    loadFontHandler(foundedData.family)
                    setIsExpanded(false)
                    setQuery(foundedData.family)
                  }}
                >
                  <Image
                    src={foundedData.preview}
                    alt="font preview"
                    width={232}
                    height={27}
                    placeholder="empty"
                  />
                </li>
              )
            })}
        </ul>
      </div>
    </>
  )
}
export default FontFamily
