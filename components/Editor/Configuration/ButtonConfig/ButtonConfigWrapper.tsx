import type { CustomGroup, IShadowValues } from '../../../../utils/fabric/types'
import type { Gradient } from 'fabric/fabric-impl'
import React, { useEffect, useState } from 'react'
import { fabric } from 'fabric'
import { useCanvas } from '../../../../hooks/useCanvas'
import { useRecoilValue } from 'recoil'
import { selectionCountState, objectModifiedState } from '../../../../store/EditorAtoms'
import ButtonTextColor from './ButtonTextColor'
import TextAlignment from '../TextConfig/TextAlignment'
import FontFamily, { IFontVariant } from '../TextConfig/FontFamily'
import FontWeight from '../TextConfig/FontWeight'
import LetterSpacing from '../TextConfig/LetterSpacing'
import FontSize from '../TextConfig/FontSize'
import Opacity from '../Opacity'
import GroupTitle from '../UI/GroupTitle'
import ButtonContainerColor from './ButtonContainerColor'
import ButtonContainerRadius from './ButtonContainerRadius'
import ButtonStroke from './ButtonStroke'
import { IBorderValues } from '../Configuration'
import BoxShadow from '../BoxShadow'
import BGPattern from '../BGPattern'
import ButtonGradient, { GradientDirection } from './ButtonGradient'
import { Textarea } from '@mantine/core'
import ButtonTextarea from './ButtonTextarea'

const ButtonConfigWrapper: React.FC = () => {
  const { canvas } = useCanvas()
  const selectionCount = useRecoilValue(selectionCountState) as number
  const objectModified = useRecoilValue(objectModifiedState) as number

  const [btnText, setBtnText] = useState('')
  const [btnTextColor, setBtnTextColor] = useState('')
  const [btnTextAlign, setBtnTextAlign] = useState('')
  const [btnTextFontVariants, setBtnTextFontVariants] = useState<IFontVariant[]>()
  const [btnTextFontSelectedVariant, setBtnTextFontSelectedVariant] = useState('')
  const [btnTextFontSelectedFontFamily, setBtnTextFontSelectedFamily] = useState('')
  const [btnTextLetterSpacing, setBtnTextLetterSpacing] = useState(0)
  const [btnTextFontSize, setBtnTextFontSize] = useState(24)
  const [btnTextOpacity, setBtnTextOpacity] = useState(0)

  const [btnContainerColor, setBtnContainerColor] = useState('')
  const [btnContainerOpacity, setBtnContainerOpacity] = useState(0)
  const [btnContainerRadius, setBtnContainerRadius] = useState(0)

  const [btnStroke, setBtnStroke] = useState<IBorderValues>()
  const [btnShadow, setBtnShadow] = useState<IShadowValues>()
  const [btnGradient, setBtnGradient] = useState<Gradient>()
  const [btnGradientFirstColor, setBtnGradientFirstColor] = useState('')
  const [btnGradientSecondColor, setBtnGradientSecondColor] = useState('')
  const [btnGradientDirection, setBtnGradientDirection] = useState<GradientDirection>('horizontal')
  // const [btnHasBgPattern, setBtnHasBgPatter] = useState(false)

  useEffect(() => {
    if (!canvas) return
    const button = canvas.getActiveObject() as CustomGroup
    if (button && button.objType !== 'button') return
    const [btnContainer, btnText] = button?.getObjects()

    setBtnText(btnText?.get('text') as string)
    setBtnTextAlign(btnText.textAlign!)
    setBtnTextFontVariants(btnText.fontVariants as IFontVariant[])
    setBtnTextFontSelectedVariant(btnText.selectedFontVariant)
    setBtnTextFontSelectedFamily(btnText.selectedFontFamily)
    if (btnText.charSpacing) setBtnTextLetterSpacing(btnText.charSpacing)
    if (btnText.fontSize) setBtnTextFontSize(btnText.fontSize)
    if (btnText.opacity) setBtnTextOpacity(btnText.opacity)
    if (typeof btnText.fill === 'string') setBtnTextColor(btnText.fill)

    if (typeof btnContainer.fill === 'string') setBtnContainerColor(btnContainer.fill)
    if (btnContainer.opacity) setBtnContainerOpacity(btnContainer.opacity)
    if (btnContainer.rx) setBtnContainerRadius(btnContainer.rx)

    setBtnStroke(
      btnContainer.strokeWidth !== 0
        ? {
            color: btnContainer.stroke!,
            width: btnContainer.strokeWidth!,
          }
        : undefined
    )
    setBtnShadow(button.shadow as IShadowValues)

    if (btnContainer.fill instanceof fabric.Gradient) {
      const [{ color: firstColor }, { color: secondColor }] = btnContainer.fill.colorStops as {
        color: string
      }[]
      setBtnGradient(btnContainer.fill)
      setBtnGradientFirstColor(firstColor)
      setBtnGradientSecondColor(secondColor)
      setBtnGradientDirection(button.gradientDirection)
    }
  }, [selectionCount, objectModified, canvas])

  return (
    <>
      <ButtonTextarea btnText={btnText} setBtnText={setBtnText} />
      <FontFamily
        fontFamily={btnTextFontSelectedFontFamily}
        setFontFamily={setBtnTextFontSelectedFamily}
      />
      <FontWeight
        objectFontVariants={btnTextFontVariants!}
        selectedVariant={btnTextFontSelectedVariant}
        setSelectedVariant={setBtnTextFontSelectedVariant}
        objectSelectedFontFamily={btnTextFontSelectedFontFamily}
      />
      <FontSize objectFontSize={btnTextFontSize} setObjectFontSize={setBtnTextFontSize} />
      <TextAlignment textAlign={btnTextAlign} setTextAlign={setBtnTextAlign} />
      <ButtonTextColor buttonTextColor={btnTextColor} setButtonTextColor={setBtnTextColor} />
      <LetterSpacing
        objectLetterSpacing={btnTextLetterSpacing}
        setLetterSpacing={setBtnTextLetterSpacing}
      />
      <Opacity objectOpacity={btnTextOpacity} setObjectOpacity={setBtnTextOpacity} />
      <GroupTitle title="Background" />
      <ButtonContainerColor
        containerColor={btnContainerColor}
        setContainerColor={setBtnContainerColor}
      />
      <Opacity
        objectOpacity={btnContainerOpacity}
        setObjectOpacity={setBtnContainerOpacity}
        target="rect"
      />
      <ButtonContainerRadius
        objectRadius={btnContainerRadius}
        setObjectRadius={setBtnContainerRadius}
        label="Corner Radius"
      />
      <ButtonStroke objectBorderValues={btnStroke} setObjectBorderValues={setBtnStroke} />

      <BoxShadow
        objectShadowValues={btnShadow!}
        setObjectShadowValues={setBtnShadow}
        title="Shadow"
      />

      {/* <BGPattern objectHasBGPattern={btnHasBgPattern} setObjectHasBGPattern={setBtnHasBgPatter} /> */}
      <ButtonGradient
        btnGradient={btnGradient!}
        setBtnGradient={setBtnGradient}
        firstColor={btnGradientFirstColor}
        setFirstColor={setBtnGradientFirstColor}
        secondColor={btnGradientSecondColor}
        setSecondColor={setBtnGradientSecondColor}
        btnGradientDirection={btnGradientDirection}
        setBtnGradientDirection={setBtnGradientDirection}
      />
    </>
  )
}

export default ButtonConfigWrapper
