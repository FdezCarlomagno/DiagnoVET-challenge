'use client'

import { useState, useCallback } from 'react'
import { AppHeader } from '@/components/report/app-header'
import { ReportHeader } from '@/components/report/report-header'
import { PatientInfoCard } from '@/components/report/patient-info-card'
import { DiagnosisSection } from '@/components/report/diagnosis-section'
import { FindingsSection } from '@/components/report/findings-section'
import { ImageGallery } from '@/components/report/image-gallery'
import { Separator } from '@/components/ui/separator'
import { mockReport, type AIFinding, type Diagnosis, type Report } from '@/lib/mock-report-data'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { PDFPreview } from '@/components/report/pdf-preview'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function ReportViewerPage() {
  const [report, setReport] = useState<Report>(mockReport)
  const [pdfPreview, setPdfPreview] = useState<boolean>(false)

  const handleUpdateFinding = useCallback((id: string, updates: Partial<AIFinding>) => {
    setReport(prev => ({
      ...prev,
      findings: prev.findings.map(finding =>
        finding.id === id ? { ...finding, ...updates } : finding
      )
    }))

    if (updates.status === 'accepted') {
      toast.success('Hallazgo validado', {
        description: 'El hallazgo ha sido marcado como validado por el veterinario.'
      })
    } else if (updates.status === 'edited') {
      toast.success('Cambios guardados', {
        description: 'El hallazgo ha sido actualizado correctamente.'
      })
    }
  }, [])

  const handleUpdateDiagnosis = useCallback((updates: Partial<Diagnosis>) => {
    setReport(prev => ({
      ...prev,
      diagnosis: { ...prev.diagnosis, ...updates }
    }))

    if (updates.status === 'accepted') {
      toast.success('Diagnóstico validado', {
        description: 'El diagnóstico ha sido marcado como validado.'
      })
    } else if (updates.status === 'edited') {
      toast.success('Diagnóstico actualizado', {
        description: 'Los cambios han sido guardados.'
      })
    }
  }, [])

  // ✅ CORRECCIÓN: Ahora recibe el objeto completo del nuevo hallazgo
  const handleAddFinding = useCallback((newFinding: Omit<AIFinding, 'id'>) => {
    const finding: AIFinding = {
      ...newFinding,
      id: `finding-manual-${Date.now()}`, // Generate unique ID
    }

    setReport(prev => ({
      ...prev,
      findings: [...prev.findings, finding]
    }))

    toast.success('Hallazgo agregado', {
      description: `Se agregó el hallazgo para ${newFinding.organ}.`
    })
  }, [])

  // ✅ CORRECCIÓN: Eliminar del report state, no de un findings separado
  const handleDeleteFinding = useCallback((id: string) => {
    setReport(prev => ({
      ...prev,
      findings: prev.findings.filter(f => f.id !== id)
    }))

    toast.success('Hallazgo eliminado', {
      description: 'El hallazgo ha sido eliminado del reporte.'
    })
  }, [])

  const handlePrintPdf = async () => {
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('PDF generado', {
      description: 'El reporte PDF está listo para descargar.'
    })
  }

  const handleBack = () => {
    toast.info('Navegación', {
      description: 'Volviendo al listado de reportes...'
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />
      <ReportHeader
        patientName={report.patientInfo.name}
        species={report.patientInfo.species}
        breed={report.patientInfo.breed}
        date={report.patientInfo.date}
        onBack={handleBack}
        onPrintPdf={handlePrintPdf}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Switch
              id="show-changes"
              checked={pdfPreview}
              onCheckedChange={setPdfPreview}
            />
            <Label htmlFor="show-changes" className="text-sm cursor-pointer">
              Mostrar previsualización de PDF
            </Label>
          </div>
          
          {pdfPreview ? (
            <PDFPreview report={report} />
          ) : (
            <>
              <PatientInfoCard patient={report.patientInfo} />

              <Separator />

              <DiagnosisSection
                diagnosis={report.diagnosis}
                onUpdate={handleUpdateDiagnosis}
              />

              <Separator />

              <FindingsSection
                findings={report.findings}
                images={report.images}
                onUpdateFinding={handleUpdateFinding}
                onAddFinding={handleAddFinding}
                onDeleteFinding={handleDeleteFinding}
              />

              <Separator />

              <ImageGallery images={report.images} />
            </>
          )}
        </div>
      </main>

      <Toaster position="bottom-right" />
    </div>
  )
}