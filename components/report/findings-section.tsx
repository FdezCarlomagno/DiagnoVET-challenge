'use client'

import { useState } from 'react'
import { Plus, Filter, Trash2, Image as ImageIcon, FileCheck, Highlighter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FindingCard } from './finding-card'
import type { AIFinding, StudyImage } from '@/lib/mock-report-data'

interface FindingsSectionProps {
  findings: AIFinding[]
  images: StudyImage[]
  onUpdateFinding: (id: string, updates: Partial<AIFinding>) => void
  onAddFinding: (newFinding: Omit<AIFinding, 'id'>) => void
  onDeleteFinding: (id: string) => void
}

type FilterType = 'all' | 'pending' | 'accepted' | 'edited'

export function FindingsSection({
  findings,
  images,
  onUpdateFinding,
  onAddFinding,
  onDeleteFinding
}: FindingsSectionProps) {
  const [showEditHistory, setShowEditHistory] = useState(false) // ← Renombrado y más específico
  const [highlightValues, setHighlightValues] = useState(true)   // ← Nueva funcionalidad separada
  const [filter, setFilter] = useState<FilterType>('all')
  
  // Add finding dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFindingOrgan, setNewFindingOrgan] = useState('')
  const [newFindingText, setNewFindingText] = useState('')
  const [linkToImage, setLinkToImage] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  
  // Delete confirmation state
  const [findingToDelete, setFindingToDelete] = useState<string | null>(null)

  const filteredFindings = findings.filter(finding => {
    if (filter === 'all') return true
    return finding.status === filter
  })

  const getImageForFinding = (finding: AIFinding): StudyImage | undefined => {
    return images.find(img => img.id === finding.linkedImageId)
  }

  const pendingCount = findings.filter(f => f.status === 'pending').length
  const acceptedCount = findings.filter(f => f.status === 'accepted').length
  const editedCount = findings.filter(f => f.status === 'edited').length

  const handleOpenAddDialog = () => {
    setNewFindingOrgan('')
    setNewFindingText('')
    setLinkToImage(false)
    setSelectedImageId(null)
    setIsAddDialogOpen(true)
  }

  const handleAddFinding = () => {
    if (!newFindingOrgan.trim() || !newFindingText.trim()) {
      return
    }

    if (linkToImage && !selectedImageId) {
      return
    }

    const newFinding: Omit<AIFinding, 'id'> = {
      organ: newFindingOrgan.trim(),
      confidence: 1.0,
      originalText: newFindingText.trim(),
      currentText: newFindingText.trim(),
      isEdited: false,
      status: 'accepted',
      linkedImageId: linkToImage && selectedImageId ? selectedImageId : '',
    }

    onAddFinding(newFinding)
    setIsAddDialogOpen(false)
  }

  const handleDeleteFinding = (id: string) => {
    setFindingToDelete(id)
  }

  const confirmDelete = () => {
    if (findingToDelete) {
      onDeleteFinding(findingToDelete)
      setFindingToDelete(null)
    }
  }

  const isAddButtonDisabled = 
    !newFindingOrgan.trim() || 
    !newFindingText.trim() || 
    (linkToImage && !selectedImageId)

  // Contar cuántos hallazgos tienen ediciones para mostrar
  const editedFindingsCount = findings.filter(f => f.isEdited).length

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Hallazgos</h2>
            <p className="text-sm text-muted-foreground">
              {pendingCount} pendientes, {acceptedCount} validados, {editedCount} editados
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Highlight Values Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5">
                    <Highlighter className="h-3.5 w-3.5 text-muted-foreground" />
                    <Switch
                      id="highlight-values"
                      checked={highlightValues}
                      onCheckedChange={setHighlightValues}
                      className="scale-90"
                    />
                    <Label 
                      htmlFor="highlight-values" 
                      className="text-xs font-medium cursor-pointer whitespace-nowrap"
                    >
                      Resaltar
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[220px]">
                  <p className="text-xs">
                    Resalta valores anormales en <span className="text-red-500 font-semibold">rojo</span> y valores normales en <span className="text-blue-500 font-semibold">azul</span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Show Edit History Toggle - Solo visible si hay hallazgos editados */}
            {editedFindingsCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5">
                      <FileCheck className="h-3.5 w-3.5 text-muted-foreground" />
                      <Switch
                        id="show-edit-history"
                        checked={showEditHistory}
                        onCheckedChange={setShowEditHistory}
                        className="scale-90"
                      />
                      <Label 
                        htmlFor="show-edit-history" 
                        className="text-xs font-medium cursor-pointer whitespace-nowrap"
                      >
                        Historial
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[220px]">
                    <p className="text-xs">
                      Muestra el historial de cambios editoriales realizados ({editedFindingsCount} {editedFindingsCount === 1 ? 'hallazgo editado' : 'hallazgos editados'})
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Filter Dropdown */}
            <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos ({findings.length})</SelectItem>
                <SelectItem value="pending">Pendientes ({pendingCount})</SelectItem>
                <SelectItem value="accepted">Validados ({acceptedCount})</SelectItem>
                <SelectItem value="edited">Editados ({editedCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              image={getImageForFinding(finding)}
              showEditHistory={showEditHistory}      // ← Renombrado
              highlightValues={highlightValues}       // ← Nueva prop
              onUpdate={onUpdateFinding}
              onDelete={() => handleDeleteFinding(finding.id)}
              availableImages={images}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleOpenAddDialog}
          className="w-full gap-2 border-dashed bg-transparent hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
          Agregar hallazgo manualmente
        </Button>
      </section>

      {/* Add Finding Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar hallazgo manual</DialogTitle>
            <DialogDescription>
              Crea un nuevo hallazgo que será agregado al reporte. Los hallazgos manuales se marcan como validados automáticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Organ/Structure name */}
            <div className="space-y-2">
              <Label htmlFor="organ" className="text-sm font-medium">
                Órgano o estructura *
              </Label>
              <Input
                id="organ"
                placeholder="Ej: Hígado, Bazo, Riñón izquierdo, Vesícula Biliar..."
                value={newFindingOrgan}
                onChange={(e) => setNewFindingOrgan(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Finding text */}
            <div className="space-y-2">
              <Label htmlFor="finding-text" className="text-sm font-medium">
                Descripción del hallazgo *
              </Label>
              <Textarea
                id="finding-text"
                placeholder="Describe el hallazgo observado en detalle..."
                value={newFindingText}
                onChange={(e) => setNewFindingText(e.target.value)}
                className="min-h-[120px] resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Incluye detalles como tamaño, ecogenicidad, forma, y cualquier anormalidad observada.
              </p>
            </div>

            {/* Link to image option */}
            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="link-image"
                  checked={linkToImage}
                  onCheckedChange={setLinkToImage}
                />
                <div className="flex-1">
                  <Label htmlFor="link-image" className="cursor-pointer font-medium">
                    Vincular con imagen del estudio
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Relaciona este hallazgo con una imagen específica para mejor trazabilidad
                  </p>
                </div>
              </div>

              {/* Image selection grid */}
              {linkToImage && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    <span>Selecciona la imagen correspondiente:</span>
                  </div>
                  
                  {images.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No hay imágenes disponibles en este estudio
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {images.map((image) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setSelectedImageId(image.id)}
                          className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            selectedImageId === image.id
                              ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                              : 'border-border hover:border-blue-300 hover:shadow-sm'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.metadata}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          
                          {/* Selection overlay */}
                          {selectedImageId === image.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-600/30 backdrop-blur-[1px]">
                              <div className="rounded-full bg-blue-600 p-2 shadow-lg">
                                <svg
                                  className="h-5 w-5 text-white"
                                  fill="none"
                                  strokeWidth="3"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                          
                          {/* Image metadata footer */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                            <p className="text-xs text-white font-medium truncate">
                              {image.metadata}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {linkToImage && !selectedImageId && images.length > 0 && (
                    <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
                      <svg className="h-4 w-4 text-amber-600 shrink-0" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-xs text-amber-800">
                        Debes seleccionar una imagen para continuar
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddFinding}
              disabled={isAddButtonDisabled}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Agregar hallazgo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!findingToDelete} onOpenChange={() => setFindingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este hallazgo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El hallazgo será eliminado permanentemente del reporte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar hallazgo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}