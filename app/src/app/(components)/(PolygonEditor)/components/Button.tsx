import React, { CSSProperties, MouseEvent } from 'react'

type ButtonProps = {
  name: string
  className: string
  style?: CSSProperties
  onButtonClick: (value: MouseEvent) => void
}

export const Button = ({
  name,
  className,
  style,
  onButtonClick,
}: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={(e) => onButtonClick(e)}
      style={style}
    >
      {name}
    </button>
  )
}
