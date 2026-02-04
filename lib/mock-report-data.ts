// Types for the AI-powered veterinary diagnostic report

export interface AbnormalValue {
  text: string
  value: number
  unit: string
  normalRange: [number, number]
}

export interface AIFinding {
  id: string
  organ: string
  confidence: number
  originalText: string
  currentText: string
  isEdited: boolean
  editedBy?: string
  editedAt?: string
  status: 'pending' | 'accepted' | 'rejected' | 'edited'
  linkedImageId: string
  abnormalValues?: AbnormalValue[]
    regenerationContext?: {  // ← Nuevo campo opcional
    textContext: string
    imageIds: string[]
    timestamp: string
  }
}

export interface PatientInfo {
  name: string
  species: string
  sex: string
  veterinarian: string
  studyType: string
  date: string
  tutor: string
  breed: string
  age: string
}

export interface Diagnosis {
  confidence: number
  items: string[]
  status: 'pending' | 'accepted' | 'edited'
  originalItems?: string[]
  editedBy?: string
  editedAt?: string
}

export interface StudyImage {
  id: string
  url: string
  type: 'ultrasound' | 'xray'
  metadata: string
}

export interface Report {
  id: string
  patientInfo: PatientInfo
  diagnosis: Diagnosis
  findings: AIFinding[]
  images: StudyImage[]
}

export const mockReport: Report = {
  id: "98facae1-e1d5-4029-829b-213be85b6676",
  patientInfo: {
    name: "Pony",
    species: "Felino",
    sex: "Hembra esterilizada",
    veterinarian: "Cardozo Guadalupe",
    studyType: "Abdominal",
    date: "13/11/2025",
    tutor: "Nieto",
    breed: "Común Europeo",
    age: "10 años"
  },
  diagnosis: {
    confidence: 0.95,
    items: [
      "Nódulos esplénicos múltiples",
      "Adrenomegalia bilateral con nódulo en glándula adrenal izquierda",
      "Linfadenomegalia gástrica",
      "Hernia inguinal"
    ],
    status: "pending"
  },
  findings: [
    {
      id: "finding-1",
      organ: "Hígado",
      confidence: 0.92,
      originalText: "Parénquima homogéneo. Textura levemente granular. Contorno liso y regular, delineado por una fina cápsula hiperecogénica. La porción caudo ventral no sobrepasa el fundus gástrico. Las venas hepáticas se aprecian fácilmente en el parénquima hepático como estructuras anecogénicas tubulares. Las venas portales se diferencian de las venas sistémicas en el parénquima por sus paredes hiperecogénicas.",
      currentText: "Parénquima homogéneo. Textura levemente granular. Contorno liso y regular, delineado por una fina cápsula hiperecogénica. La porción caudo ventral no sobrepasa el fundus gástrico. Las venas hepáticas se aprecian fácilmente en el parénquima hepático como estructuras anecogénicas tubulares. Las venas portales se diferencian de las venas sistémicas en el parénquima por sus paredes hiperecogénicas.",
      isEdited: false,
      status: "pending",
      linkedImageId: "img-1"
    },
    {
      id: "finding-2",
      organ: "Vesícula Biliar",
      confidence: 0.67,
      originalText: "Distención media por contenido anecoico, con un volumen de 6.61 cm³. Pared fina y lisa. Mide 41.54 mm x 15.70 mm x 19.35 mm.",
      currentText: "Distención media por contenido anecoico, con un volumen de 6.61 cm³. Pared fina y lisa. Mide 41.54 mm x 15.70 mm x 19.35 mm.",
      isEdited: false,
      status: "pending",
      linkedImageId: "img-1",
      abnormalValues: [
        {
          text: "6.61 cm³",
          value: 6.61,
          unit: "cm³",
          normalRange: [2.0, 5.0]
        }
      ]
    },
    {
      id: "finding-3",
      organ: "Bazo",
      confidence: 0.88,
      originalText: "De topografía habitual. Espesor de 10.95 mm, conservado, contornos regulares y márgenes preservados. Parénquima de ecotextura homogénea de grano fino.",
      currentText: "De topografía habitual. Espesor de 11.05 mm, conservado, contornos regulares y márgenes preservados. Parénquima de ecotextura homogénea de grano fino. Se observan múltiples lesiones nodulares hipoecoicas, de contornos definidos, que miden entre 2.91 mm y 8.69 mm. Arquitectura vascular preservada.",
      isEdited: true,
      editedBy: "Dr. Cardozo",
      editedAt: "13/11/2025 10:25",
      status: "edited",
      linkedImageId: "img-2",
      abnormalValues: [
        {
          text: "11.05 mm",
          value: 11.05,
          unit: "mm",
          normalRange: [8.0, 10.0]
        },
        {
          text: "2.91 mm",
          value: 2.91,
          unit: "mm",
          normalRange: [0, 3.0]
        },
        {
          text: "8.69 mm",
          value: 8.69,
          unit: "mm",
          normalRange: [0, 3.0]
        }
      ]
    },
    {
      id: "finding-4",
      organ: "Estómago",
      confidence: 0.91,
      originalText: "Distendido, presenta contenido líquido abundante, adecuado peristaltismo y paredes de espesor levemente engrosado (4.69 mm en porción evaluada) que conservan estratificación mural.",
      currentText: "Distendido, presenta contenido líquido abundante, adecuado peristaltismo y paredes de espesor levemente engrosado (4.69 mm en porción evaluada) que conservan estratificación mural.",
      isEdited: false,
      status: "accepted",
      linkedImageId: "img-2",
      abnormalValues: [
        {
          text: "4.69 mm",
          value: 4.69,
          unit: "mm",
          normalRange: [2.0, 4.0]
        }
      ]
    },
    {
      id: "finding-5",
      organ: "Intestino Delgado",
      confidence: 0.85,
      originalText: "Peristaltismo adecuado en asas delgadas evaluadas con estratificación mural preservada, con carga mucosa a gaseosa intra luminal. Duodeno de 4.01 mm, yeyuno de espesor mural conservado.",
      currentText: "Peristaltismo adecuado en asas delgadas evaluadas con estratificación mural preservada, con carga mucosa a gaseosa intra luminal. Duodeno de 4.01 mm, yeyuno de espesor mural conservado.",
      isEdited: false,
      status: "pending",
      linkedImageId: "img-3",
      abnormalValues: [
        {
          text: "4.01 mm",
          value: 4.01,
          unit: "mm",
          normalRange: [2.5, 3.5]
        }
      ]
    },
    {
      id: "finding-6",
      organ: "Intestino Grueso",
      confidence: 0.89,
      originalText: "Colon presentó grosor de pared de 0.76 mm en región evaluada, con contenido fecal sólido en región descendente. Ciego presenta un espesor mural conservado.",
      currentText: "Colon presentó grosor de pared de 0.76 mm en región evaluada, con contenido fecal sólido en región descendente. Ciego presenta un espesor mural conservado.",
      isEdited: false,
      status: "pending",
      linkedImageId: "img-3"
    },
    {
      id: "finding-7",
      organ: "Páncreas",
      confidence: 0.94,
      originalText: "Ecoestructura normal. Espesor 6.52 mm por 13.48 mm, normal.",
      currentText: "Ecoestructura normal. Espesor 6.52 mm por 13.48 mm, normal.",
      isEdited: false,
      status: "accepted",
      linkedImageId: "img-2"
    },
    {
      id: "finding-8",
      organ: "Riñón Izquierdo",
      confidence: 0.90,
      originalText: "Tamaño 46.51 mm por 27.53 mm, conservado. Con contornos regulares. Corteza de ecotextura homogénea de grano fino. Relación cortico medular conservada. Diferenciación cortico medular normal. Pelvis renal conservada.",
      currentText: "Tamaño 46.51 mm por 27.53 mm, conservado. Con contornos regulares. Corteza de ecotextura homogénea de grano fino. Relación cortico medular conservada. Diferenciación cortico medular normal. Pelvis renal conservada.",
      isEdited: false,
      status: "pending",
      linkedImageId: "img-4",
      abnormalValues: [
        {
          text: "46.51 mm",
          value: 46.51,
          unit: "mm",
          normalRange: [30.0, 45.0]
        }
      ]
    },
    {
      id: "finding-9",
      organ: "Riñón Derecho",
      confidence: 0.91,
      originalText: "Tamaño 45.16 mm por 29.41 mm, conservado. Con contornos regulares. Corteza de ecotextura homogénea de grano fino. Relación cortico medular conservada. Diferenciación cortico medular normal. Pelvis renal conservada.",
      currentText: "Tamaño 45.16 mm por 29.41 mm, conservado. Con contornos regulares. Corteza de ecotextura homogénea de grano fino. Relación cortico medular conservada. Diferenciación cortico medular normal. Pelvis renal conservada.",
      isEdited: false,
      status: "pending",
      linkedImageId: "img-4",
      abnormalValues: [
        {
          text: "45.16 mm",
          value: 45.16,
          unit: "mm",
          normalRange: [30.0, 45.0]
        },
        {
          text: "29.41 mm",
          value: 29.41,
          unit: "mm",
          normalRange: [20.0, 28.0]
        }
      ]
    },
    {
      id: "finding-10",
      organ: "Glándulas Adrenales",
      confidence: 0.72,
      originalText: "Adrenal izquierda aumentada de tamaño con nódulo de 8.2 mm. Adrenal derecha de tamaño conservado.",
      currentText: "Adrenal izquierda aumentada de tamaño con nódulo de 8.2 mm. Adrenal derecha de tamaño conservado.",
      isEdited: false,
      status: "pending",
      linkedImageId: "img-3",
      abnormalValues: [
        {
          text: "8.2 mm",
          value: 8.2,
          unit: "mm",
          normalRange: [3.0, 6.0]
        }
      ]
    },
    {
      id: "finding-11",
      organ: "Vejiga",
      confidence: 0.96,
      originalText: "Distendida con contenido anecoico. Paredes finas y lisas. Sin sedimento ni masas intraluminales.",
      currentText: "Distendida con contenido anecoico. Paredes finas y lisas. Sin sedimento ni masas intraluminales.",
      isEdited: false,
      status: "accepted",
      linkedImageId: "img-4"
    }
  ],
  images: [
    {
      id: "img-1",
      url: "/images/image5.png",
      type: "ultrasound",
      metadata: "Hígado / Vesícula - Vista sagital"
    },
    {
      id: "img-2",
      url: "/images/image2.png",
      type: "ultrasound",
      metadata: "Bazo / Estómago - Vista transversal"
    },
    {
      id: "img-3",
      url: "/images/image3.png",
      type: "ultrasound",
      metadata: "Intestino / Adrenales - Vista coronal"
    },
    {
      id: "img-4",
      url: "/images/image4.png",
      type: "ultrasound",
      metadata: "Riñones / Vejiga - Vista longitudinal"
    }
  ]
}

// Helper functions for confidence colors
export const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  }
  if (confidence >= 0.6) return {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-300'
  }
  return {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800 border-red-300'
  }
}

export const getStatusColor = (status: AIFinding['status']) => {
  switch (status) {
    case 'accepted':
      return 'border-l-emerald-500'
    case 'edited':
      return 'border-l-blue-500'
    case 'rejected':
      return 'border-l-red-500'
    default:
      return 'border-l-amber-400'
  }
}
