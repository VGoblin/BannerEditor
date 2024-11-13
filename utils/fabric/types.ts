import { IObjectFit } from 'fabricjs-object-fit'

import {
  Canvas,
  Group,
  ICircleOptions,
  IImageOptions,
  ObjectFit,
  Textbox,
} from 'fabric/fabric-impl'
import { IFont, IFontVariant } from '../../components/Editor/Configuration/TextConfig/FontFamily'

export interface CustomObject extends fabric.Object {
  id?: string
  show: () => void
  hide: () => void
  beforeHideOpacityValue: number
  objType: string
  hasBgPattern?: boolean
}
export interface CustomRect extends fabric.Rect {
  id?: string
  show: () => void
  hide: () => void
  beforeHideOpacityValue: number
  objType: string
}
export interface CustomCirle extends ICircleOptions {
  id?: string
  show: () => void
  hide: () => void
  beforeHideOpacityValue: number
  objType: string
}
export interface CustomTextbox extends Textbox {
  id?: string
  show: () => void
  hide: () => void
  beforeHideOpacityValue: number
  fontVariants: IFontVariant[] | []
  selectedFontVariant: string
  selectedFontFamily: string
  autoResize: boolean
  objType: string
  verticalAlign: 'top' | 'middle' | 'bottom'
}

export interface CustomGroup extends Group {
  id?: string
  show: () => void
  hide: () => void
  beforeHideOpacityValue: number
  getObjects: (type?: string) => [CustomRect, CustomTextbox]
  gradientDirection: 'horizontal' | 'vertical' | 'cross'
  objType: string
  hasBgPattern?: boolean
}
export interface CustomImage extends fabric.Image, ObjectFit {
  id?: string
  show: () => void
  hide: () => void
  beforeHideOpacityValue: number
  imageFitting: 'contain' | 'cover'
  getElement: () => HTMLImageElement
  objType: string
  setObject: (obj: fabric.Image) => void
  recompute: () => void
  maskType: string
  mode: 'cover' | 'contain'
  hasImage: boolean
}

export interface CustomCanvas extends Canvas {
  isDragging?: boolean
  lastPosX?: number
  lastPosY?: number
}

interface IRenderIcon {
  icon: HTMLImageElement
  type: 'circle' | 'rectV' | 'rectH'
  object: fabric.Object
}

export interface IShadowValues {
  offsetX: number
  offsetY: number
  blur: number
  color: string
}

interface IRenderIcon {
  icon: HTMLImageElement
  type: 'circle' | 'rectV' | 'rectH'
  object: fabric.Object
}

export interface IShadowValues {
  offsetX: number
  offsetY: number
  blur: number
  color: string
}

export interface IGenerateImageProps {
  src?: string
  top?: number
  left?: number
  width?: number
  height?: number
  angle?: number
  opacity?: number
  maskType?: string
  shadow?: fabric.Shadow
  mode?: 'cover' | 'contain'
  returnJSON?: boolean
  uuid?: string
  name?: string
  hasImage?: boolean
}

export interface ISmartImage extends IObjectFit {
  id?: string
  verticalAlign?: string
  horizontalAlign?: string
  hasImage?: boolean
  maskProperties?: {
    radius?: number
  }
  maskType?: string
  objType?: string
  updateMask?: () => void
}
