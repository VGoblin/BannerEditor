import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { getCanvasInstance } from './fabric'
import { setup } from 'fabricjs-object-fit'
import { getJSON, rgbToHex } from '../helper'
import { IGenerateImageProps, ISmartImage } from './Iimage'
const { ObjectFit } = setup(fabric)
/**
 * It creates a fabric.Image object, wraps it in an ObjectFit object, and adds it to the canvas
 */
export const generateImage = async ({
  src,
  top,
  left,
  mode,
  width,
  height,
  angle,
  opacity,
  maskType,
  shadow,
  returnJSON = false,
  uuid,
  name = 'Image',
  hasImage = false,
}: IGenerateImageProps) => {
  
  const canvas = getCanvasInstance()
  const img: Awaited<Promise<fabric.Image>> = await new Promise((resolve) => {
    if (src) return fabric.Image.fromURL(src, resolve)
    return fabric.Image.fromURL('/images/preview.png', resolve)
  })

  const container: ISmartImage = new ObjectFit(img, {
    width: width || img.getScaledWidth(),
    height: height || img.getScaledHeight(),
    mode: mode ? mode : 'contain',
    enableRecomputeOnScaled: true,
    enableRecomputeOnScaling: true,
    useObjectTransform: true,
  })

  if (shadow) container.shadow = shadow

  container.angle = angle || 0

  container.object.clipPath = new fabric.Rect({
    width: width || img.getScaledWidth(),
    height: height || img.getScaledHeight(),
    originX: 'center',
    originY: 'center',
    name: 'Mask',
    rx: 0,
    ry: 0,
    objectCaching: false,
    noScaleCache: true,
    dirty: false,
    selectable: true,
  })

  container.id = uuid ? uuid : uuidv4()
  container.hasImage = hasImage || false
  container.maskType = maskType ? maskType : undefined
  container.maskProperties = {}
  container.opacity = opacity ? opacity : 1
  container.name = name
  container.objType = 'image'
  container.type = 'image'

  const updateImagePosition = (obj?: any) => {
    if (container.object) {
      let valign = container.verticalAlign || 'top';
      let halign = container.horizontalAlign || 'left';
      let size = Math.min(container.width, container.height);
      let left = container.object.left || 0, top = container.object.top || 0;
      let w = container.object.width || 0;
      let h = container.object.height || 0;
      let rw = 0, rh = 0;
      if (container.height / container.width >= h / w)
      {
        rw = container.width;
        rh = rw * (h / w);
      }
      else
      {
        rh = container.height;
        rw = rh * (w / h);
      }
      let rate = w / h;
      if(valign == 'top')
      {
        top = -h / 2 - Math.max(0, container.height / container.width - h / w) * 0.5 * w;
      }
      else if(valign == 'middle')
      {
        top = -h / 2;
      }
      else if(valign == 'bottom')
      {
        top = -h / 2 + Math.max(0, container.height / container.width - h / w) * 0.5 * w;
      }
      if(halign == 'left')
      {
        left = - Math.max(0, container.width / container.height - w / h) * 0.5 * h;
      }
      else if(halign == 'center')
      {
        left = 0;
      }
      else if(halign == 'right')
      {
        left = Math.max(0, container.width / container.height - w / h) * 0.5 * h;
      }
      container.object.set({'left': (-w / 2 + left - 1), 'top': top - 1});
      container.object.set({'left': (-w / 2 + left), 'top': top});
    }
  }
  container.updateMask = () => {
    var centerPoint = container.getCenterPoint();
    let valign = container.verticalAlign || 'top';
    let halign = container.horizontalAlign || 'left';
    let w = container.object.width || 0;
    let h = container.object.height || 0;
    let rw = 0, rh = 0;
    if (container.height / container.width >= h / w)
    {
      rw = container.width;
      rh = rw * (h / w);
    }
    else
    {
      rh = container.height;
      rw = rh * (w / h);
    }
    const boundingWidth = rw;
    const boundingHeight = rh;
    if (container.height / container.width > h / w)
    {
      if (valign == "top")
      {
        centerPoint.y -= (container.height - rh) / 2;
      }
      else if (valign == "middle")
      {

      }
      else if (valign == "bottom")
      {
        centerPoint.y += (container.height - rh) / 2;
      }
    }
    if (container.height / container.width < h / w)
    {
      if (halign == "left")
      {
        centerPoint.x -= (container.width - rw) / 2;
      }
      else if (halign == "center")
      {
  
      }
      else if (halign == "right")
      {
        centerPoint.x += (container.width - rw) / 2;
      }
    }
    
    if (container.maskType) {
      const maskType = container.maskType
      if (maskType === 'circle') {
        let radius

        if (boundingWidth > boundingHeight) {
          radius = boundingHeight / 2
        } else {
          radius = boundingWidth / 2
        }

        const clipPathProperties = {
          radius: radius,
          top: centerPoint.y,
          left: centerPoint.x,
          absolutePositioned: true,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: true,
          objectCaching: false,
          noScaleCache: true,
          dirty: false,
        }
        container.object.clipPath = new fabric.Circle(clipPathProperties)
      }
      else if (maskType === 'rounded_corners') {
        const borderRadius =
          container?.maskProperties?.radius && 'radius' in container.maskProperties
            ? container.maskProperties['radius']
            : 10
        const clipPathProperties = {
          left: centerPoint.x,
          top: centerPoint.y,
          width: boundingWidth,
          height: boundingHeight,
          rx: borderRadius,
          ry: borderRadius,
          absolutePositioned: true,
          originX: 'center',
          originY: 'center',
          angle: container.angle,
          selectable: false,
          evented: false,
          objectCaching: false,
          noScaleCache: true,
          dirty: false,
        }
        container.object.clipPath = new fabric.Rect(clipPathProperties)
      }
      else if (['blob', 'squircle', 'hexagon', 'pentagon', 'parallelogram'].includes(maskType)) {
        const paths = {
          blob: 'M803.424 604.304c-129.558 202.038-642.354 204.756-770.1 2.718C-93.516 405.89 164.694.908 421.092.002 677.49-.904 932.076 401.36 803.424 604.304Z',
          squircle:
            'M200 400c87.639 0 136.359 0 168.18-31.82C400 336.358 400 287.638 400 200c0-87.639 0-136.359-31.82-168.18C336.358 0 287.638 0 200 0 112.361 0 63.641 0 31.82 31.82 0 63.642 0 112.362 0 200c0 87.639 0 136.359 31.82 168.18C63.642 400 112.362 400 200 400Z',
          hexagon: 'M346.41 300 173.205 400 0 300V100L173.205 0 346.41 100z',
          pentagon:
            'M397.748 173.23 204.673 2.668a6.668 6.668 0 0 0-8.794-.026L2.284 171.55a6.663 6.663 0 0 0-1.927 7.173L73.691 393.72a6.666 6.666 0 0 0 6.307 4.513h239.696a6.664 6.664 0 0 0 6.3-4.493l73.64-213.336c.88-2.553.14-5.38-1.886-7.173Z',
          parallelogram: 'M89.097 0H400l-88.662 212.308H0z',
        }

        const clipPathProperties = {
          name: maskType,
          top: centerPoint.y,
          left: centerPoint.x,
          absolutePositioned: true,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        }
        // @ts-ignore
        const fabricPath = new fabric.Path(paths[maskType], clipPathProperties);
        // @ts-ignore
        const dims = fabricPath._calcDimensions();
        let scale = Math.min(boundingHeight / dims.height, boundingWidth / dims.width);
        fabricPath.set({ scaleX: scale, scaleY: scale });
        container.object.clipPath = fabricPath;
        container.object.clipPath.setCoords();
      }
    } else {
      container.object.clipPath = undefined;
      container.maskType = undefined;
    }
    updateImagePosition();
  }

  container.on('scaling', (e) => {
    container.updateMask?.()
  })

  container.on('resizing', (e) => {
    container.updateMask?.()
  })

  container.on('moving', (e) => {
    container.updateMask?.()
  })

  canvas.on('before:render', () => {
    container.updateMask?.()
  })

  canvas.on('selection:updated', () => {
    container.updateMask?.()
  })

  canvas.on('selection:created', () => {
    container.updateMask?.()
  })

  if (top && left) {
    container.left = left
    container.top = top
  } else canvas.centerObject(container)

  if (returnJSON) {
    return getJSON(container)
  }
  container.updateMask();
  canvas.add(container)
  // If it is load from json don't set active object
  canvas.setActiveObject(container)
}
