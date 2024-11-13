import type { Canvas, Object, Textbox } from 'fabric/fabric-impl'
import type { Option } from './TextDecoration'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useCanvas } from '../../../../hooks/useCanvas'
import { selectionCountState, objectModifiedState } from '../../../../store/EditorAtoms'

import FontSize from './FontSize'
import FontWeight from './FontWeight'
import TextDecoration from './TextDecoration'
import { Italic, LineThrough, OverLine, UnderLine } from '../UI/Icons'
import TextAlignment from './TextAlignment'
import VerticalAlignment from './VerticalAlignment'
import LineHeight from './LineHeight'
import LetterSpacing from './LetterSpacing'
import FontFamily, { IFontVariant } from './FontFamily'
import { CustomTextbox } from '../../../../utils/fabric/types'

const TextConfigWrapper = () => {
  const { canvas } = useCanvas()
  const selectionCount = useRecoilValue(selectionCountState) as number
  const objectModified = useRecoilValue(objectModifiedState) as number

  const [objectFontSize, setObjectFontSize] = useState(24)
  const [objectFontVariants, setObjectFontVariants] = useState<IFontVariant[]>()
  const [objectFontSelectedVariant, setObjectFontSelectedVariant] = useState<string>('')
  const [objectTextDecoration, setObjectTextDecoration] = useState<Option[]>()
  const [objectTextAlign, setObjectTextAlign] = useState('Left')
  const [objectVerticalAlign, setObjectVerticalAlign] = useState('top')
  const [objectLineHeight, setObjectLineHeight] = useState(1)
  const [objectLetterSpacing, setObjectLetterSpacing] = useState(0)
  const [objectFontFamily, setObjectFontFamily] = useState('')
  const [objectSelectedFontFamily, setObjectSelectedFontFamily] = useState('')

  useEffect(() => {
    if (!('width' in canvas)) return
    const objects = canvas.getActiveObjects() as CustomTextbox[]
    if (objects[0]?.type === 'textbox') {
      const [firstObject] = objects
      const { underline, overline, linethrough, fontStyle, fontSize } = firstObject
      setObjectFontSize(fontSize!)
      setObjectTextAlign(firstObject.textAlign!)
      setObjectVerticalAlign(firstObject.verticalAlign!)
      setObjectLineHeight(firstObject.lineHeight!)
      setObjectLetterSpacing(firstObject.charSpacing!)
      // @ts-ignore
      setObjectFontFamily(firstObject.selectedFontFamily)

      if ('fontVariants' in firstObject) {
        // @ts-ignore
        setObjectFontVariants(firstObject.fontVariants as IFontVariant[])
        // @ts-ignore
        setObjectFontSelectedVariant(firstObject.selectedFontVariant)
        // @ts-ignore
        setObjectSelectedFontFamily(firstObject.selectedFontFamily)
      }

      setObjectTextDecoration([
        { key: 'underline', icon: UnderLine, value: underline! },
        { key: 'overline', icon: OverLine, value: overline! },
        { key: 'linethrough', icon: LineThrough, value: linethrough! },
        { key: 'fontStyle', icon: Italic, value: fontStyle! },
      ])
    }
  }, [selectionCount, objectModified, canvas])

  return (
    <>
      <FontSize objectFontSize={objectFontSize} setObjectFontSize={setObjectFontSize} />
      <TextDecoration
        textDecorationOptions={objectTextDecoration!}
        setTextDecorationOptions={setObjectTextDecoration}
      />
      <TextAlignment textAlign={objectTextAlign} setTextAlign={setObjectTextAlign} />
      <VerticalAlignment
        verticalAlign={objectVerticalAlign}
        setVerticalAlign={setObjectVerticalAlign}
      />
      <LineHeight lineHeight={objectLineHeight} setLineHeight={setObjectLineHeight} />
      <LetterSpacing
        objectLetterSpacing={objectLetterSpacing}
        setLetterSpacing={setObjectLetterSpacing}
      />
      <FontWeight
        objectFontVariants={objectFontVariants!}
        selectedVariant={objectFontSelectedVariant}
        setSelectedVariant={setObjectFontSelectedVariant}
        objectSelectedFontFamily={objectSelectedFontFamily}
      />
      <FontFamily fontFamily={objectFontFamily} setFontFamily={setObjectFontFamily} />
    </>
  )
}

export default TextConfigWrapper
