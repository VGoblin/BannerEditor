import React from 'react'
import { Component, Image, Record, Text, ChartCircle, MinusSquare } from 'iconsax-react'

/**
 * It takes a string and returns a JSX.Element
 * @param {string} type - string - The type of the annotation.
 * @returns A JSX.Element
 */
export const renderIcon = (type: string): JSX.Element => {
  switch (type) {
    case 'rect':
      return <Component size="18" color="#000000" className="rotate-45" />
    case 'circle':
      return <Record size="18" color="#000000" />
    case 'textbox':
      return <Text size="18" color="#000000" />
    case 'image':
      // eslint-disable-next-line jsx-a11y/alt-text
      return <Image size="18" color="#000000" />
    case 'donut':
      return <ChartCircle size="18" color="#000000" />
    case 'button':
      return <MinusSquare size="18" color="#000000" />
    case 'group':
      return <Component size="18" color="#000000" className="rotate-45" />
    default:
      return <Component size="18" color="#000000" className="rotate-45" />
  }
}

export const UnderLine: React.FC = () => {
  return (
    <svg
      className="pointer-events-none"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="underline"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      data-fa-i2svg=""
      width="14"
      height="16"
    >
      <path
        fill="#212529"
        d="M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H128V224c0 53 43 96 96 96s96-43 96-96V96H304c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"
      ></path>
    </svg>
  )
}

export const OverLine: React.FC = () => {
  return (
    <svg
      className="pointer-events-none"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="overline"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      data-fa-i2svg=""
      width="14"
      height="16"
    >
      <path
        fill="#212529"
        d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM224 128c-97.2 0-176 78.8-176 176v32c0 97.2 78.8 176 176 176s176-78.8 176-176V304c0-97.2-78.8-176-176-176zM112 304c0-61.9 50.1-112 112-112s112 50.1 112 112v32c0 61.9-50.1 112-112 112s-112-50.1-112-112V304z"
      ></path>
    </svg>
  )
}

export const LineThrough: React.FC = () => {
  return (
    <svg
      className="pointer-events-none"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="strikethrough"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      data-fa-i2svg=""
      width="14"
      height="16"
    >
      <path
        fill="#212529"
        d="M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3l0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6l0 0 .2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1H335.1c7 5.6 11.4 11.2 13.9 17.2z"
      ></path>
    </svg>
  )
}

export const Italic: React.FC = () => {
  return (
    <svg
      className="pointer-events-none"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="italic"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      data-fa-i2svg=""
      width="14"
      height="16"
    >
      <path
        fill="#212529"
        d="M128 64c0-17.7 14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H293.3L160 416h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H90.7L224 96H160c-17.7 0-32-14.3-32-32z"
      ></path>
    </svg>
  )
}

export const ToggleIcon: React.FC = () => {
  return (
    <svg width="28" height="15" viewBox="0 0 28 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.5 0C3.36375 0 0 3.36375 0 7.5C0 11.6363 3.36375 15 7.5 15H20C24.1363 15 27.5 11.6363 27.5 7.5C27.5 3.36375 24.1363 0 20 0H7.5ZM7.5 2.5H20C22.7575 2.5 25 4.7425 25 7.5C25 10.2575 22.7575 12.5 20 12.5H7.5C4.7425 12.5 2.5 10.2575 2.5 7.5C2.5 4.7425 4.7425 2.5 7.5 2.5ZM20 3.75C19.0054 3.75 18.0516 4.14509 17.3483 4.84835C16.6451 5.55161 16.25 6.50544 16.25 7.5C16.25 8.49456 16.6451 9.44839 17.3483 10.1517C18.0516 10.8549 19.0054 11.25 20 11.25C20.9946 11.25 21.9484 10.8549 22.6517 10.1517C23.3549 9.44839 23.75 8.49456 23.75 7.5C23.75 6.50544 23.3549 5.55161 22.6517 4.84835C21.9484 4.14509 20.9946 3.75 20 3.75Z"
        fill="black"
      />
    </svg>
  )
}

export const LeftAlignIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <path
        opacity="0.35"
        d="M14.5209 4.95834H2.47925C1.89204 4.95834 1.41675 4.48305 1.41675 3.89584C1.41675 3.30864 1.89204 2.83334 2.47925 2.83334H14.5209C15.1081 2.83334 15.5834 3.30864 15.5834 3.89584C15.5834 4.48305 15.1081 4.95834 14.5209 4.95834Z"
        fill="black"
      />
      <path
        d="M8.14591 9.91666H2.47925C1.89204 9.91666 1.41675 9.44136 1.41675 8.85416C1.41675 8.26695 1.89204 7.79166 2.47925 7.79166H8.14591C8.73312 7.79166 9.20841 8.26695 9.20841 8.85416C9.20841 9.44136 8.73312 9.91666 8.14591 9.91666Z"
        fill="black"
      />
      <path
        opacity="0.35"
        d="M11.6876 14.875H2.47925C1.89204 14.875 1.41675 14.3997 1.41675 13.8125C1.41675 13.2253 1.89204 12.75 2.47925 12.75H11.6876C12.2748 12.75 12.7501 13.2253 12.7501 13.8125C12.7501 14.3997 12.2748 14.875 11.6876 14.875Z"
        fill="black"
      />
    </svg>
  )
}

export const CenterAlignIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <path
        opacity="0.35"
        d="M14.5209 4.95834H2.47925C1.89275 4.95834 1.41675 4.48305 1.41675 3.89584C1.41675 3.30864 1.89275 2.83334 2.47925 2.83334H14.5209C15.1074 2.83334 15.5834 3.30864 15.5834 3.89584C15.5834 4.48305 15.1074 4.95834 14.5209 4.95834Z"
        fill="black"
      />
      <path
        d="M11.6875 9.91666H5.3125C4.726 9.91666 4.25 9.44136 4.25 8.85416C4.25 8.26695 4.726 7.79166 5.3125 7.79166H11.6875C12.274 7.79166 12.75 8.26695 12.75 8.85416C12.75 9.44136 12.274 9.91666 11.6875 9.91666Z"
        fill="black"
      />
      <path
        opacity="0.35"
        d="M13.8125 14.875H3.1875C2.601 14.875 2.125 14.3997 2.125 13.8125C2.125 13.2253 2.601 12.75 3.1875 12.75H13.8125C14.399 12.75 14.875 13.2253 14.875 13.8125C14.875 14.3997 14.399 14.875 13.8125 14.875Z"
        fill="black"
      />
    </svg>
  )
}

export const RightAlignmentIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <path
        opacity="0.35"
        d="M14.5209 4.95834H2.47925C1.89204 4.95834 1.41675 4.48305 1.41675 3.89584C1.41675 3.30864 1.89204 2.83334 2.47925 2.83334H14.5209C15.1081 2.83334 15.5834 3.30864 15.5834 3.89584C15.5834 4.48305 15.1081 4.95834 14.5209 4.95834Z"
        fill="black"
      />
      <path
        d="M14.5209 9.91666H8.85425C8.26704 9.91666 7.79175 9.44136 7.79175 8.85416C7.79175 8.26695 8.26704 7.79166 8.85425 7.79166H14.5209C15.1081 7.79166 15.5834 8.26695 15.5834 8.85416C15.5834 9.44136 15.1081 9.91666 14.5209 9.91666Z"
        fill="black"
      />
      <path
        opacity="0.35"
        d="M14.5208 14.875H5.3125C4.72529 14.875 4.25 14.3997 4.25 13.8125C4.25 13.2253 4.72529 12.75 5.3125 12.75H14.5208C15.108 12.75 15.5833 13.2253 15.5833 13.8125C15.5833 14.3997 15.108 14.875 14.5208 14.875Z"
        fill="black"
      />
    </svg>
  )
}

export const VerticalTopAlignIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <g fillRule="evenodd" fill="rgb(115, 128, 153)">
        <path d="M7.5 4h1v10h-1zM0 0h16v1H0z">
        </path><path d="M5.18 5.83L8.01 3l.7.7L5.9 6.55z"></path>
        <path d="M7.3 3.7L8 3l2.84 2.83-.71.7z"></path>
      </g>
    </svg>
  )
}

export const VerticalCenterAlignIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <g fillRule="evenodd" fill="rgb(115, 128, 153)"><path d="M5.18 11.33L8.01 8.5l.7.7-2.82 2.84z"></path><path d="M7.3 9.2l.7-.7 2.84 2.83-.71.7zM0 5.5h16v1H0z"></path><g><path d="M10.84.65L8 3.48l-.7-.71 2.82-2.83z"></path><path d="M8.72 2.77l-.71.7L5.18.66l.7-.7z"></path></g></g>
    </svg>
  )
}

export const VerticalBottomAlignIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      xmlns="http://www.w3.org/2000/svg"
      fill="rgb(115, 128, 153)"
      className="pointer-events-none"
    >
      <path d="M7.5 0h1v10h-1zM0 13h16v1H0z"></path>
      <path d="M10.84 8.18L8 11l-.7-.71 2.82-2.83z"></path>
      <path d="M8.72 10.3L8 11 5.18 8.19l.7-.7z"></path>
    </svg>
  )
}

export const HorizontalLeftAlignIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <path fillRule="evenodd" fill="rgb(115, 128, 153)" d="M4.5 6h8c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5h-8A1.5 1.5 0 013 9.5v-2C3 6.67 3.67 6 4.5 6zM0 0h1v17H0V0z"></path>
    </svg>
  )
}

export const HorizontalCenterAlignIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <path fillRule="evenodd" fill="rgb(115, 128, 153)" d="M4.5 6h8c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5h-8A1.5 1.5 0 013 9.5v-2C3 6.67 3.67 6 4.5 6zM8 0h1v5H8V0zm0 12h1v5H8v-5z"></path>
    </svg>
  )
}

export const HorizontalRightAlignIcon: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      xmlns="http://www.w3.org/2000/svg"
      fill="rgb(115, 128, 153)"
      className="pointer-events-none"
    >
      <path fillRule="evenodd" fill="rgb(115, 128, 153)" d="M4.5 6h8c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5h-8A1.5 1.5 0 013 9.5v-2C3 6.67 3.67 6 4.5 6zM16 0h1v17h-1V0z"></path>
    </svg>
  )
}

