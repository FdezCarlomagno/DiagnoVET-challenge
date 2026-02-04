'use client'

import { useState } from 'react'
import type { AIFinding, StudyImage } from '@/lib/mock-report-data'
import { getStatusColor, getConfidenceColor } from '@/lib/mock-report-data'
import { ConfidenceBadge } from './confidence-badge'
import { FindingActions } from './finding-actions'
import { InlineEditor } from './inline-editor'
import { ImageThumbnail } from './image-thumbnail'
import { DiffViewer } from './diff-viewer'
import { HighlightedText } from './highlighted-text'
import { RegenerateDialog } from './regenerateDialog'

interface FindingCardProps {
  finding: AIFinding
  image?: StudyImage
  showEditHistory: boolean
  highlightValues: boolean
  onUpdate: (id: string, updates: Partial<AIFinding>) => void
  onDelete?: () => void
  availableImages?: StudyImage[]
}

export function FindingCard({ 
  finding, 
  image, 
  showEditHistory,
  highlightValues,
  onUpdate,
  onDelete,
  availableImages = []
}: FindingCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const statusColor = getStatusColor(finding.status)
  const confidenceColors = getConfidenceColor(finding.confidence)

  const handleAccept = () => {
    onUpdate(finding.id, { status: 'accepted' })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = (newText: string) => {
    onUpdate(finding.id, {
      currentText: newText,
      isEdited: newText !== finding.originalText,
      status: newText !== finding.originalText ? 'edited' : finding.status,
      editedBy: newText !== finding.originalText ? 'Dr. Usuario' : finding.editedBy,
      editedAt: newText !== finding.originalText 
        ? new Date().toLocaleString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : finding.editedAt
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleRegenerateClick = () => {
    setShowRegenerateDialog(true)
  }

  const handleRegenerate = async (context: string, selectedImages: string[]) => {
    setIsRegenerating(true)
    setShowRegenerateDialog(false)
    
    // Simulate AI regeneration with context
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Mock: Generar texto que incluya el contexto proporcionado
    let regeneratedText = finding.originalText + ' [Regenerado por AI]'
    
    if (context) {
      regeneratedText += ` Considerando: ${context.substring(0, 50)}...`
    }
    
    if (selectedImages.length > 0) {
      regeneratedText += ` Analizadas ${selectedImages.length} imágenes adicionales.`
    }
    
    onUpdate(finding.id, {
      currentText: regeneratedText,
      isEdited: false,
      status: 'pending',
      // Opcionalmente guardar el contexto usado
      regenerationContext: {
        textContext: context,
        imageIds: selectedImages,
        timestamp: new Date().toISOString()
      }
    })
    
    setIsRegenerating(false)
  }

  // Determine background based on status when showEditHistory is enabled
  const getBgColor = () => {
    if (!showEditHistory) return 'bg-card'
    if (finding.status === 'edited') return 'bg-emerald-50/50'
    if (finding.status === 'accepted') return 'bg-card'
    return 'bg-blue-50/30'
  }

  if (isEditing) {
    return (
      <div className={`rounded-lg border-l-4 ${statusColor}`}>
        <InlineEditor
          initialContent={finding.currentText}
          onSave={handleSave}
          onCancel={handleCancel}
          title={finding.organ}
        />
      </div>
    )
  }

  return (
    <>
      <div
        className={`group rounded-lg border border-border ${getBgColor()} transition-all hover:shadow-md border-l-4 ${statusColor}`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {image && (
                <ImageThumbnail image={image} organName={finding.organ} />
              )}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-medium text-foreground">{finding.organ}</h4>
                  <ConfidenceBadge
                    confidence={finding.confidence}
                    status={finding.status}
                    editedBy={finding.editedBy}
                    editedAt={finding.editedAt}
                  />
                </div>
              </div>
            </div>
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <FindingActions
                status={finding.status}
                isRegenerating={isRegenerating}
                onAccept={handleAccept}
                onEdit={handleEdit}
                onRegenerate={handleRegenerateClick}
                onDelete={onDelete} 
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm leading-relaxed text-foreground/90">
              <HighlightedText
                text={finding.currentText}
                abnormalValues={finding.abnormalValues}
                showHighlights={highlightValues}
              />
            </p>
          </div>

          {finding.isEdited && showEditHistory && (
            <DiffViewer
              originalText={finding.originalText}
              currentText={finding.currentText}
              editedBy={finding.editedBy}
            />
          )}
        </div>
      </div>

      <RegenerateDialog
        open={showRegenerateDialog}
        onOpenChange={setShowRegenerateDialog}
        onRegenerate={handleRegenerate}
        availableImages={availableImages}
        organName={finding.organ}
        isRegenerating={isRegenerating}
      />
    </>
  )
}