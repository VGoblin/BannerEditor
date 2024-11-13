import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import Layers from './Layers'

import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Formats from './Formats'
import { useCanvas } from '../../../hooks/useCanvas'

const tabStyle = (selected: boolean) =>
  `rounded-20 rounded-b-none px-3 pb-2 pt-3 outline-none ${selected && 'bg-white text-black'}`

const ControlWrapper: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(1)
  return (
    <aside className="absolute top-36 left-4" tabIndex={-1}>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex justify-start font-semibold text-[#505050]" tabIndex={-1}>
          <Tab className={tabStyle(selectedIndex === 0)}>Layers</Tab>
          <Tab className={tabStyle(selectedIndex === 1)}>Formats</Tab>
        </Tab.List>
        <Tab.Panels
          tabIndex={-1}
          className={`scrollbar-hidden max-h-[calc(100vh-6rem)] min-h-[10vh] w-[300px] overflow-auto rounded-20  bg-white p-4 [box-shadow:_10px_10px_15px_-3px_rgba(0,_0,_0,_0.1)] ${
            selectedIndex === 0 && 'rounded-tl-none'
          }`}
        >
          <Tab.Panel>
            <DndProvider backend={HTML5Backend}>
              <Layers />
            </DndProvider>
          </Tab.Panel>
          <Tab.Panel>
            <Formats />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </aside>
  )
}

export default ControlWrapper
