# Analog Bauhaus (Analog Lab) Design System Specification
**Project:** ML in Motion  
**Aesthetic Lineage:** Walter Gropius & Herbert Bayer (Typographic discipline), Dieter Rams (Functionalist hardware / Braun), tactile electro-mechanical laboratory gear (early HP bench synthesizers, oscilloscopes, mechanical plotters).

---

## 1. Design Philosophy & Aesthetic Tenets

1. **Physicality Over Ephemerality:** No ambiguous float or diffuse Gaussian blur. Cards, containers, and data plates feel like punched sheet metal, bakelite slabs, or heavyweight archival paper.
2. **Hard-Edge Elevation:** Depth is communicated through solid, hard-offset box shadows (`box-shadow: 3px 3px 0px #1A1715`), crisp hairline borders, and tactile insets, not soft gradients.
3. **Primary-Driven Semantic Rigor:** Bauhaus primaries (Ultramarine, Vermilion, Cadmium Yellow) serve strict algorithmic functions:
   - **Vermilion (`#C83226`):** Dynamic energy, loss gradients, residuals, failure breakpoints.
   - **Ultramarine (`#1848B8`):** Anchors, target centroids, convergence states, primary interaction.
   - **Cadmium Yellow (`#E28C05`):** Active selections, warnings, intermediate scratchpad computations.
   - **Sage / Forest Green (`#33634B`):** Confirmed convergence, mathematical proofs, valid constraints.
   - **Plum (`#6E3867`):** Multiclass decision partition 4, secondary clusters.
4. **Mechanical Tactility:** Controls mimic bench switches, stepped potentiometers, rotary dials, and mechanical tape counters.

---

## 2. Complete Color Token Specification

### Core Substrates & Ink

| Token Name | Hex | OKLCH / HSL | Usage Role |
| :--- | :--- | :--- | :--- |
| `--surface-canvas` | `#F4EFE4` | `hsl(40, 38%, 93%)` | Base application viewport (warm stone parchment). |
| `--surface-card` | `#FAF7F0` | `hsl(41, 47%, 96%)` | Primary container surface for algorithm stages, code plates. |
| `--surface-well` | `#E8E1D3` | `hsl(39, 27%, 87%)` | Recessed areas: parameter strips, stepper tracks, code blocks. |
| `--surface-elevated` | `#FFFFFF` | `hsl(0, 0%, 100%)` | Active popovers, dragged centroids, tooltip cards. |
| `--border-strong` | `#1A1715` | `hsl(24, 10%, 9%)` | Structural 1.5px/2px borders, outer bounds, text framing. |
| `--border-subtle` | `#D8CFC0` | `hsl(38, 22%, 80%)` | Coordinate grid ticks, table dividers, secondary bounds. |
| `--ink-primary` | `#1A1715` | `hsl(24, 10%, 9%)` | Body copy, section headers, mathematical symbols. |
| `--ink-secondary` | `#5C544B` | `hsl(33, 10%, 33%)` | Metadata labels, iteration counters, parameter titles. |
| `--ink-tertiary` | `#948B7D` | `hsl(37, 10%, 54%)` | Inactive axis labels, placeholder text, disabled states. |

### Semantic Primaries & Algorithm Colors

| Token Name | Hex | Usage Role |
| :--- | :--- | :--- |
| `--accent-vermilion` | `#C83226` | Error residuals ($y - \hat{y}$), gradient descent step paths, loss peaks. |
| `--accent-ultramarine` | `#1848B8` | Centroid $K_1$, primary active button, verified algorithm path. |
| `--accent-amber` | `#E28C05` | Centroid $K_2$, learning rate adjustments, tentative state changes. |
| `--accent-sage` | `#33634B` | Centroid $K_3$, global convergence indicators, passed unit checks. |
| `--accent-plum` | `#6E3867` | Centroid $K_4$, multiclass decision partition 4. |

---

## 3. Typography & Hierarchy System

```
Display / Headings:    Cabinet Grotesk or Clash Display (Variable, 600-800 weight)
Body / Controls:       General Sans, Satoshi, or Inter (Medium, 400-600 weight)
Code / Data Plates:    DM Mono, Berkeley Mono, or JetBrains Mono (400-500 weight)
Formulas / Equations:  KaTeX with font-family set to KaTeX_Main (embedded slab/serif)
```

### Type Scale Matrix

* **Display Title (Level 1):** `font-cabinet text-3xl font-bold tracking-tight text-[#1A1715]` (e.g., *“Algorithm Cinema: K-Means Iteration”*).
* **Section Eyebrow:** `font-mono text-xs uppercase tracking-widest font-semibold text-[#C83226]` (e.g., `STAGE 02 // VORONOI PARTITION`).
* **Interactive Metric:** `font-mono text-xl font-bold tracking-tight` (e.g., `J(c, μ) = 1.0428`).
* **Code Implementation:** `font-mono text-[13px] leading-relaxed text-[#1A1715] bg-[#E8E1D3]/50`.
* **Mathematical Notations:** Equations sit on slight warm recessed plates with horizontal borders and zero border-radius:
  $$J(\mathbf{c}, \boldsymbol{\mu}) = \frac{1}{m} \sum_{i=1}^{m} \left\Vert \mathbf{x}^{(i)} - \boldsymbol{\mu}_{c^{(i)}} \right\Vert^2$$

---

## 4. UI Geometry & Component Styling

### The "Analog Hard-Edge" Border & Shadow Rule

Forget blur radius. All depth relies on zero-blur directional offset:

```css
/* Card Surface */
.analog-card {
  background-color: var(--surface-card);
  border: 1.5px solid var(--border-strong);
  box-shadow: 3px 3px 0px var(--border-strong);
}

/* Recessed Control Plate (Sliders, Graph Canvas Well) */
.analog-well {
  background-color: var(--surface-well);
  border: 1.5px solid var(--border-strong);
  box-shadow: inset 2px 2px 0px rgba(26, 23, 21, 0.15);
}

/* Primary Action Button (Pressed State Translates into the shadow) */
.analog-btn-primary {
  background-color: var(--accent-vermilion);
  color: #FAF7F0;
  border: 1.5px solid var(--border-strong);
  box-shadow: 2.5px 2.5px 0px var(--border-strong);
  font-family: var(--font-mono);
  font-weight: 600;
  text-transform: uppercase;
  transition: transform 60ms ease, box-shadow 60ms ease;
}
.analog-btn-primary:active {
  transform: translate(2.5px, 2.5px);
  box-shadow: 0px 0px 0px var(--border-strong);
}
```

### Physical Mechanical Controls

1. **Step Counter / Playhead (Tape Counter Styling):**
   - Black rectangular module (`#1A1715`) with high-contrast mechanical readout numbers (`#FAF7F0`) rendered in monospaced tabular numerals (`font-feature-settings: 'tnum'`).
   - Stepper buttons are square $36\times36\text{px}$ toggle blocks with physical tactile states.
2. **Hyperparameter Sliders ($\alpha, K, \text{depth}$):**
   - Track: $4\text{px}$ deep grooved slot (`#D8CFC0` with an inner shadow).
   - Thumb: Rectangular $16\times24\text{px}$ slider block with $3$ debossed grip ribs running vertically.
3. **Data Quality & Misconception Badges:**
   - Squared, sharp corners (`border-radius: 0px` or max `2px`).
   - Solid $1\text{px}$ outline with matching light tint fill and dark text to preserve maximum legibility.

---

## 5. Canvas & Data Visualization Language

### Coordinate Grid & Geometry

```
Canvas Background:   #FAF7F0 (Paper White)
Grid Lines:          1px stroke #E8E1D3, step = 40px
Major Grid Ticks:    #1A1715 with labeled numbers every 4 units in DM Mono (9px)
Axis Lines:          1.5px solid #1A1715 with triangular arrowheads
```

### Data Point Glyph System

To satisfy accessibility and avoid color-only differentiation, each cluster or class pairs a unique Bauhaus primary with a distinct geometric glyph:

| Entity | Color | Glyph Structure |
| :--- | :--- | :--- |
| **Cluster 1 / Class A** | `#1848B8` (Ultramarine) | Filled solid circle ($\varnothing 8\text{px}$, $1\text{px}$ `#1A1715` stroke). |
| **Cluster 2 / Class B** | `#C83226` (Vermilion) | Rotated square / diamond ($8\times8\text{px}$, $1\text{px}$ `#1A1715` stroke). |
| **Cluster 3 / Class C** | `#E28C05` (Cadmium Yellow) | Equilateral triangle ($\Delta 9\text{px}$, $1\text{px}$ `#1A1715` stroke). |
| **Cluster 4 / Class D** | `#33634B` (Sage Green) | Crosshair square ($8\times8\text{px}$ with center dot). |
| **Unassigned Data** | `#948B7D` (Stone Grey) | Hollow circle with dashed border. |

### Centroid Visual Spec

- **Symbol:** Concentric target disc ($\varnothing 18\text{px}$) with an outer ring, white spacer ring, and a center core filled with the cluster’s dominant color.
- **Centroid Trajectory:** Historical steps render as a mechanical pen line: $1.5\text{px}$ dashed trail (`stroke-dasharray: 3 3`) with tiny numbered sequence dots indicating iteration positions $\mu^{(0)}, \mu^{(1)}, \dots, \mu^{(t)}$.
- **Voronoi / Decision Partitions:** Light pastel tints ($\le 12\%$ opacity) demarcated by crisp $1.5\text{px}$ solid boundary borders (`#1A1715`).

---

## 6. Tailwind CSS System Configuration

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        analog: {
          canvas: '#F4EFE4',
          card: '#FAF7F0',
          well: '#E8E1D3',
          border: '#1A1715',
          subtle: '#D8CFC0',
          ink: {
            primary: '#1A1715',
            secondary: '#5C544B',
            muted: '#948B7D',
          },
          vermilion: '#C83226',
          ultramarine: '#1848B8',
          amber: '#E28C05',
          sage: '#33634B',
          plum: '#6E3867',
        },
      },
      fontFamily: {
        display: ['var(--font-cabinet)', 'sans-serif'],
        sans: ['var(--font-general)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      boxShadow: {
        'analog-sm': '1.5px 1.5px 0px #1A1715',
        'analog': '3px 3px 0px #1A1715',
        'analog-lg': '5px 5px 0px #1A1715',
        'analog-inset': 'inset 2px 2px 0px rgba(26, 23, 21, 0.12)',
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '2px',
        md: '3px',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 7. Motion & Animation Physics (Framer Motion)

```typescript
// Fast mechanical latch (Buttons, Segmented Tabs, Modals)
export const mechanicalLatch = {
  type: "spring",
  stiffness: 700,
  damping: 35,
  mass: 0.5,
};

// Instrument Needle / Centroid Movement (Oscillates slightly then settles)
export const needleDeflection = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  mass: 1,
};

// Data Point Transition / Assignment Shift
export const pointTransition = {
  type: "tween",
  duration: 0.32,
  ease: [0.25, 1, 0.5, 1], // Cubic snappy mechanical glide
};
```

---

## 8. Synchronized Code-to-Visual Bridge

```tsx
// Active code row styling inside the Analog Code Reader
<div 
  className={cn(
    "flex items-center gap-3 px-3 py-1 font-mono text-xs border-l-[3px] transition-colors duration-100",
    isActive 
      ? "bg-[#E28C05]/20 border-l-[#C83226] text-[#1A1715] font-semibold" 
      : "border-l-transparent text-[#5C544B]"
  )}
>
  <span className="w-5 text-right text-[#948B7D] select-none">{lineNumber}</span>
  <code>{codeString}</code>
</div>
```

