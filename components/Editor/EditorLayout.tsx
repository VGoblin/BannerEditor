import React from 'react'
import CanvasWrapper from './Canvas'
import Zoom from './Configuration/CanvasConfig/Zoom'
import Configuration from './Configuration/Configuration'
import ControlWrapper from './ControlBar/ControlWrapper'
import Header from './Header/Header'

const EditorLayout: React.FC = () => {
  return (
    <div>
      <Header />

      <CanvasWrapper />
      <Zoom />
      <Configuration />
      <ControlWrapper />
    </div>
  )
}

export default EditorLayout
