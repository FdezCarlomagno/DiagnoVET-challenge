'use client'

import { ArrowLeft, Download, Pencil, Settings, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils' // Asumiendo que usas cn(), si no, usa template literals normales

interface ReportHeaderProps {
  patientName: string
  species: string
  breed: string
  date: string
  onBack?: () => void
  onPrintPdf?: () => Promise<void>
  onEditCase?: () => void
  onSettings?: () => void
}

export function ReportHeader({
  patientName,
  species,
  breed,
  date,
  onBack,
  onPrintPdf,
  onEditCase,
  onSettings
}: ReportHeaderProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const [showTitle, setShowTitle] = useState(false)

  // Lógica para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      // 120px es aprox la altura donde el título grande del body desaparece
      const threshold = 120
      setShowTitle(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePrintPdf = async () => {
    if (!onPrintPdf) return
    setIsPrinting(true)
    try {
      await onPrintPdf()
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        
        {/* Lado Izquierdo: Volver */}
        <div className="flex items-center gap-4 w-[200px]"> {/* Ancho fijo para evitar saltos */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground pl-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver a listado</span>
            <span className="sm:hidden">Volver</span>
          </Button>
        </div>

        {/* Centro: Identidad del Paciente (Context Aware) */}
        <div 
          className={cn(
            "flex flex-col items-center transition-all duration-300 ease-in-out",
            showTitle 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-2 pointer-events-none"
          )}
        >
          <h1 className="text-base font-bold text-foreground leading-tight">
            {patientName}
          </h1>
          <p className="text-xs text-muted-foreground">
            {species} · {date}
          </p>
        </div>

        {/* Lado Derecho: Acciones */}
        <div className="flex items-center justify-end gap-2 w-[280px]"> {/* Ancho mínimo para alinear */}
          <Button
            onClick={handlePrintPdf}
            disabled={isPrinting}
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPrinting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden lg:inline">Generando...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span className="hidden lg:inline">Imprimir PDF</span>
                <span className="lg:hidden">PDF</span>
              </>
            )}
          </Button>
          
          <Button variant="outline" size="sm" onClick={onEditCase} className="gap-2 bg-transparent hidden sm:flex">
            <Pencil className="h-4 w-4" />
            <span className="hidden lg:inline">Editar Caso</span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </header>
  )
}