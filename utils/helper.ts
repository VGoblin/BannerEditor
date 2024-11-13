import type { ColorResult } from 'react-color'

/**
 * It takes a ColorResult object and returns a hex value with alpha canal
 * @param {ColorResult} color - ColorResult
 * @returns A string
 */
export const rgbToHex = (color: ColorResult): string => {
  return color.hex + Math.round(color.rgb.a! * 255).toString(16)
}

/**
 * It takes an array of objects with a name and url property, and returns a promise that resolves when
 * all the fonts have been loaded
 * @param {{ name: string; url: string }[]} fonts - { name: string; url: string }[]
 * @returns A function that takes an array of objects with name and url properties and returns a
 * promise that resolves when all the fonts have been loaded.
 */
export const loadFonts = async (fonts: { name: string; url: string }[]) => {
  // Create a new Promise List
  const promisesList = fonts.map((font) => {
    return new FontFace(font.name, `url(${font.url})`).load().catch((err) => err)
  })
  // Wait for all the fonts to load
  return Promise.all(promisesList)
    .then((res) => {
      res.forEach((uniqueFont) => {
        if (uniqueFont && uniqueFont.family) {
          // Add the font to the document
          document.fonts.add(uniqueFont)
        }
      })
    })
    .catch((err) => console.log({ err }))
}

/**
 * It replaces all the spaces with underscores, then replaces all the Turkish characters with their
 * English counterparts, then removes all the non-alphanumeric characters
 * @param {string} name - The name of the product.
 * @returns A function that takes a string and returns a string.
 */
export const sluggify = (name: string): string => {
  const result = name
    .replace(/\s/g, '-')
    .replace(/(ç)/g, 'c')
    .replace(/(Ç)/g, 'C')
    .replace(/(ş)/g, 's')
    .replace(/(Ş)/g, 'S')
    .replace(/(ü)/g, 'u')
    .replace(/(Ü)/g, 'U')
    .replace(/(ö)/g, 'o')
    .replace(/(Ö)/g, 'O')
    .replace(/(ğ)/g, 'g')
    .replace(/(Ğ)/g, 'G')
    .replace(/(ı)/g, 'i')
    .replace(/(İ)/g, 'I')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/[^\w\s]/gi, '-')
  return result
}

/**
 * If the value is greater than 360, return 360. If the value is less than 0, return 0. Otherwise,
 * return the value rounded to the nearest integer.
 * @param {number} value - number - the value that is being passed in from the input
 * @returns A function that takes a number and returns a number.
 */
export const circleInputValidation = (value: number): number => {
  let intValue: number
  // If the value is greater than 360, return 360.
  if (value > 360) intValue = 360
  // If the value is less than 0, return 0.
  else if (value < 0) intValue = 0
  // Otherwise, return the value rounded to the nearest integer.
  else intValue = Math.round(value)
  return intValue
}

export const toJSONProperties = [
  'name',
  'id',
  'hasControls',
  'hoverCursor',
  'selectable',
  'clipPath',
  'gradientDirection',
  'objType',
  'maskType',
  'clipPath',
  'autoResize',
  'selectedFontFamily',
  'selectedFontVariant',
  'fontVariants',
  'charSpacing',
  'isWrapping',
  'gradientDirection',
  'shouldCache',
  'src',
  'enableRecomputeOnScaled',
  'enableRecomputeOnScaling',
  'mode',
  'originY',
  'originX',
  'position',
  'container',
  'boundingRect',
  'filters',
  'recompute',
  'useObjectTransform',
  'dirty',
  'shadow',
  'scaleX',
  'scaleY',
  'objectCaching',
  'clearRect',
  'isCacheDirty',
  'zoom',
  'hasBgPattern',
  'rx',
  'ry',
  'hasImage',
  'zoom',
  'scaleX',
  'scaleY',
  'height',
  'width',
]

/**
 * It returns a JSON object of the given element, with the given properties
 * @param {fabric.Object | fabric.Canvas} element - fabric.Object | fabric.Canvas
 * @param [stringfy=false] - If true, the function will return a stringified JSON object.
 * There is no need for to objects
 * Default is false.
 */
export const getJSON = (element: fabric.Object | fabric.Canvas, stringfy = false) => {
  const json = element.toJSON(toJSONProperties)
  if (stringfy) return JSON.stringify(json)
  return json
}

/**
 * If the frame's height is less than its width, return the window's width divided by the frame's
 * width, otherwise return the window's height minus 60 divided by the frame's height.
 * @param frame - fabric.Rect - the frame of the image
 * @returns The zoom level of the canvas.
 */
export const calculateZoom = (frame: fabric.Rect) => {
  if (!frame) return 1
  if (frame?.height! < frame?.width!) return window.innerWidth / frame?.width!
  else return (window.innerHeight - 60) / frame?.height!
}

export const isBase64 = (str: string) => {
  // check string is base64 image url or not
  if (str.startsWith('data:image')) return true
  return false
}
