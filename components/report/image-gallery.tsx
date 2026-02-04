'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import type { StudyImage } from '@/lib/mock-report-data'

interface ImageGalleryProps {
  images: StudyImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)

  // Reset zoom when changing images
  useEffect(() => {
    setZoom(1)
  }, [selectedIndex])

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setSelectedIndex(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  const handlePrevious = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Imágenes del Estudio
        </h2>
        <span className="text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg border-2 border-border bg-muted transition-all hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Image
              src={image.url || '/placeholder.svg'}
              alt={image.metadata}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/50">
              <div className="flex flex-col items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-8 w-8 text-white" />
                <span className="text-xs font-medium text-white">Ver imagen</span>
              </div>
            </div>

            {/* Image metadata */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
              <p className="text-xs font-medium text-white line-clamp-2">
                {image.metadata}
              </p>
            </div>

            {/* Image number badge */}
            <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 backdrop-blur-sm">
              <span className="text-xs font-semibold text-white">
                {index + 1}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Image Viewer Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0 gap-0 overflow-hidden bg-black/95 border-none">
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 backdrop-blur-sm">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/90">
                {selectedIndex !== null && images[selectedIndex]?.metadata}
              </h3>
              <p className="text-xs text-white/60">
                Imagen {selectedIndex !== null && selectedIndex + 1} de {images.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="h-8 w-8 text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] text-center text-xs font-medium text-white">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="h-8 w-8 text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleResetZoom}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedIndex(null)}
                className="h-9 w-9 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Image container */}
          <div className="relative flex h-[calc(95vh-73px)] items-center justify-center overflow-hidden">
            {selectedIndex !== null && (
              <div
                className="relative h-full w-full transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              >
                <Image
                  src={images[selectedIndex].url || '/placeholder.svg'}
                  alt={images[selectedIndex].metadata}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            )}

            {/* Navigation arrows - Always visible, better positioned */}
            {images.length > 1 && (
              <>
                {/* Previous button */}
                <button
                  onClick={handlePrevious}
                  className="group absolute left-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/20 bg-black/60 backdrop-blur-md transition-all hover:scale-110 hover:border-white/40 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-8 w-8 text-white transition-transform group-hover:-translate-x-0.5" />
                </button>

                {/* Next button */}
                <button
                  onClick={handleNext}
                  className="group absolute right-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/20 bg-black/60 backdrop-blur-md transition-all hover:scale-110 hover:border-white/40 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-8 w-8 text-white transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/80 px-4 py-3 backdrop-blur-md">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedIndex(index)}
                    className={`relative h-12 w-12 overflow-hidden rounded-md border-2 transition-all ${
                      index === selectedIndex
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-white/30 hover:border-white/60 hover:scale-105'
                    }`}
                  >
                    <Image
                      src={image.url || '/placeholder.svg'}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Keyboard hints */}
          <div className="absolute bottom-24 left-6 z-10 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-white/20 px-1.5 py-0.5 font-mono">←</kbd>
                <kbd className="rounded bg-white/20 px-1.5 py-0.5 font-mono">→</kbd>
                Navegar
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-white/20 px-1.5 py-0.5 font-mono">Esc</kbd>
                Cerrar
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}