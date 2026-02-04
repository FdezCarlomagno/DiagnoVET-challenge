'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface DiffViewerProps {
  originalText: string
  currentText: string
  editedBy?: string
}

export function DiffViewer({ originalText, currentText, editedBy }: DiffViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (originalText === currentText) return null

  return (
    <div className="mt-3 border-t border-border pt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        {isExpanded ? 'Ocultar cambios' : 'Mostrar cambios'}
      </Button>

      {isExpanded && (
        <div className="mt-2 space-y-2 rounded-md bg-muted/30 p-3">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Original AI:</span>
            <p className="mt-1 text-sm text-muted-foreground line-through decoration-red-400">
              {originalText}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-emerald-600">
              Editado por {editedBy || 'Veterinario'}:
            </span>
            <p className="mt-1 text-sm font-medium text-emerald-700">
              {currentText}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
