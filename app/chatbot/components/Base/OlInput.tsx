'use client'

import { ChangeEvent, InputHTMLAttributes, useImperativeHandle, useRef, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    className?: string
}

interface Refs {
    focus: () => void
}

export const OlInput = forwardRef<Refs, Props>(
    ({className = '', onChange, ...restProps}, ref) => {
      const classNames = ['rounded', 'h-8', 'outline-none', 'text-slate-800', 'px-2', 'border', 'border-slate-300', 'focus:border-cyan-700', 'dark:border', 'dark:border-slate-900', 'dark:focus:border-sky-600', className]
      function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
        onChange?.(e)
      }
      const inputRef = useRef<HTMLInputElement>(null)
      useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus()
      }))
      return (
        <input
          ref={inputRef}
          className={classNames.join(' ')}
          { ...restProps }
          onChange={handleValueChange}
        />
      );
    }
)

OlInput.displayName = 'ol-input'