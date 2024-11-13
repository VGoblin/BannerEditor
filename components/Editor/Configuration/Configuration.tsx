import type { CustomImage, CustomObject, IShadowValues } from '../../../utils/fabric/types'
import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { useRecoilValue } from 'recoil'
import { selectionCountState, objectModifiedState } from '../../../store/EditorAtoms'
import { useCanvas } from '../../../hooks/useCanvas'
import { renderIcon } from './UI/Icons'
import { More } from 'iconsax-react'
// Components
import MeasurementInput from './MeasurementInput'
import ColorInput from './FillBackground'
import Coordinates from './Coordinates'
import Angle from './Angle'
import Skews from './Skews'
import Opacity from './Opacity'
import Radius from './Radius'
import Border from './Border'
import TextConfigWrapper from './TextConfig/TextConfigWrapper'
import BoxShadow from './BoxShadow'
import GroupTitle from './UI/GroupTitle'
import BGPattern from './BGPattern'
import AIContent from './TextConfig/AIContent'
import AutoResize from './TextConfig/AutoResize'
import Background from './TextConfig/Background'
import Donut from './EllipseConfig/Donut'
import StartEndAngles from './EllipseConfig/StartEndAngles'
import CanvasConfigWrapper from './CanvasConfig/CanvasConfigWrapper'
import ImageFitting from './ImageConfig/ImageFitting'
import HorizontalAlignment from './ImageConfig/HorizontalAlignment'
import VerticalAlignment from './ImageConfig/VerticalAlignment'
import Mask from './ImageConfig/Mask'
import ImageGenerator from './ImageConfig/ImageGenerator'
import ImageReplace from './ImageConfig/ImageReplace'
import EllipseSize from './EllipseConfig/EllipseSize'
import ButtonConfigWrapper from './ButtonConfig/ButtonConfigWrapper'

export interface IObjectBoundRect {
  left: number
  top: number
  width: number
  height: number
}

interface IPropType {
  key: string
  // @ts-ignore
  component: React.FC<T>
  props?: any
}

export interface ISkewValues {
  skewX: number
  skewY: number
}

export interface IBorderValues {
  color: string
  width: number
}

export interface IObjectSize {
  width: number
  height: number
}

export interface IEllipseAngle {
  start: number
  end: number
}

export type InputNames = 'offsetX' | 'offsetY' | 'blur'

const Configuration: React.FC = () => {
  const { canvas, frame } = useCanvas()
  const selectionCount = useRecoilValue(selectionCountState) as number
  const objectModified = useRecoilValue(objectModifiedState) as number

  const [objectBoundingRect, setObjectBoundingRect] = useState<IObjectBoundRect>()
  const [objectSize, setObjectSize] = useState<IObjectSize>()
  const [ellipseRadius, setEllipseRadius] = useState(0)
  const [selectedObjectInfo, setSelectedObjectInfo] = useState({ name: '', type: '' })
  const [objectFillColor, setObjectFillColor] = useState<string>()
  const [objectAngle, setObjectAngle] = useState(0)
  const [skewValues, setSkewValues] = useState<ISkewValues>()
  const [objectOpacity, setObjectOpacity] = useState(0)
  const [objectRadius, setObjectRadius] = useState(0)
  const [objectBorderValues, setObjectBorderValues] = useState<IBorderValues>()
  const [objectShadowValues, setObjectShadowValues] = useState<IShadowValues>()
  const [ellipseAngles, setEllipseAngles] = useState<IEllipseAngle>()
  const [imageFitting, setImageFitting] = useState<'contain' | 'cover'>('contain')
  const [horizontalAlign, setHorizontalAlign] = useState<'left' | 'center' | 'right'>('left')
  const [verticalAlign, setVerticalAlign] = useState<'top' | 'middle' | 'bottom'>('top')
  const [imagePreviewURL, setImagePreviewURL] = useState<string>()
  const [imageMaskType, setImageMaskType] = useState<'circle' | 'rectangle' | string | undefined>(
    'circle'
  )
  const [objectAutoResize, setObjectAutoResize] = useState(true)
  const [objectHasBGPattern, setObjectHasBGPattern] = useState(false)
  const [textBackgroundColor, setTextBackgroundColor] = useState('')
  useEffect(() => {
    if (!('width' in canvas)) return
    if (!frame || !frame.left) return
    const objects = canvas?.getActiveObjects()
    if (objects && objects[0] && objects[0].group) {
      setObjectBoundingRect(objects[0].group?.getBoundingRect())
    } else if (objects && objects[0]) {
      const [firstObject] = objects as CustomObject[]

      const {
        name,
        type,
        fill,
        opacity,
        angle,
        skewX,
        skewY,
        strokeWidth,
        backgroundColor,
        objType,
      } = firstObject

      setSelectedObjectInfo({ name: name!, type: objType! })

      // setObjectBoundingRect(firstObject?.getBoundingRect())

      setObjectBoundingRect({
        ...firstObject.getBoundingRect(),
        left: frame!.left! + firstObject.left! - frame!.left!,
        top: frame!.top! + firstObject.top! - frame!.top!,
      })

      setObjectSize({ width: firstObject.getScaledWidth(), height: firstObject.getScaledHeight() })
      setObjectAngle(angle!)
      setSkewValues({ skewX: skewX!, skewY: skewY! })
      setObjectShadowValues(firstObject.shadow as IShadowValues)
      setObjectOpacity(opacity!)

      // @ts-ignore
      setObjectAutoResize(firstObject.autoResize as boolean)
      // @ts-ignore
      if ('rx' in firstObject) setObjectRadius(firstObject.rx)
      if (firstObject.type === 'group' && firstObject.clipPath) {
        // @ts-ignore
        setObjectRadius(firstObject.clipPath.rx)
      }
      // TextBackgroundColor
      if (firstObject.type === 'textbox' && firstObject instanceof fabric.Textbox) {
        setTextBackgroundColor(firstObject.textBackgroundColor!)
      }

      if (firstObject.hasBgPattern) {
        setObjectHasBGPattern(firstObject.fill instanceof fabric.Pattern)
        setObjectFillColor(firstObject.backgroundColor as string)
      } else {
        setObjectHasBGPattern(false)
        setObjectFillColor(fill as string)
      }

      setObjectBorderValues(
        strokeWidth !== 0
          ? {
              color: firstObject.stroke!,
              width: firstObject.strokeWidth!,
            }
          : undefined
      )
      if (firstObject instanceof fabric.Circle) {
        setEllipseAngles({ start: firstObject.startAngle!, end: firstObject.endAngle! })
      }

      if (firstObject.objType === 'image') {
        // @ts-ignore
        setImageFitting(firstObject.mode)
        setVerticalAlign(firstObject.verticalAlign || "top")
        setHorizontalAlign(firstObject.horizontalAlign || "left")
        // setImagePreviewURL(
        //   firstObject.toDataURL({
        //     // When cdn provided we should improve quality
        //     format: 'png',
        //     quality: 0.3,
        //   })
        // )
        // @ts-ignore
        console.log(firstObject?.maskType)
        // @ts-ignore
        setImageMaskType(firstObject.maskType)
      }

      if (firstObject instanceof fabric.Circle && firstObject.radius) {
        setEllipseRadius(firstObject.radius)
      }
    }
  }, [canvas, objectModified, selectionCount])

  const rectangleProps: IPropType[] = [
    {
      key: 'layout',
      component: GroupTitle,
      props: { title: 'Layout' },
    },
    {
      key: 'Coordinates',
      component: Coordinates,
      props: {
        objectBoundingRect,
        setObjectBoundingRect,
      },
    },
    {
      key: 'MeasurementInput',
      component: MeasurementInput,
      props: {
        objectSize,
        setObjectSize,
      },
    },
    {
      key: 'Rotation',
      component: Angle,
      props: {
        objectAngle,
        setObjectAngle,
      },
    },
    {
      key: 'FillColor',
      component: ColorInput,
      props: {
        objectFillColor,
        setObjectFillColor,
      },
    },
    {
      key: 'Opacity',
      component: Opacity,
      props: {
        objectOpacity,
        setObjectOpacity,
      },
    },
    {
      key: 'Skew',
      component: Skews,
      props: {
        skewValues,
        setSkewValues,
      },
    },
    {
      key: 'Radius',
      component: Radius,
      props: {
        objectRadius,
        setObjectRadius,
      },
    },
    {
      key: 'BGPattern',
      component: BGPattern,
      props: {
        objectHasBGPattern,
        setObjectHasBGPattern,
      },
    },
    {
      key: 'Border',
      component: Border,
      props: {
        objectBorderValues,
        setObjectBorderValues,
      },
    },
    {
      key: 'Shadow',
      component: BoxShadow,
      props: {
        objectShadowValues,
        setObjectShadowValues,
      },
    },
  ]

  const donutProps: IPropType[] = [
    {
      key: 'layout',
      component: GroupTitle,
      props: { title: 'Layout' },
    },
    {
      key: 'Coordinates',
      component: Coordinates,
      props: {
        objectBoundingRect,
        setObjectBoundingRect,
      },
    },
    {
      key: 'Circle Size',
      component: EllipseSize,
      props: {
        ellipseRadius,
        setEllipseRadius,
      },
    },
    {
      key: 'Rotation',
      component: Angle,
      props: {
        objectAngle,
        setObjectAngle,
      },
    },
    {
      key: 'Ellipse',
      component: GroupTitle,
      props: { title: 'Donut' },
    },
    {
      key: 'Donut',
      component: Donut,
      props: {
        objectBorderValues,
        setObjectBorderValues,
      },
    },
    {
      key: 'StartEndAngles',
      component: StartEndAngles,
      props: {
        ellipseAngles,
        setEllipseAngles,
      },
    },
    {
      key: 'Opacity',
      component: Opacity,
      props: {
        objectOpacity,
        setObjectOpacity,
      },
    },
  ]

  const ellipseProps: IPropType[] = [
    {
      key: 'layout',
      component: GroupTitle,
      props: { title: 'Layout' },
    },
    {
      key: 'Coordinates',
      component: Coordinates,
      props: {
        objectBoundingRect,
        setObjectBoundingRect,
      },
    },
    {
      key: 'Circle Size',
      component: EllipseSize,
      props: {
        ellipseRadius,
        setEllipseRadius,
      },
    },
    {
      key: 'Rotation',
      component: Angle,
      props: {
        objectAngle,
        setObjectAngle,
      },
    },
    {
      key: 'Ellipse',
      component: GroupTitle,
      props: { title: 'Ellipse' },
    },
    {
      key: 'FillColor',
      component: ColorInput,
      props: {
        objectFillColor,
        setObjectFillColor,
      },
    },
    {
      key: 'Opacity',
      component: Opacity,
      props: {
        objectOpacity,
        setObjectOpacity,
      },
    },
    {
      key: 'Border',
      component: Border,
      props: {
        objectBorderValues,
        setObjectBorderValues,
      },
    },
    {
      key: 'BGPattern',
      component: BGPattern,
      props: {
        objectHasBGPattern,
        setObjectHasBGPattern,
      },
    },
    {
      key: 'Shadow',
      component: BoxShadow,
      props: {
        objectShadowValues,
        setObjectShadowValues,
      },
    },
  ]

  const textboxProps: IPropType[] = [
    {
      key: 'layout',
      component: GroupTitle,
      props: { title: 'Layout' },
    },
    {
      key: 'Coordinates',
      component: Coordinates,
      props: {
        objectBoundingRect,
        setObjectBoundingRect,
      },
    },
    {
      key: 'MeasurementInput',
      component: MeasurementInput,
      props: {
        objectSize,
        setObjectSize,
      },
    },
    {
      key: 'Rotation',
      component: Angle,
      props: {
        objectAngle,
        setObjectAngle,
      },
    },
    {
      key: 'Text',
      component: GroupTitle,
      props: { title: 'Text' },
    },
    {
      key: 'FillColor',
      component: ColorInput,
      props: {
        objectFillColor,
        setObjectFillColor,
      },
    },
    {
      key: 'TextWrapper',
      component: TextConfigWrapper,
    },
    {
      key: 'Opacity',
      component: Opacity,
      props: {
        objectOpacity,
        setObjectOpacity,
      },
    },
    // {
    //   key: 'AIContent',
    //   component: AIContent,
    // },
    {
      key: 'Shadow',
      component: BoxShadow,
      props: {
        objectShadowValues,
        setObjectShadowValues,
      },
    },
    {
      key: 'AutoResize',
      component: AutoResize,
      props: {
        objectAutoResize,
        setObjectAutoResize,
      },
    },
    {
      key: 'Background',
      component: Background,
      props: {
        textBackgroundColor,
        setTextBackgroundColor,
      },
    },
    {
      key: 'Border',
      component: Border,
      props: {
        objectBorderValues,
        setObjectBorderValues,
      },
    },
  ]

  const imageProps: IPropType[] = [
    {
      key: 'layout',
      component: GroupTitle,
      props: { title: 'Layout' },
    },
    {
      key: 'Coordinates',
      component: Coordinates,
      props: {
        objectBoundingRect,
        setObjectBoundingRect,
      },
    },
    {
      key: 'MeasurementInput',
      component: MeasurementInput,
      props: {
        objectSize,
        setObjectSize,
      },
    },
    {
      key: 'Rotation',
      component: Angle,
      props: {
        objectAngle,
        setObjectAngle,
      },
    },

    {
      key: 'Opacity',
      component: Opacity,
      props: {
        objectOpacity,
        setObjectOpacity,
      },
    },
    {
      key: 'ImageFitting',
      component: ImageFitting,
      props: {
        imageFitting,
        setImageFitting,
      },
    },
    {
      key: 'HorizontalAlignment',
      component: HorizontalAlignment,
      props: {
        horizontalAlign,
        setHorizontalAlign,
      },
    },
    {
      key: 'VerticalAlignment',
      component: VerticalAlignment,
      props: {
        verticalAlign,
        setVerticalAlign,
      },
    },
    {
      key: 'ImageReplace',
      component: ImageReplace,
      props: {
        imagePreviewURL,
        setImagePreviewURL,
      },
    },
    {
      key: 'Border',
      component: Border,
      props: {
        objectBorderValues,
        setObjectBorderValues,
      },
    },
    {
      key: 'Mask',
      component: Mask,
      props: {
        imageMaskType,
        setImageMaskType,
        objectRadius,
        setObjectRadius,
      },
    },
    {
      key: 'Shadow',
      component: BoxShadow,
      props: {
        objectShadowValues,
        setObjectShadowValues,
      },
    },
    // {
    //   key: 'ImageGenerator',
    //   component: ImageGenerator,
    // },
  ]

  const groupProps: IPropType[] = [
    {
      key: 'layout',
      component: GroupTitle,
      props: { title: 'Layout' },
    },
    {
      key: 'Coordinates',
      component: Coordinates,
      props: {
        objectBoundingRect,
        setObjectBoundingRect,
      },
    },
    {
      key: 'MeasurementInput',
      component: MeasurementInput,
      props: {
        objectSize,
        setObjectSize,
      },
    },
    {
      key: 'Rotation',
      component: Angle,
      props: {
        objectAngle,
        setObjectAngle,
      },
    },
    {
      key: 'Opacity',
      component: Opacity,
      props: {
        objectOpacity,
        setObjectOpacity,
      },
    },
    {
      key: 'Radius',
      component: Radius,
      props: {
        objectRadius,
        setObjectRadius,
      },
    },
  ]

  const buttonProps: IPropType[] = [
    {
      key: 'layout',
      component: GroupTitle,
      props: { title: 'Layout' },
    },
    {
      key: 'Coordinates',
      component: Coordinates,
      props: {
        objectBoundingRect,
        setObjectBoundingRect,
      },
    },
    {
      key: 'MeasurementInput',
      component: MeasurementInput,
      props: {
        objectSize,
        setObjectSize,
      },
    },
    {
      key: 'Rotation',
      component: Angle,
      props: {
        objectAngle,
        setObjectAngle,
      },
    },
    {
      key: 'Button Text',
      component: GroupTitle,
      props: { title: 'Text' },
    },
    {
      key: 'ButtonConfigWrapper',
      component: ButtonConfigWrapper,
    },
  ]

  const svgProps: IPropType[] = [
    {
      key: 'layout',
      component: GroupTitle,
      props: { title: 'Layout' },
    },
    {
      key: 'Coordinates',
      component: Coordinates,
      props: {
        objectBoundingRect,
        setObjectBoundingRect,
      },
    },
    {
      key: 'MeasurementInput',
      component: MeasurementInput,
      props: {
        objectSize,
        setObjectSize,
      },
    },
    {
      key: 'Rotation',
      component: Angle,
      props: {
        objectAngle,
        setObjectAngle,
      },
    },
  ]

  let content: JSX.Element[] = []
  switch (selectedObjectInfo.type) {
    case 'rect':
      content = rectangleProps.map((item) => <item.component key={item.key} {...item.props} />)
      break
    case 'textbox':
      content = textboxProps.map((item) => <item.component key={item.key} {...item.props} />)
      break
    case 'donut':
      content = donutProps.map((item) => <item.component key={item.key} {...item.props} />)
      break
    case 'circle':
      content = ellipseProps.map((item) => <item.component key={item.key} {...item.props} />)
      break
    case 'image':
      content = imageProps.map((item) => <item.component key={item.key} {...item.props} />)
      break
    case 'svg':
      content = svgProps.map((item) => <item.component key={item.key} {...item.props} />)
      break
    case 'button':
      content = buttonProps.map((item) => <item.component key={item.key} {...item.props} />)
      break
    default:
      if (canvas?.width && canvas.getActiveObject()?.type === 'group') {
        content = groupProps.map((item) => <item.component key={item.key} {...item.props} />)
      }
      break
  }

  return (
    <div className="scrollbar-hidden absolute right-4 top-20 max-h-[calc(100vh-6rem)] min-h-[10vh] w-[300px] select-none overflow-auto rounded-20 bg-white [box-shadow:_10px_10px_15px_-3px_rgba(0,_0,_0,_0.1)] ">
      {!!selectionCount && (
        <div className="p-6">
          <header className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2 ">
              {renderIcon(selectedObjectInfo.type)}
              <p className="font-semibold">{selectedObjectInfo.name}</p>
            </div>
            <More size={18} fill="#000000" className="rotate-90 cursor-pointer" />
          </header>
          <hr className="-mx-6" />

          <div className="mt-4 space-y-4">{content.map((item) => item)}</div>
        </div>
      )}
      {!selectionCount && <CanvasConfigWrapper />}
    </div>
  )
}

export default Configuration
