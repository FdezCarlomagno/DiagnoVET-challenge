'use client'

import React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { AbnormalValue } from '@/lib/mock-report-data'

interface HighlightedTextProps {
  text: string
  abnormalValues?: AbnormalValue[]
  showHighlights: boolean
}

export function HighlightedText({ text, abnormalValues, showHighlights }: HighlightedTextProps) {
  if (!showHighlights || !abnormalValues || abnormalValues.length === 0) {
    return <span>{text}</span>
  }

  // Sort by position in text (longest first to avoid partial matches)
  const sortedValues = [...abnormalValues].sort((a, b) => b.text.length - a.text.length)

  // Create a map of positions to highlight
  const highlights: { start: number; end: number; value: AbnormalValue }[] = []
  
  sortedValues.forEach((abnormalValue) => {
    const index = text.indexOf(abnormalValue.text)
    if (index !== -1) {
      // Check if this range overlaps with existing highlights
      const overlaps = highlights.some(
        h => (index >= h.start && index < h.end) || 
             (index + abnormalValue.text.length > h.start && index + abnormalValue.text.length <= h.end)
      )
      if (!overlaps) {
        highlights.push({
          start: index,
          end: index + abnormalValue.text.length,
          value: abnormalValue
        })
      }
    }
  })

  // Sort highlights by position
  highlights.sort((a, b) => a.start - b.start)

  // Build the result
  const result: React.ReactNode[] = []
  let lastIndex = 0

  highlights.forEach((highlight, i) => {
    // Add text before this highlight
    if (highlight.start > lastIndex) {
      result.push(
        <span key={`text-${i}`}>
          {text.substring(lastIndex, highlight.start)}
        </span>
      )
    }

    // Add the highlighted value
    const isOutOfRange = 
      highlight.value.value < highlight.value.normalRange[0] ||
      highlight.value.value > highlight.value.normalRange[1]

    result.push(
      <TooltipProvider key={`highlight-${i}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <mark
              className={`cursor-help rounded px-0.5 font-mono text-sm ${
                isOutOfRange
                  ? 'bg-red-100 text-red-800 underline decoration-red-400 decoration-wavy'
                  : 'bg-cyan-100 text-cyan-800 underline decoration-cyan-400'
              }`}
            >
              {highlight.value.text}
            </mark>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium">
                {isOutOfRange ? 'Valor fuera de rango' : 'Valor medido'}
              </p>
              <p>
                Valor: {highlight.value.value} {highlight.value.unit}
              </p>
              <p className="text-muted-foreground">
                Rango normal: {highlight.value.normalRange[0]} - {highlight.value.normalRange[1]} {highlight.value.unit}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    lastIndex = highlight.end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(
      <span key="text-end">
        {text.substring(lastIndex)}
      </span>
    )
  }

  return <>{result}</>
}
