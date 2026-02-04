'use client'

import { Brain, CheckCircle2, AlertTriangle, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ConfidenceBadgeProps {
  confidence: number
  status: 'pending' | 'accepted' | 'rejected' | 'edited'
  editedBy?: string
  editedAt?: string
}

export function ConfidenceBadge({
  confidence,
  status,
  editedBy,
  editedAt
}: ConfidenceBadgeProps) {
  // ✅ CORRECCIÓN: Si es manual (confidence = 1.0 sin AI), mostrar badge de manual
  const isManualEntry = confidence === 1.0 && status === 'accepted' && !editedBy?.includes('Dr.')
  
  // Si fue validado por el veterinario
  if (status === 'accepted' && !isManualEntry) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="gap-1 bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100">
              <CheckCircle2 className="h-3 w-3" />
              <span>Validado</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Este hallazgo ha sido validado por el veterinario</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Si fue editado manualmente
  if (status === 'edited' && editedBy) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="gap-1 bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100">
              <Edit className="h-3 w-3" />
              <span>Editado</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">Editado por {editedBy}</p>
              {editedAt && <p className="text-xs text-muted-foreground">{editedAt}</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // ✅ CORRECCIÓN: Si es entrada manual, mostrar badge especial
  if (isManualEntry) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="gap-1 bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-100">
              <Edit className="h-3 w-3" />
              <span>Hallazgo manual</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Este hallazgo fue agregado manualmente por el veterinario</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Badges de confianza AI (solo para hallazgos generados por AI)
  const getConfidenceBadge = () => {
    if (confidence >= 0.9) {
      return {
        icon: <Brain className="h-3 w-3" />,
        text: `AI ${Math.round(confidence * 100)}% confianza`,
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        tooltip: 'Alta confianza - Revisión recomendada'
      }
    }
    if (confidence >= 0.6) {
      return {
        icon: <AlertTriangle className="h-3 w-3" />,
        text: `AI ${Math.round(confidence * 100)}% confianza`,
        className: 'bg-amber-100 text-amber-800 border-amber-300',
        tooltip: 'Confianza media - Verificación necesaria'
      }
    }
    return {
      icon: <AlertTriangle className="h-3 w-3" />,
      text: `AI ${Math.round(confidence * 100)}% confianza`,
      className: 'bg-red-100 text-red-800 border-red-300',
      tooltip: 'Baja confianza - Revisión manual requerida'
    }
  }

  const badge = getConfidenceBadge()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`gap-1 hover:${badge.className} ${badge.className}`}>
            {badge.icon}
            <span>{badge.text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{badge.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}