'use client'

import React from "react"
import { useState, useRef, useEffect, useCallback } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, RemoveFormatting, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Kbd } from '@/components/ui/kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface InlineEditorProps {
  initialContent: string
  onSave: (content: string) => void
  onCancel: () => void
  title: string
}

export function InlineEditor({ initialContent, onSave, onCancel, title }: InlineEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaved, setIsSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  // Bad UX feature. Uncomfortable to write 

  // Auto-save after 2 seconds of inactivity
  // useEffect(() => {
  //   if (content !== initialContent) {
  //     // Clear previous timeout
  //     if (saveTimeoutRef.current) {
  //       clearTimeout(saveTimeoutRef.current)
  //     }
      
  //     // Set new timeout
  //     saveTimeoutRef.current = setTimeout(() => {
  //       // Actually save the content
  //       onSave(content)
        
  //       // Show saved indicator
  //       setIsSaved(true)
  //       setTimeout(() => setIsSaved(false), 2000)
  //     }, 2000)
  //   }
    
  //   return () => {
  //     if (saveTimeoutRef.current) {
  //       clearTimeout(saveTimeoutRef.current)
  //     }
  //   }
  // }, [content, initialContent, onSave])

  // Handle click outside to save
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Save and close when clicking outside
        if (content !== initialContent) {
          onSave(content)
        } else {
          onCancel()
        }
      }
    }

    // Add listener
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [content, initialContent, onSave, onCancel])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
    // Select all text for easy replacement
    textareaRef.current?.select()
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      onSave(content)
    }
  }, [content, onCancel, onSave])

  const handleSave = () => {
    onSave(content)
  }

  const formatText = (format: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let newText = content
    let prefix = ''
    let suffix = ''
    let cursorOffset = 0

    switch (format) {
      case 'bold':
        prefix = '**'
        suffix = '**'
        cursorOffset = 2
        break
      case 'italic':
        prefix = '_'
        suffix = '_'
        cursorOffset = 1
        break
      case 'underline':
        prefix = '<u>'
        suffix = '</u>'
        cursorOffset = 3
        break
      case 'list':
        prefix = '• '
        cursorOffset = 2
        break
      case 'orderedList':
        prefix = '1. '
        cursorOffset = 3
        break
    }

    if (selectedText) {
      newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end)
      setContent(newText)
      
      // Restore focus and selection after state update
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
      }, 0)
    } else {
      newText = content.substring(0, start) + prefix + suffix + content.substring(end)
      setContent(newText)
      
      // Position cursor between prefix and suffix
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset)
      }, 0)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="space-y-3 rounded-lg border-2 border-cyan-400 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Editar: {title}</span>
        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-sm text-emerald-600 animate-in fade-in flex items-center gap-1.5">
              <svg 
                className="h-4 w-4" 
                fill="none" 
                strokeWidth="2" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Guardado
            </span>
          )}
          <Button onClick={handleSave} size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-3.5 w-3.5" />
            Guardar
          </Button>
          <Button onClick={onCancel} variant="ghost" size="sm" className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Cancelar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-md border border-border bg-muted/50 p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText('bold')}>
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Negrita</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText('italic')}>
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cursiva</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText('underline')}>
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Subrayado</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText('orderedList')}>
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lista numerada</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText('list')}>
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lista con viñetas</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setContent(initialContent)}>
                <RemoveFormatting className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Restaurar original</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[120px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder="Escribe el hallazgo aquí..."
      />

      <p className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>Haz clic afuera para cerrar</span>
        <span className="hidden items-center gap-1 sm:flex">
          <Kbd>Esc</Kbd> cancelar
          
        </span>
          <span className="hidden items-center gap-1 sm:flex">
        <Kbd>Ctrl</Kbd>+<Kbd>Enter</Kbd> guardar          
        </span>
      </p>
    </div>
  )
}