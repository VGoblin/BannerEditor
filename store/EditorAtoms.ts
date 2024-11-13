import { atom } from 'recoil'
import { IFontVariant } from '../components/Editor/Configuration/TextConfig/FontFamily'
import { IWorkspace } from '../components/Layout'

const atomKeys = {
  selectionCountState: 'selectionCountState',
  objectModifiedState: 'objectModifiedState',
  currentObjectCountState: 'currentObjectCountState',
  fontStylesState: 'fontStylesState',
  currentBannerId: 'currentBannerId',
  currentWorkSpaceState: 'currentWorkSpaceState',
  isSyncModeState: 'isSyncModeState',
  EditorZoomState: 'EditorZoomState',
}

export const selectionCountState = atom({
  key: atomKeys.selectionCountState,
  default: 0,
})

export const objectModifiedState = atom({
  key: atomKeys.objectModifiedState,
  default: 0,
})

export const currentObjectCountState = atom({
  key: atomKeys.currentObjectCountState,
  default: 0,
})

export const fontStyles = atom({
  key: atomKeys.fontStylesState,
  default: [] as IFontVariant[],
})

export const currentBannerIdState = atom({
  key: atomKeys.currentBannerId,
  default: '',
})

export const currentWorkSpaceState = atom({
  key: atomKeys.currentWorkSpaceState,
  default: {} as IWorkspace,
})

export const isSyncModeState = atom({
  key: atomKeys.isSyncModeState,
  default: false,
})

export const EditorZoomState = atom({
  key: atomKeys.EditorZoomState,
  default: 1,
})
