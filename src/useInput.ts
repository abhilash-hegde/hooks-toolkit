"use client"

import { useState, type ChangeEvent } from "react"

interface InputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  onFocus: () => void
  reset: () => void
}

/**
 * Hook that manages input state
 * @param initialValue Initial input value
 * @returns Input props and state
 */
export function useInput(initialValue = ""): InputProps & { isTouched: boolean } {
  const [value, setValue] = useState<string>(initialValue)
  const [isTouched, setIsTouched] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleBlur = () => {
    setIsTouched(true)
  }

  const handleFocus = () => {
    // You can add additional logic here if needed
  }

  const reset = () => {
    setValue(initialValue)
    setIsTouched(false)
  }

  return {
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    reset,
    isTouched,
  }
}

