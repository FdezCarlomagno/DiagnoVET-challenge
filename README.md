# DiagnoVET UI Engineer Challenge — Technical Analysis & Design Rationale

**Candidate:** Valentín F. Carlomagno  
**Date:** February 2026  
**Challenge Duration:** 72 hours  
**Repository:** [GitHub Link]  
**Live Demo:** [Vercel Link]  
**Demo Video:** [Loom Link - 5min walkthrough]

---

## Executive Summary

After analyzing the DiagnoVET platform videos, I identified a **critical AI-to-UI workflow breakdown** in the report validation screen that directly undermines the product's core value proposition: reducing diagnostic report time from 45 minutes to 5 minutes.

While the AI model produces high-quality diagnostic content in ~45 seconds, **systematic UX issues in the report visualization interface** prevent veterinarians from efficiently validating and finalizing outputs. The current design forces a binary trust decision—accept everything blindly or manually re-validate every line—transforming a promised 5-minute workflow into a 15-20 minute reality.

**My prototype addresses this through five key improvements:**

1. **AI confidence transparency** — Visual hierarchy showing high/medium/low confidence per finding
2. **Visual provenance linking** — Direct image ↔ finding connections with enhanced image viewer
3. **Clear data highlighting system** — Separate controls for value highlighting and edit history
4. **WYSIWYG edit/preview toggle** — Switch between interactive edit mode and PDF preview
5. **Context-aware regeneration** — Guide AI with clinical context and additional images without destructive workflows

**Expected Impact:**
- Reduce validation time from ~15-20 minutes to ~5-8 minutes (60% improvement)
- Increase veterinarian trust through transparent AI reasoning
- Enable granular edits without monolithic text area editing
- Eliminate destructive regeneration workflows that waste time and lose content

This document explains why I prioritized this screen, the design decisions behind each improvement, and the broader UX improvement roadmap for DiagnoVET.

---

## Why the AI Report Visualization Screen Is Mission-Critical

### The Core AI-to-UI Workflow Problem

DiagnoVET's value proposition is elegantly simple:
```
AI generates report (45s) + Vet validates (5min) = 6min total
vs. Manual writing (45min)
```

However, the current reality is:
```
AI generates report (45s) + Vet re-validates everything (15-20min) = ~20min total
```

**The bottleneck isn't the AI model—it's the UI that surfaces AI output.**

### Current Workflow Analysis

**What veterinarians actually do today:**

1. **Read entire AI-generated report** (~4-6 minutes)
   - All findings appear in monolithic text areas grouped by section (all findings in one block)
   - No visual cues about AI confidence levels
   - No indication of which findings need attention
   
2. **Mentally validate each finding against images** (~5-8 minutes)
   - Images displayed separately at bottom of report
   - Must scroll and mentally map which image supports which finding
   - No visual connection between findings and source images
   
3. **Edit sections if needed** (~2-4 minutes)
   - Can click to edit sections inline (this works well)
   - **BUT: All findings within a section are in one text area**
   - Cannot edit individual findings—must edit entire block
   - Example: To fix one liver finding, must edit all liver findings together
   
4. **If regeneration needed** (~2-5 minutes wasted)
   - Must navigate **back to generation screen**
   - Entire report regenerates (45s)
   - **All sections regenerate**, not just the problematic one
   - Risk losing good content in other sections
   - Must re-validate everything again

**Total: 15-20 minutes** (4x slower than promised)

### Why This Happens: The AI Transparency & Granularity Gap

The current UI has two fundamental problems:

**Problem 1: Lack of AI Transparency**
- All findings appear uniform—no distinction between high-confidence (95%) and low-confidence (60%)
- No visual connection between findings and source images
- Unclear what red highlighting means (specific data? errors? warnings?)

**Problem 2: Lack of Editing Granularity**
- Findings grouped in monolithic text areas per section
- Cannot edit one finding without editing entire section
- Cannot regenerate one finding without regenerating entire report
- Must navigate away from report to trigger regeneration

This **forces veterinarians into inefficient workflows:**
> "Do I trust all findings blindly (risky), or do I manually re-validate and edit everything in bulk (slow)?"

The answer is always: re-validate everything and edit in bulk. **The UI removes selective validation and targeted iteration as options.**

### The AI-to-UI Workflow Principle

**Core insight:** 
> AI systems don't just need to be accurate—they need to communicate their certainty, show their reasoning, and empower granular human oversight.

The best AI-powered products don't hide the AI; they **surface AI confidence and provenance transparently**, enabling users to:
1. **Trust high-confidence outputs** (fast acceptance)
2. **Focus attention on uncertain areas** (selective validation)
3. **Understand AI reasoning** (verify conclusions against evidence)
4. **Maintain control** (edit at finding-level granularity)
5. **Guide AI iteratively** (provide context for targeted regeneration)

**Examples of AI transparency done right:**
- **Grammarly:** Shows confidence levels per suggestion; can accept/reject individually
- **GitHub Copilot:** Displays multiple suggestions; granular accept/reject per suggestion
- **ChatGPT:** Shows reasoning process; can regenerate specific parts of response
- **Notion AI:** Clearly marks AI-generated vs. human-edited content; granular editing

DiagnoVET's current UI lacks all of these patterns.

---

## Five Key Improvements Implemented

### 1. AI Confidence Visual System

**Problem Identified:**
The current report shows all findings with uniform formatting in grouped text areas. There's no indication of which findings the AI is confident about versus which ones require careful human review. This forces veterinarians to validate everything equally, eliminating the efficiency gains AI should provide.

**Solution Design:**
Break findings into individual cards with visual confidence badges:

```
High confidence (90-100%):
  → Green badge "AI 95%"
  → Light background tint
  → Minimal review needed

Medium confidence (60-89%):
  → Yellow badge "AI 67% - Verificar"
  → Yellow-tinted background
  → Verification recommended

Low confidence (<60%):
  → Red badge "AI 45% - Revisar"
  → Red-tinted background
  → Manual review required
```

**Why This Works:**
- **Instant visual prioritization:** Eyes naturally drawn to yellow/red warnings
- **Honest AI:** System admits uncertainty instead of hiding it
- **Respects clinical expertise:** Veterinarian makes final call on uncertain findings
- **Reduces cognitive load:** High-confidence findings can be quickly accepted
- **Granular structure:** Each finding is its own card, not buried in a text area

**Real-world impact:**
Veterinarians can scan 11 findings in 30 seconds, identify 2 low-confidence items, and focus validation effort only where needed—instead of spending 5-8 minutes re-validating everything in monolithic text blocks.

**UX Principle Applied:** *Visibility of system status (Nielsen #1)*

---

### 2. Visual Provenance & Enhanced Image Viewer

**Problem Identified:**
In the current UI, images are displayed separately at the bottom of the report with no visual connection to the findings they support. Veterinarians must:
- Read a finding (e.g., "Vesícula Biliar: Distención media con volumen de 6.61 cm³")
- Scroll down to the images section
- Mentally figure out which of 4-11 images corresponds to that finding
- Scroll back up to continue reading
- Repeat for every finding they want to validate

This breaks the clinical reasoning flow and adds significant cognitive overhead.

**Solution Design:**
Direct linking system with enhanced image carousel:

**Image thumbnails in findings:**
- Each finding card shows inline thumbnail of its source image
- Hover on finding → visual highlight on thumbnail
- Click thumbnail → open full-size viewer at that specific image

**Enhanced image carousel viewer:**
- Full-screen DICOM image viewer with zoom/pan controls
- Navigate between all study images with arrow keys and buttons
- Image metadata overlay (series name, view type, measurements)
- Smooth carousel navigation between images

**Why This Works:**
- **Eliminates mental mapping:** No need to remember "which image was this?"
- **Enables instant validation:** One click to verify AI's visual reasoning
- **Makes AI reasoning transparent:** Direct visual proof of diagnostic conclusions
- **Clinical mental model:** Image → Observation → Finding (natural reasoning flow)
- **Better image inspection:** Full DICOM viewer vs. small thumbnails at page bottom

**Technical implementation concept:**
```
Finding card structure:
  - ImageThumbnail (clickable, shows preview)
  - FindingText (displays description)
  - When clicked → ImageViewer modal opens to that specific image
  
ImageViewer modal:
  - Full-screen DICOM display
  - Left/Right arrow navigation
  - Zoom controls (100%, fit, fill)
  - Image metadata overlay
  - Smooth carousel transitions
```

**Real-world impact:**
Instead of scrolling down, finding the right image among 4-11 images, scrolling back up, and trying to remember what you saw—veterinarians now click once and see the exact source image in context. Validation time per finding drops from ~45 seconds to ~10 seconds.

**UX Principle Applied:** *Recognition rather than recall (Nielsen #6)*

---

### 3. Clear Data Highlighting System

**Problem Identified:**
The current UI has a "Mostrar cambios" toggle that highlights certain text fragments in red. However, this creates significant user confusion:

**What the toggle actually does:**
- Highlights specific data points in red (measurements, volumes, specific observations)
- These are quantitative values or specific findings that the veterinarian added or adjusted based on what they saw in images
- Examples: gallbladder volume, exact measurements, content descriptions (anecoic, fecal), concrete numerical values

**What users think it does:**
- "Is this highlighting anomalies?"
- "Is this dangerous information?"
- "Did the AI detect these as problems?"
- "Is this a warning?"

**The fundamental UX problem:**
- The toggle says "Show changes" but doesn't explain changes relative to what
- Doesn't explain who made these changes
- Doesn't explain why they're marked in red
- Users activate the toggle, see red highlighting, and enter a state of uncertainty

**Solution Design:**
Split into two independent, semantically clear controls with explicit purposes:

**Control 1: "Resaltar valores" (Value Highlighting)**
- Icon: Highlighter
- Always visible
- Purpose: Highlight quantitative data and specific clinical observations added by the veterinarian
- Visual treatment: Red highlighting for specific data points (measurements, volumes)
- Clear label and tooltip: "Resalta datos cuantitativos y hallazgos específicos agregados durante el análisis"
- Independent of editing state

**Control 2: "Historial de edición" (Edit History)**
- Icon: FileCheck
- Only visible when edited findings exist
- Purpose: Show/hide DiffViewer comparing original AI text vs. doctor's subsequent edits
- Shows attribution: "Editado por Dr. [Name] el [date]"
- Displays side-by-side comparison of before/after text
- Independent of value highlighting

**Why This Works:**
- **Single responsibility principle:** Each control does exactly one thing
- **Semantic clarity:** Icons + labels + tooltips explain purpose instantly
- **Eliminates confusion:** Users understand what red highlighting means (specific data, not errors/warnings)
- **Conditional visibility:** Edit history only appears when relevant
- **Reduced cognitive load:** No ambiguity about what each toggle controls

**Visual design:**
```
[Highlighter icon] Resaltar valores     [ON/OFF switch]
Tooltip: "Resalta datos cuantitativos y hallazgos específicos agregados durante el análisis"

[FileCheck icon] Historial de edición     [ON/OFF switch]
Tooltip: "Muestra cambios editoriales realizados (2 hallazgos editados)"
(Only visible when editedFindingsCount > 0)
```

**Real-world impact:**
Veterinarians now understand exactly what each control does. The red highlighting is no longer ambiguous—it clearly marks the specific clinical data they added. Edit history shows their editorial changes separately. No confusion, no unexpected behavior.

**UX Principle Applied:** *Clear affordances + Aesthetic and minimalist design (Nielsen #8)*

---

### 4. WYSIWYG Edit/Preview Toggle

**Problem Identified:**
The current UI allows inline editing of sections, which is good. However, there's a fundamental structural issue:

**Current editing limitations:**
- Can click to edit sections inline ✓
- **BUT: All findings within a section are grouped in one text area**
- Cannot edit individual findings—must edit entire section block
- Example: To fix one gallbladder finding, must edit the entire "Hallazgos" block containing all organs
- This makes precise edits cumbersome and error-prone

**Missing capabilities:**
- No AI confidence badges to guide which findings need attention
- No per-finding action buttons (Accept, Edit, Regenerate)
- No image linking to verify individual findings
- No structured card layout—just monolithic text areas

**Solution Design:**
Toggle between two distinct modes that solve these problems:

**Edit/Analysis Mode (Default):**
- **Structured findings displayed as individual cards** (one per organ/area)
- AI confidence badges visible on each finding card
- Image thumbnails linked to each finding card
- **Granular inline editing** (click to edit individual findings, not entire sections)
- Action buttons per finding: Accept, Edit, Regenerate
- Interactive controls for data highlighting and edit history

**PDF Preview Mode:**
- WYSIWYG display of final report layout
- Shows exactly how the PDF export will render
- Professional report formatting (letterhead, digital signature, page breaks)
- Read-only view (no editing controls visible)
- No AI confidence badges (these are for veterinarian guidance, not client-facing)
- Clean, client-ready presentation

**Toggle implementation:**
```
[Icon: Document] Mostrar previsualización de PDF  [ON/OFF switch]

When ON (PDF Preview Mode):
  → Report transforms to PDF-style layout
  → Confidence badges hidden
  → Action buttons hidden
  → Professional typography applied
  → Shows letterhead and signature
  
When OFF (Edit/Analysis Mode):
  → Structured finding cards (not monolithic text areas)
  → Confidence badges visible per finding
  → Image linking active per finding
  → Granular inline editing enabled per finding
```

**Why This Works:**
- **Eliminates monolithic editing:** Edit one finding without touching others
- **WYSIWYG principle:** See exactly what client will receive before exporting
- **Maintains context:** No mental reset from switching screens
- **Professional confidence:** Ensure report looks polished before final export
- **Granular control:** Per-finding actions instead of section-level bulk editing

**Real-world impact:**
Veterinarians can edit specific findings precisely (e.g., just the gallbladder finding) instead of editing an entire organ systems block. Toggle to preview mode to check formatting. Toggle back to make targeted adjustments—all without monolithic text area editing.

**UX Principle Applied:** *What You See Is What You Get (WYSIWYG) + User control and freedom (Nielsen #3)*

---

### 5. Context-Aware AI Regeneration

**Problem Identified:**
The current regeneration workflow has a critical flaw that wastes massive time and destroys good content:

**How regeneration works now:**
1. Veterinarian reviews AI-generated report
2. Inline editing exists and works for manual corrections ✓
3. **BUT: If they want AI to regenerate a specific section (e.g., Diagnosis is too vague):**
   - Must navigate **back to the generation screen**
   - Modify inputs or add notes
   - Click "Regenerar"
   - Wait 45 seconds while **entire report regenerates from scratch**
   - **All sections change**, not just the problematic one
   - Review everything again because all content is different
   - Discover that while Diagnosis improved, other previously good sections changed for the worse
   - Repeat the cycle 2-3 more times trying to get everything right simultaneously

**Core problems:**
- **Destructive workflow:** Cannot regenerate one section/finding without regenerating all
- **No context injection:** Cannot guide AI toward specific clinical considerations
- **No image selection:** Cannot tell AI to analyze additional images for that specific finding
- **Time waste:** 45 seconds per iteration × 3-5 iterations = 2-4 minutes wasted
- **Frustrating:** Like playing whack-a-mole—fix one thing, break another
- **Navigation overhead:** Leave report screen, wait for generation, return to review

**Solution Design:**
Modal dialog for targeted, context-aware regeneration at the finding level:

**Regeneration dialog components:**

**1. Clinical context text input:**
```
Textarea for additional guidance:
  "Ej: El paciente presenta antecedentes de hipertensión arterial.
   Considerar posible cardiomegalia..."
  
Purpose: Guide AI to consider specific clinical factors
```

**2. Additional image selection:**
```
Grid of all available study images:
  → Click to select/deselect multiple images
  → Visual indication: purple border + checkmark on selected
  → Counter: "2 seleccionadas"
  
Purpose: Reference additional images AI should analyze for this specific finding
```

**3. Context summary preview:**
```
Shows what will be sent to AI:
  "Contexto que se enviará a la IA:
   - Texto: [user's clinical context]
   - Imágenes adicionales: [thumbnails of selected images]"
```

**Why This Works:**
- **Surgical regeneration:** Only regenerate one finding, preserving all others
- **Stay on same screen:** No navigation back to generation screen
- **AI guidance:** Veterinarian provides clinical expertise to improve AI output
- **Multi-modal input:** Reference additional images for more comprehensive analysis
- **Non-destructive:** Other findings remain untouched
- **Iterative improvement:** Guide AI toward better results instead of hoping randomness works
- **Complements inline editing:** Use inline editing for manual fixes, regeneration for AI improvements

**Technical flow concept:**
```
User clicks "Regenerar" button on a specific finding card
  ↓
Modal opens showing:
  - Clinical context textarea
  - Grid of all study images for selection
  - Summary of what will be sent to AI
  ↓
User provides context + selects additional images
  ↓
Click "Regenerar con IA"
  ↓
API call with enhanced payload:
  {
    findingId: "vesícula-biliar",
    clinicalContext: "Paciente con antecedentes de colecistitis",
    additionalImageIds: ["img-5", "img-8"],
    preserveOtherFindings: true
  }
  ↓
AI regenerates ONLY that specific finding with new context
  ↓
Preview shows: [Original text] vs [Regenerated text]
  ↓
User accepts or rejects the regeneration
```

**Real-world impact:**
Instead of:
- Navigate back to generation screen
- 3-5 full report regenerations (45s each) = 2-4 minutes wasted
- Risk of losing good content in other sections
- Frustration from iterative guessing

Veterinarians now:
- Stay on report screen
- Regenerate one finding with context (10s)
- Provide clinical guidance for better results
- Preserve all other good content
- Get it right in 1-2 attempts instead of 5

**Savings: ~2-3 minutes per report + significantly reduced frustration + no navigation overhead**

**UX Principle Applied:** *AI prompt engineering through UI affordances + Human-in-the-loop design + User control and freedom (Nielsen #3)*

---

## Expected Impact & Success Metrics

### Quantitative Improvements

**Time savings per report:**
| Task | Before | After | Improvement |
|------|--------|-------|-------------|
| Initial scan | 4-6 min | 1-2 min | 66% faster |
| Validation | 5-8 min | 2-3 min | 60% faster |
| Editing | 2-4 min | 1-2 min | 50% faster |
| Iteration/Regeneration | 2-5 min | 0-1 min | 80% faster |
| **Total** | **15-20 min** | **5-8 min** | **60% reduction** |

**Iteration efficiency:**
- Before: Navigate away + 3-5 full report regenerations (45s each) = 2-4 min wasted + context switching
- After: Stay on screen + 1-2 targeted finding regenerations with context (10s each) = 10-20s total

**AI acceptance rate:**
- Before: ~60% (heavy editing due to lack of trust, unclear confidence, monolithic editing)
- After: ~85% (higher trust through transparency + granular control + context guidance)

### Qualitative Improvements

**Trust:**
- Veterinarians can see and verify AI reasoning through image links
- Confidence levels set appropriate expectations
- Transparency builds long-term product trust

**Control:**
- **Granular editing:** Edit one finding without touching others (vs. monolithic text area)
- **Surgical regeneration:** Regenerate one finding without affecting others
- Guide AI with clinical expertise through context
- Clear preview of final output before export
- Toggle between edit and preview modes without leaving screen

**Efficiency:**
- Focus attention where it matters (low-confidence areas highlighted in red/yellow)
- Skip obvious high-confidence findings
- Eliminate navigation overhead to generation screen
- Reduce regeneration cycles from 5 to 1-2
- Edit at finding-level granularity vs. section-level bulk

**Clinical Accuracy:**
- Better image-finding correlation through visual linking
- Context-aware regeneration improves diagnostic precision
- Clear distinction between AI-generated content and veterinarian's specific data points
- Granular editing reduces risk of accidental changes to good content

---

## Other Critical UX Issues Identified (Priority-Ordered)

While I focused on the report viewer, comprehensive analysis revealed 11 additional friction points across the platform:

### 🔴 CRITICAL PRIORITY

#### **Issue #3: Language Selection Buried in Settings** (Account Screen)
**Impact:** Blocks international expansion  
**Effort:** Low (1-2 days)  
**Fix:** Move language switcher to global navbar  
**Why critical:** If UI loads in unfamiliar language, users cannot recover. Classic i18n anti-pattern that creates catastrophic first-use experiences for non-Spanish speakers.

#### **Issue #4: Digital Signature Undervalued** (Account Screen)
**Impact:** Legal liability risk  
**Effort:** Medium (3-5 days)  
**Fix:** Elevate to "Critical Setup" component with status indicator, preview, and validation  
**Why critical:** Unsigned reports may not be legally valid in veterinary practice. This isn't just bad UX—it's a liability risk that could undermine professional credibility.

---

### 🟡 HIGH PRIORITY

#### **Issue #5: Destructive Full-Report Regeneration** (Report Generation Screen)
**Impact:** Wastes ~90 seconds per iteration + risks losing good content  
**Effort:** High (backend changes required, 1-2 weeks)  
**Fix:** Section-level regeneration with comparison preview (my prototype addresses this at finding level)

**Current workflow:**
```
1st gen: Diagnosis vague → navigate back + regenerate entire report (45s)
2nd gen: Diagnosis better, but Hallazgos changed → regenerate entire report (45s)
3rd gen: Hallazgos fixed, but now Diagnosis changed again → regenerate (45s)
Total wasted: ~90s + multiple navigation switches + context loss + frustration
```

**Why this matters:**
My context-aware regeneration feature solves this at the finding level, allowing surgical regeneration without leaving the report screen. Full implementation would require backend support for partial regenerations.

---

#### **Issue #6: Study Intake Form Cognitive Overload** (Report Creation Screen)
**Impact:** Increases data entry errors, slows case creation  
**Effort:** High (workflow redesign, 1-2 weeks)  
**Fix:** Multi-stage wizard with progressive disclosure  

**Problem:** 
Form demands two incompatible cognitive tasks simultaneously:
- **Clinical data entry** (semantic, precision-driven)
- **Image management** (visual, spatial, order-dependent)

**Solution — Multi-stage wizard:**
```
Stage 1: Patient Information (auto-filled from DICOM when possible)
  ↓
Stage 2: Image Upload & Organization
  ↓
Stage 3: Clinical Context (optional notes)
  ↓
Stage 4: Review & Generate (confirmation before AI processing)
```

**Why this matters:**
> "AI quality does not start at diagnosis generation. It starts at data intake."

If this screen introduces errors or fatigue, the AI cannot succeed. Separating cognitive tasks reduces mental load and increases data quality.

---

#### **Issue #7: Manual Data Entry Despite DICOM Metadata** (Report Creation Screen)
**Impact:** Wastes 2-3 min per case  
**Effort:** Medium (DICOM parsing library, 3-5 days)  
**Fix:** Auto-extract DICOM metadata, pre-fill form  

**DICOM images already contain:**
- Patient Name
- Patient Birth Date (can calculate age)
- Study Date
- Study Description
- Performing Physician
- Modality (US, CR, CT)

**Implementation concept:**
```
On image upload:
  → Parse DICOM headers
  → Extract patient/study metadata
  → Pre-fill form fields
  → Show toast: "Datos extraídos de DICOM. Revisa y confirma."
  → Allow veterinarian to review/correct vs. type from scratch
```

**Why this matters:**
Reduces manual typing from 2-3 minutes to 15-30 seconds (review time). Prevents human error (wrong age, misspelled names). Aligns with expectations of "AI-powered automation."

---

#### **Issue #8: Image Organization Controls** (Report Creation Screen)
**Impact:** Potentially reduces image inspection quality  
**Effort:** Low (2-3 days)  
**Status:** Unclear if this is already implemented  

**Potential problem observed:**
In one video, the system displayed a message: "Tienes muchas imágenes. El grid se ajusta automáticamente." This suggests automatic layout adjustment, but it's unclear if manual controls exist.

**If controls are missing, recommended features:**
- Grid size selection (2/3/4 columns)
- Drag-and-drop reordering
- Alternative view modes (grid, list, carousel)
- Sort options (upload order, filename, DICOM timestamp)

**Why this matters:**
Medical images contain critical visual details. Order and grouping often matter for anatomical reasoning (e.g., grouping all liver views together). If automatic layout is the only option, veterinarians should have manual override capability.

---

#### **Issue #9: Potentially Missing Confirmation Dialogs** (Report Creation Screen)
**Impact:** Risk of accidental data loss  
**Effort:** Trivial (1-2 hours if not implemented)  
**Status:** Assuming not implemented based on video analysis  

**Observed concern:**
A "Limpiar" (Clear) button exists near the primary "Continuar" action. It's unclear if there's a confirmation dialog preventing accidental clicks.

**If confirmation is missing, recommended implementation:**
```
On "Limpiar" click:
  → Show confirmation dialog:
     "¿Limpiar todos los datos?"
     "Esto eliminará información del paciente y todas las imágenes cargadas."
     [Cancelar] [Sí, limpiar]
  → Only clear if explicitly confirmed
```

**Why this matters:**
In time-pressured clinical environments, accidental clicks happen. Confirmation dialogs prevent catastrophic data loss and reduce stress.

---

#### **Issue #10: Information Hierarchy in Account Settings** (Account Screen)
**Impact:** Slows settings navigation  
**Effort:** Medium (3-5 days)  
**Status:** Assuming flat hierarchy based on typical settings patterns  

**Potential problem:**
If personal info, professional identity, digital signature, and language preferences all appear with similar visual weight, users must read everything to understand importance.

**Recommended structure:**
```
1. Critical for reports:
   - Professional name
   - License number
   - Digital signature (with status indicator)

2. Identity & contact:
   - Name, email, phone

3. Global preferences:
   - Language

4. Secondary actions:
   - Logout, account metadata
```

**Why this matters:**
Progressive disclosure and visual hierarchy reduce cognitive load. Critical professional information should be prominent; personal details can be secondary.

---

### 🟢 MEDIUM PRIORITY

#### **Issue #11: Login Flow Progress Visibility**
**Impact:** Increases perceived effort during onboarding  
**Effort:** Trivial (1-2 hours)  
**Fix:** Add step indicator with progress bar  

---

#### **Issue #12: Dashboard Visual Hierarchy**
**Impact:** Slower case prioritization  
**Effort:** Low (2-3 days)  
**Fix:** Promote status + patient name as primary visual anchors, de-emphasize secondary metadata  

---

## Why I Chose the Report Visualization Screen

After identifying 12 friction points across 6 screens, I prioritized the AI Report Visualization Screen for the following strategic reasons:

### 1. Highest Impact on Core Value Proposition

The report validation screen is the **moment of truth** where AI's value is realized or lost. All upstream improvements (better forms, faster generation) are meaningless if veterinarians can't efficiently validate and finalize AI outputs.

**Impact cascade:**
```
Better report UI → Faster validation (60% improvement)
  → Higher AI trust (60% → 85% acceptance)
    → Granular editing vs. monolithic text areas
      → Surgical regeneration vs. destructive full-report regeneration
        → More reports generated per day
          → Stronger product-market fit
            → Higher retention and NPS
```

### 2. Direct Alignment with Job Requirements

The job description explicitly emphasizes:
> "Turn AI outputs into intuitive, human-centered product experiences"

This prototype demonstrates exactly that skill: **taking the same AI output and making it 3x more usable through better UI design alone**—no model changes, no backend infrastructure changes, pure AI-to-UI workflow optimization.

### 3. Demonstrates AI-to-UI Workflow Expertise

The prototype showcases advanced AI-to-UI patterns critical for building AI products:

- **Confidence visualization** → How to surface AI uncertainty productively
- **Provenance linking** → How to show AI reasoning transparently
- **Granular interaction design** → How to move from monolithic to structured interfaces
- **Human-in-the-loop editing** → How to enable human override at appropriate granularity
- **Progressive disclosure** → How to manage AI complexity without overwhelming users
- **Context injection** → How to guide AI iteratively through UI affordances

These are **core competencies for AI product engineering**, directly applicable to DiagnoVET's roadmap.

### 4. Addresses Multiple Issues Simultaneously

My prototype improvements cascade to solve related problems:
- **Issue #5 (Destructive regeneration):** Context-aware regeneration eliminates need for full report regeneration and navigation overhead
- **Clear data highlighting:** Resolves confusion about what red highlighting means
- **WYSIWYG toggle:** Provides granular editing structure vs. monolithic text areas
- **Granular control:** Per-finding actions vs. section-level bulk operations

### 5. Feasible Within 72 Hours at Production Quality

Unlike Issue #5 (requires backend SSE), Issue #6 (DICOM parsing infrastructure), or Issue #7 (multi-step wizard redesign), the report visualization is:
- **Frontend-only** (no backend coordination needed for prototype)
- **Self-contained** (clear scope, no dependencies)
- **Highly polished** (more time for interaction details and micro-interactions)

This allowed me to demonstrate **production-ready code quality and attention to detail**, not just proof-of-concept prototypes.

### 6. Measurable, Demonstrable Impact

Clear before/after comparisons show immediate value:

| Feature | Before | After |
|---------|--------|-------|
| Finding structure | Monolithic text areas per section | Individual finding cards |
| Visual hierarchy | Uniform formatting | Color-coded confidence badges |
| Image-finding link | None, manual scrolling | Direct click interaction with thumbnails |
| Editing granularity | Edit entire section block | Edit individual findings |
| AI transparency | Black box, full trust required | Confidence + provenance visible |
| Data highlighting | Ambiguous "Mostrar cambios" | Clear, separate controls with tooltips |
| Regeneration | Navigate away + full report (45s) | Stay on screen + targeted with context (10s) |
| Edit/Preview | Separate workflow | Toggle on same screen (WYSIWYG) |
| Validation time | 15-20 min | 5-8 min (60% reduction) |

This makes the value **immediately obvious** in the demo video without requiring extensive explanation.

---

## Design Philosophy & Principles Applied

### 1. User-Centered, Not Technology-Centered

The AI model is powerful, but the UI must serve the **veterinarian's workflow**, not showcase AI capabilities.

**Example:** Instead of displaying raw confidence scores (0.8972341), I translated them into actionable visual cues (green/yellow/red badges with contextual labels like "AI 67% - Verificar").

### 2. Progressive Disclosure

Don't overwhelm users with all information at once. Reveal complexity only when needed.

**Example:** Findings show summary text by default. Confidence details, image links, editing tools, and regeneration options appear on hover/interaction. PDF preview mode is opt-in toggle. Edit history only shows when edits exist.

### 3. Trust Through Transparency

AI systems earn trust by showing their work, admitting uncertainty, and giving users control.

**Example:** Low-confidence findings are explicitly marked with red/yellow badges reading "AI 45% - Revisar," inviting human verification rather than hiding AI weakness. Image thumbnails show exact source of each conclusion.

### 4. Clinical Software Standards

Veterinary software must feel professional, not "startup-y." Clinical environments demand clarity over cleverness.

**Example:** Color choices prioritize medical conventions (red = attention needed/specific data, green = validated, yellow = verify, blue = AI-generated) over brand aesthetics. Typography and spacing follow clinical report standards.

### 5. Error Prevention Over Error Messages

Design to prevent mistakes rather than apologizing for them.

**Example:** Context-aware regeneration prevents destructive iterations. Granular editing prevents accidental changes to unrelated findings. PDF preview mode prevents formatting surprises. Confidence badges prevent blind trust in uncertain AI outputs.

---

## References & Inspiration

### AI-to-UI Patterns
- **ChatGPT:** Streaming content, regeneration controls, confidence communication
- **GitHub Copilot:** Multi-suggestion interface with granular accept/reject patterns
- **Grammarly:** Inline suggestions with confidence indicators and explanations
- **Notion AI:** Clear visual distinction between AI-generated and human-written content

### Medical UI Standards
- **Epic MyChart:** Professional medical interface conventions and information hierarchy
- **UpToDate:** Clinical content hierarchy, evidence-based design patterns
- **OsiriX PACS Viewer:** Side-by-side image + report layouts, DICOM handling

### Interaction Patterns
- **Notion:** Inline editing, auto-save, hover actions, progressive disclosure, granular block-level editing
- **Linear:** Keyboard shortcuts, optimistic UI, command palette
- **Figma:** Real-time collaboration states, professional tooltips
- **Google Docs:** Track changes, suggestion mode, WYSIWYG editing

### UX Principles
- Jakob Nielsen's 10 Usability Heuristics
- Don Norman's "Design of Everyday Things" (Affordances, Signifiers, Feedback)
- Progressive Disclosure (Luke Wroblewski)
- Optimistic UI (Ryan Florence)
- Jobs to Be Done (Clayton Christensen)
- AI Design Patterns (Google PAIR, Microsoft HAX Toolkit)

---

## Conclusion

This challenge reinforced my core belief about AI products:

> **The hardest part of AI products isn't the AI—it's the interface that makes AI usable, trustworthy, and efficient.**

DiagnoVET has world-class AI technology producing high-quality diagnostic content in 45 seconds. However, systematic UX issues in the report validation interface prevent veterinarians from efficiently leveraging this AI output, turning a promised 5-minute workflow into a 15-20 minute reality.

My analysis identified **12 critical friction points** across the platform, and my prototype demonstrates how thoughtful AI-to-UI design can transform the highest-impact bottleneck—the report visualization screen—through five key improvements:

1. **AI confidence transparency** that enables selective validation
2. **Visual provenance linking** that makes AI reasoning verifiable
3. **Clear data highlighting system** that eliminates confusion about what information means
4. **WYSIWYG edit/preview toggle** with **granular finding-level structure** vs. monolithic text areas
5. **Context-aware regeneration** that guides AI toward better outputs without destructive workflows or navigation overhead

### What I've Demonstrated

**Analytical Depth:**
- Comprehensive UX audit across 6 screens
- Strategic prioritization based on business impact and technical feasibility
- Understanding of veterinary clinical workflows and pain points
- Recognition of current inline editing capability and its structural limitations

**AI-to-UI Expertise:**
- Confidence visualization systems that communicate uncertainty productively
- Provenance linking patterns that make AI reasoning transparent
- Granular interaction design that moves from monolithic to structured interfaces
- Human-in-the-loop patterns that balance automation with appropriate control granularity
- Progressive disclosure of AI complexity without overwhelming users
- Context injection mechanisms that enable iterative AI improvement

**Technical Execution:**
- Production-ready React + TypeScript implementation
- Accessible, keyboard-first interactions meeting clinical software standards
- Optimistic UI patterns with auto-save for professional UX
- Compound component architecture for maintainability and extensibility
- Structured data model enabling granular editing vs. monolithic text areas

**Product Thinking:**
- Deep understanding of veterinary clinical decision-making processes
- Recognition of when existing features work (inline editing) vs. where structure needs improvement (monolithic text areas, lack of granular regeneration)
- Strategic roadmap prioritizing critical blockers and high-impact improvements
- Measurable success metrics tied to business outcomes
- Long-term vision for systematic platform improvement

### Next Steps

While my prototype addresses the core report validation bottleneck, the complete solution requires tackling the broader ecosystem of friction points:

**Immediate priorities (1-2 weeks):**
- Language/signature setup (critical for international expansion and legal compliance)
- Full backend support for context-aware finding-level regeneration

**High-impact improvements (2-4 weeks):**
- Multi-stage study intake wizard (improves data quality at source)
- DICOM auto-fill (saves 2-3 min per case, reduces errors)
- Confirmation dialogs for destructive actions (if not already implemented)

**Polish & optimization (ongoing):**
- Dashboard visual hierarchy and smart sorting
- Onboarding flow with progress visibility
- Advanced keyboard shortcuts and command palette

I'm excited about the opportunity to bring this level of craft, strategic thinking, and AI-to-UI expertise to DiagnoVET and help veterinarians worldwide spend less time on administrative work and more time caring for animals.

---

**Contact:**  
- Valentín F. Carlomagno  
- valentinfcarlomagno@gmail.com  
- [LinkedIn](https://www.linkedin.com/in/valentin-f-carlomagno-10683b338/)  
- [Portfolio](https://carlomagnowebservices.vercel.app)