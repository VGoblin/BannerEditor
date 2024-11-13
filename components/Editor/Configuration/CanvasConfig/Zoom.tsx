import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { SearchZoomIn, SearchZoomOut1 } from 'iconsax-react'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useCanvas } from '../../../../hooks/useCanvas'
import { objectModifiedState } from '../../../../store/EditorAtoms'

export interface IZoomLevel {
  name: string
  value: number
}

const Zoom = () => {
  const { canvas, frame } = useCanvas()
  const [currentZoom, setCurrentZoom] = useState(1)
  const objectModified = useRecoilValue(objectModifiedState) as number
  const zoomOptions: IZoomLevel[] = useMemo(
    () => [
      {
        name: 'Fit to Screen',
        get value() {
          // Set zoom to fit the screen by aspect ratio
          if (!frame) return 1
          if (frame?.height! < frame?.width!) return window.innerWidth / frame?.width!
          else return (window.innerHeight - 60) / frame?.height!
        },
      },
      { name: '100%', value: 1 },
      { name: '75%', value: 0.75 },
      { name: '50%', value: 0.5 },
      { name: '25%', value: 0.25 },
    ],
    [frame?.height, frame?.width]
  )
  const [selectedZoom, setSelectedZoom] = useState<IZoomLevel>(zoomOptions[0])

  useEffect(() => {
    if (!canvas.getZoom) return
    setCurrentZoom(canvas?.getZoom()!)
  }, [canvas, objectModified])

  return (
    <div className="scrollbar-hidden absolute top-20 left-4  rounded-20 bg-white p-4 [box-shadow:_10px_10px_15px_-3px_rgba(0,_0,_0,_0.1)] ">
      <Combobox
        value={selectedZoom}
        onChange={(zoomLevel) => {
          // @ts-ignore
          setSelectedZoom(zoomLevel)
          // @ts-ignore
          canvas.zoomToPoint(
            { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            zoomLevel.value
          )
          canvas.fire('object:modified')
        }}
      >
        <div className="flex max-h-5 w-full min-w-[268px] max-w-[268px] items-center justify-between">
          <Combobox.Label className="flex min-w-[90px] items-center gap-2 text-sm text-editorGray">
            Zoom
            <SearchZoomIn
              size="18"
              className="cursor-pointer text-editorGray transition-colors duration-150 hover:text-black"
              onClick={() => {
                canvas.zoomToPoint(
                  { x: window.innerWidth / 2, y: window.innerHeight / 2 },
                  canvas.getZoom() + 0.1
                )
                canvas.fire('object:modified')
              }}
            />
            <SearchZoomOut1
              size="18"
              className="cursor-pointer text-editorGray transition-colors duration-150 hover:text-black"
              onClick={() => {
                canvas.zoomToPoint(
                  { x: window.innerWidth / 2, y: window.innerHeight / 2 },
                  canvas.getZoom() - 0.1
                )
                canvas.fire('object:modified')
              }}
            />
            <span>{Math.round(currentZoom * 100)}%</span>
          </Combobox.Label>
          <div className="relative">
            <div className="relative flex w-full  cursor-default items-center overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2  sm:text-sm">
              <Combobox.Input
                readOnly
                className="w-full max-w-[140px] cursor-default border-none pr-8 text-right text-sm font-bold leading-5 text-gray-900 outline-none focus:ring-0"
                displayValue={() => selectedZoom.name}
                onChange={() => {}}
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
              afterLeave={() => {}}
            >
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {zoomOptions.map((item, i) => (
                  <Combobox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-2 pr-4 text-right ${
                        active ? 'bg-primary ' : 'text-gray-700'
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selectedZoom.name === item.name ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {item.name}
                        </span>
                        {selectedZoom.name === item.name ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </div>
        </div>
      </Combobox>
    </div>
  )
}

export default Zoom
