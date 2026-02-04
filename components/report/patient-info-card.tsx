import type { PatientInfo } from '@/lib/mock-report-data'

interface PatientInfoCardProps {
  patient: PatientInfo
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <header className="w-full space-y-6  pb-8 print:border-b print:pb-6">
      {/* Group A: Primary Patient Identity */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 print:text-2xl">
          {patient.name}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-base text-slate-600 print:text-sm">
          <span>{patient.species}</span>
          <span className="text-slate-300" aria-hidden="true">•</span>
          <span>{patient.breed}</span>
          <span className="text-slate-300" aria-hidden="true">•</span>
          <span>{patient.age}</span>
          <span className="text-slate-300" aria-hidden="true">•</span>
          <span>{patient.sex}</span>
        </div>
      </section>

      {/* Group B & C: Study Context & Administrative metadata */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-3 print:grid-cols-3">
        
        {/* Study Context */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Estudio
          </p>
          <p className="text-sm font-semibold text-slate-800 leading-tight">
            {patient.studyType}
          </p>
          <p className="text-sm text-slate-600">
            {patient.date}
          </p>
        </div>

        {/* Responsibility: Veterinarian */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Médico Veterinario
          </p>
          <p className="text-sm font-medium text-slate-800">
            {patient.veterinarian}
          </p>
        </div>

        {/* Responsibility: Tutor */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Tutor
          </p>
          <p className="text-sm font-medium text-slate-800">
            {patient.tutor}
          </p>
        </div>
        
      </div>
    </header>
  )
}