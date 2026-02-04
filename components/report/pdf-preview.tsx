'use client'

import Image from 'next/image'
import { type Report } from '@/lib/mock-report-data'

interface PDFPreviewProps {
  report: Report
}

export function PDFPreview({ report }: PDFPreviewProps) {
  const { patientInfo, diagnosis, findings, images } = report

  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-xl print:shadow-none">
      {/* Page wrapper with A4-like proportions */}
      <div className="px-12 py-10 space-y-8">
        
        {/* Header - Informe Ecográfico */}
        <div className="border-b-2 border-foreground pb-4">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Informe Ecográfico
          </h1>
        </div>

        {/* Patient Info Table */}
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-semibold text-foreground w-1/4">
                  Nombre:
                </td>
                <td className="px-4 py-2.5 text-foreground w-1/4">
                  {patientInfo.name}
                </td>
                <td className="px-4 py-2.5 font-semibold text-foreground w-1/4">
                  Fecha:
                </td>
                <td className="px-4 py-2.5 text-foreground w-1/4">
                  {patientInfo.date}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-semibold text-foreground">
                  Especie:
                </td>
                <td className="px-4 py-2.5 text-foreground">
                  {patientInfo.species}
                </td>
                <td className="px-4 py-2.5 font-semibold text-foreground">
                  Tutor:
                </td>
                <td className="px-4 py-2.5 text-foreground">
                  {patientInfo.tutor}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-semibold text-foreground">
                  Sexo:
                </td>
                <td className="px-4 py-2.5 text-foreground">
                  {patientInfo.sex}
                </td>
                <td className="px-4 py-2.5 font-semibold text-foreground">
                  Raza:
                </td>
                <td className="px-4 py-2.5 text-foreground">
                  {patientInfo.breed}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-semibold text-foreground">
                  Veterinario:
                </td>
                <td className="px-4 py-2.5 text-foreground">
                  {patientInfo.veterinarian}
                </td>
                <td className="px-4 py-2.5 font-semibold text-foreground">
                  Edad:
                </td>
                <td className="px-4 py-2.5 text-foreground">
                  {patientInfo.age}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-semibold text-foreground">
                  Tipo de Ecografía:
                </td>
                <td className="px-4 py-2.5 text-foreground" colSpan={3}>
                  {patientInfo.studyType}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Diagnóstico Section */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3 pb-2 border-b border-border">
            Diagnóstico
          </h2>
          <ul className="list-disc list-outside ml-6 space-y-1.5 text-sm text-foreground leading-relaxed">
            {diagnosis.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Hallazgos Section */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
            Hallazgos
          </h2>
          <div className="space-y-4 text-sm text-foreground leading-relaxed">
            {findings.map((finding) => (
              <p key={finding.id}>
                <span className="font-semibold">{finding.organ}:</span>{' '}
                {finding.currentText}
              </p>
            ))}
          </div>
        </section>

        {/* Images Section */}
        <section className="pt-4 border-t border-border">
          <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
            Imágenes del Estudio
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {images.map((image) => (
              <div key={image.id} className="space-y-2">
                <div className="relative aspect-[4/3] bg-muted rounded overflow-hidden border border-border">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.metadata}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {image.metadata}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Este informe fue generado con asistencia de inteligencia artificial y revisado por {patientInfo.veterinarian}.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            DiagnoVET - Plataforma de Diagnóstico Veterinario con IA
          </p>
        </footer>
      </div>
    </div>
  )
}
