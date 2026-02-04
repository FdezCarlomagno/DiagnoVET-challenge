'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { StudyImage } from '@/lib/mock-report-data'

interface ImageThumbnailProps {
  image: StudyImage
  organName: string
}

export function ImageThumbnail({ image, organName }: ImageThumbnailProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted transition-all hover:border-primary hover:ring-2 hover:ring-primary/20"
      >
        <Image
          src={image.url || "/placeholder.svg"}
          alt={image.metadata}
          fill
          className="object-cover"
          sizes="64px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          <ZoomIn className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {organName} - {image.metadata}
            </span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <Image
            src={image.url || '/placeholder.svg'}
            alt={image.metadata}
            fill
            className="object-contain"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Imagen de referencia para el hallazgo de {organName}
        </p>
      </DialogContent>

      </Dialog>
    </>
  )
}
