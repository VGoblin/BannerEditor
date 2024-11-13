import React from 'react'
import { Button as Btn, ButtonProps } from '@mantine/core'
type Props = {
  children?: React.ReactNode
  center?: boolean
  text?: string
  className?: string
  onClick?: (a: any) => any
  ghost?: boolean
  loading?: boolean
  fullWidth?: boolean
  compact?: boolean
  light?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  component?: any
  href?: string
  type?: 'button' | 'submit' | 'reset'
  args?: ButtonProps
}

const Button = ({
  children,
  text,
  center,
  className,
  onClick,
  ghost,
  loading,
  fullWidth,
  compact,
  light,
  size = 'md',
  component,
  href,
  type = 'button',
  ...args
}: Props) => {
  if (ghost) {
    return (
      <Btn
        type={type}
        href={href}
        component={component}
        compact={compact}
        fullWidth={fullWidth}
        loading={loading}
        onClick={onClick}
        className={`  my-0 cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm text-blue-400 transition-all  duration-150 hover:border-blue-500 hover:bg-blue-50 ${
          center ? 'mx-auto block' : ''
        } ${className}`}
        {...args}
      >
        {children ? children : text}
      </Btn>
    )
  } else if (light) {
    return (
      <Btn
        type={type}
        href={href}
        component={component}
        size={size}
        compact={compact}
        fullWidth={fullWidth}
        loading={loading}
        onClick={onClick}
        className={`  my-0 cursor-pointer rounded-md border border-slate-200 bg-[#edf2ff] px-4 py-2 text-sm font-semibold text-blue-400 transition-all  duration-150  hover:bg-[#dbe4ffa6] ${
          center ? 'mx-auto block' : ''
        } ${className}`}
        {...args}
      >
        {children ? children : text}
      </Btn>
    )
  }
  return (
    <Btn
      type={type}
      href={href}
      component={component}
      size={size}
      compact={compact}
      fullWidth={fullWidth}
      loading={loading}
      onClick={onClick}
      className={`my-0  cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-all duration-150 hover:bg-blue-600 ${
        center ? 'mx-auto block' : ''
      } ${className}`}
      {...args}
    >
      {children ? children : text}
    </Btn>
  )
}

export default Button
