'use client'

import { CheckCircle, Edit, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FindingActionsProps {
  status: 'pending' | 'accepted' | 'rejected' | 'edited'
  isRegenerating: boolean
  onAccept: () => void
  onEdit: () => void
  onRegenerate: () => void
  onDelete?: () => void  // ← Nueva prop opcional
}

export function FindingActions({
  status,
  isRegenerating,
  onAccept,
  onEdit,
  onRegenerate,
  onDelete
}: FindingActionsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {status !== 'accepted' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAccept}
                className="h-8 gap-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Aceptar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Validar hallazgo</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 gap-1.5 hover:bg-muted"
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Editar manualmente</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="h-8 gap-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isRegenerating ? 'Regenerando...' : 'Regenerar'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Regenerar con IA</TooltipContent>
        </Tooltip>

        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Eliminar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Eliminar hallazgo</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}