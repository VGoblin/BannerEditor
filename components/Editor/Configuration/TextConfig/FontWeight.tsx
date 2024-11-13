import type { CustomTextbox } from '../../../../utils/fabric/types'
import React, { useState, Fragment, useEffect } from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox, Transition } from '@headlessui/react'
import { IFontVariant } from './FontFamily'

type Props = {
  objectFontVariants: IFontVariant[]
  selectedVariant: string
  setSelectedVariant: (a: string) => void
  objectSelectedFontFamily: string
}

const FontWeight: React.FC<Props> = ({
  objectFontVariants,
  selectedVariant,
  setSelectedVariant,
  objectSelectedFontFamily,
}) => {
  const { canvas } = useCanvas()
  const [query, setQuery] = useState('')

  const regExp = new RegExp(objectSelectedFontFamily, 'i')

  const filteredList =
    query === ''
      ? objectFontVariants
      : objectFontVariants.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {}, [objectFontVariants])

  const onChangeHandler = (fontName: string) => {
    const fontData = objectFontVariants.find((item) => item.name === fontName)

    const objects = canvas?.getActiveObjects() as CustomTextbox[]
    if (objects && fontData) {
      setSelectedVariant(fontName)
      objects.map((obj) => {
        if (obj.objType === 'button' && obj instanceof fabric.Group) {
          obj.getObjects('textbox')[0].set({
            // @ts-ignore
            fontFamily: fontData.name,
            selectedFontVariant: fontData.name,
          })
        } else {
          obj.set({
            fontFamily: fontData.name,
            // @ts-ignore
            selectedFontVariant: fontData.name,
          })
        }
      })
    }
    canvas?.requestRenderAll()
  }
  if (!objectFontVariants || objectFontVariants.length === 0) return null
  return (
    <>
      <Combobox value={selectedVariant.replace(regExp, '')} onChange={onChangeHandler}>
        <div className="flex max-h-5 items-center">
          <Combobox.Label className="min-w-[90px] text-sm text-editorGray">Style</Combobox.Label>
          <div className="relative">
            <div className="relative flex w-full cursor-default items-center overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2  sm:text-sm">
              <Combobox.Input
                className="w-full border-none pr-8 text-right text-sm font-bold leading-5 text-gray-900 outline-none focus:ring-0"
                displayValue={(font: string) => font}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredList.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredList.map((item, i) => (
                    <Combobox.Option
                      key={i}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-2 pr-4 text-right ${
                          active ? 'bg-primary ' : 'text-gray-700'
                        }`
                      }
                      value={item.name}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                          >
                            {item.name.replace(regExp, '')}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </div>
      </Combobox>
    </>
  )
}

export default FontWeight
