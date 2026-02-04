'use client'

import { useState } from 'react'
import { Bot, Image as ImageIcon, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { StudyImage } from '@/lib/mock-report-data'

interface RegenerateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegenerate: (context: string, selectedImages: string[]) => void
  availableImages?: StudyImage[]
  organName: string
  isRegenerating: boolean
}

export function RegenerateDialog({
  open,
  onOpenChange,
  onRegenerate,
  availableImages = [],
  organName,
  isRegenerating
}: RegenerateDialogProps) {
  const [context, setContext] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleSubmit = () => {
    onRegenerate(context, selectedImages)
    setContext('')
    setSelectedImages([])
  }

  const handleCancel = () => {
    onOpenChange(false)
    setContext('')
    setSelectedImages([])
  }

  const toggleImage = (imageId: string) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            Regenerar hallazgo: {organName}
          </DialogTitle>
          <DialogDescription>
            Proporciona contexto adicional para que la IA genere un hallazgo más preciso
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Context Input */}
          <div className="space-y-2">
            <Label htmlFor="context">
              Contexto adicional
              <span className="ml-2 text-xs text-muted-foreground">(Opcional)</span>
            </Label>
            <Textarea
              id="context"
              placeholder="Ej: El paciente presenta antecedentes de hipertensión arterial. Considerar posible cardiomegalia..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Describe hallazgos relacionados, antecedentes clínicos o aspectos específicos a considerar
            </p>
          </div>

          {/* Image Selection */}
          {availableImages.length > 0 && (
            <div className="space-y-3">
              <Label>
                Imágenes de referencia
                <span className="ml-2 text-xs text-muted-foreground">
                  ({selectedImages.length} seleccionadas)
                </span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => toggleImage(image.id)}
                    className={`relative group rounded-lg border-2 transition-all overflow-hidden ${
                      selectedImages.includes(image.id)
                        ? 'border-purple-500 ring-2 ring-purple-200'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    <div className="aspect-square bg-muted flex items-center justify-center p-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      <img src={image?.url} alt="" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-xs font-medium text-white truncate">
                        {image.metadata}
                      </p>
                    </div>
                    {selectedImages.includes(image.id) && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-purple-600 hover:bg-purple-700 h-6 w-6 p-0 flex items-center justify-center rounded-full">
                          <span className="text-xs">✓</span>
                        </Badge>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {(context || selectedImages.length > 0) && (
            <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3 space-y-2">
              <p className="text-sm font-medium text-purple-900">
                Contexto que se enviará a la IA:
              </p>
              {context && (
                <div className="text-xs text-purple-800 bg-white rounded p-2">
                  "{context}"
                </div>
              )}
              {selectedImages.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedImages.map((imageId) => {
                    const image = availableImages.find(img => img.id === imageId)
                    return (
                      <Badge
                        key={imageId}
                        variant="secondary"
                        className="text-xs gap-1"
                      >
                        <ImageIcon className="h-3 w-3" />
                        <img src={image?.url} alt="" />
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isRegenerating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isRegenerating}
            className="gap-2"
          >
            {isRegenerating ? (
              <>
                <Bot className="h-4 w-4 animate-pulse" />
                Regenerando...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" />
                Regenerar con IA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}