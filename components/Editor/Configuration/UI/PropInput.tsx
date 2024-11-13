import type { ChangeEvent, CSSProperties } from 'react'
import React from 'react'

type Props = {
  value: string | number
  handler: (a: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  type: string
  name: string
  id: string
  min?: number
  max?: number
  label?: string
  style?: CSSProperties
  className?: string
  inputClassName?: string
  suffix?: React.ReactNode
  step?: string
}

const PropInput: React.FC<Props> = ({
  value,
  handler,
  disabled,
  type,
  name,
  id,
  min,
  max,
  style,
  className,
  inputClassName,
  label,
  suffix,
  step,
}) => {
  if (!label) {
    return (
      <input
        type={type}
        name={name}
        id={id}
        min={min ? min : undefined}
        max={max ? max : undefined}
        value={value.toString()}
        onChange={handler}
        className={`w-12 appearance-none overflow-visible border-none text-right text-sm font-bold text-black outline-none ${inputClassName}`}
        disabled={disabled}
        style={style}
        step={step}
      />
    )
  } else {
    return (
      <label htmlFor={id} className={`flex justify-between text-sm text-editorGray ${className}`}>
        {label}
        <div className="flex items-center gap-2">
          <input
            type={type}
            name={name}
            id={id}
            min={min ? min : undefined}
            max={max ? max : undefined}
            value={value.toString()}
            onChange={handler}
            className={`w-12 appearance-none overflow-visible border-none text-right text-sm font-bold text-black outline-none ${inputClassName} `}
            disabled={disabled}
            step={step}
            style={{ ...style }}
          />
          {suffix}
        </div>
      </label>
    )
  }
}

export default PropInput
