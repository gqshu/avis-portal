"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

interface SimpleJsonEditorProps {
  value: string
  onChange?: (value: string) => void
  height?: string
  "aria-label"?: string
}

export function SimpleJsonEditor({
  value,
  onChange,
  height = "400px",
  "aria-label": ariaLabel,
}: SimpleJsonEditorProps) {
  const [internalValue, setInternalValue] = useState(value)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)

    try {
      // Validate JSON
      JSON.parse(newValue)
      setError(null)
      onChange?.(newValue)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="relative">
      <Textarea
        value={internalValue}
        onChange={handleChange}
        className="font-mono text-xs"
        style={{ height, resize: "none" }}
        aria-label={ariaLabel}
      />
      {error && (
        <div className="absolute bottom-2 left-2 right-2 bg-red-100 text-red-800 text-xs p-1 rounded">{error}</div>
      )}
    </div>
  )
}
