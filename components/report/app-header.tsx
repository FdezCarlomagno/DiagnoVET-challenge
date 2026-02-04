'use client'

import { PawPrint, Eye, Plus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


interface AppHeaderProps {
  userName?: string
  orgName?: string
}

export function AppHeader({ userName = 'Nicolas Alborno', orgName = 'DIAGNOVET' }: AppHeaderProps) {
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-23 w-23 items-center justify-center rounded-lg">
            <img src="diagnoVET-logo.png" alt="DiagnoVET Logo" />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Mis Estudios</span>
          </Button>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Reporte</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left sm:flex">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">{orgName}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Mi Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
