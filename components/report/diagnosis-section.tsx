'use client'

import { useState } from 'react'
import { Bot, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { InlineEditor } from './inline-editor'
import { FindingActions } from './finding-actions'
import { getConfidenceColor } from '@/lib/mock-report-data'
import type { Diagnosis } from '@/lib/mock-report-data'

interface DiagnosisSectionProps {
  diagnosis: Diagnosis
  onUpdate: (updates: Partial<Diagnosis>) => void
}

export function DiagnosisSection({ diagnosis, onUpdate }: DiagnosisSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const colors = getConfidenceColor(diagnosis.confidence)
  const percentage = Math.round(diagnosis.confidence * 100)

  const handleAccept = () => {
    onUpdate({ status: 'accepted' })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = (content: string) => {
    const newItems = content.split('\n')
      .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean)
    
    onUpdate({
      items: newItems,
      status: 'edited',
      originalItems: diagnosis.originalItems || diagnosis.items,
      editedBy: 'Dr. Usuario',
      editedAt: new Date().toLocaleString('es-ES')
    })
    setIsEditing(false)
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    onUpdate({
      items: [...diagnosis.items, 'Sospecha de proceso inflamatorio crónico'],
      status: 'pending',
      confidence: 0.89
    })
    setIsRegenerating(false)
  }

  const renderBadge = () => {
    if (diagnosis.status === 'accepted') {
      return (
        <Badge variant="outline" className="gap-1.5 border-emerald-300 bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-3 w-3" />
          Validado
        </Badge>
      )
    }
    if (diagnosis.status === 'edited') {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 border-blue-300 bg-blue-100 text-blue-800">
            <CheckCircle2 className="h-3 w-3" />
            Editado
          </Badge>
          <Badge variant="outline" className={`gap-1.5 ${colors.badge}`}>
            <Bot className="h-3 w-3" />
            AI {percentage}%
          </Badge>
        </div>
      )
    }
    return (
      <Badge variant="outline" className={`gap-1.5 ${colors.badge}`}>
        <Bot className="h-3 w-3" />
        AI {percentage}% confianza
      </Badge>
    )
  }

  if (isEditing) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Diagnóstico</h2>
        <InlineEditor
          initialContent={diagnosis.items.map(item => `• ${item}`).join('\n')}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          title="Diagnóstico"
        />
      </section>
    )
  }

  return (
    <section className="group space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Diagnóstico</h2>
      </div>

      <div className={`rounded-lg border ${
        diagnosis.status === 'pending' 
          ? 'border-cyan-300 bg-cyan-50/30' 
          : diagnosis.status === 'edited'
          ? 'border-blue-300 bg-blue-50/30'
          : 'border-emerald-300 bg-emerald-50/30'
      } p-5`}>
        <div className="flex items-start justify-between gap-4">
          {renderBadge()}

          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <FindingActions
              status={diagnosis.status}
              isRegenerating={isRegenerating}
              onAccept={handleAccept}
              onEdit={handleEdit}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {diagnosis.items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/60" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}