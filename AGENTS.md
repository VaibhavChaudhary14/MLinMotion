# Project Instructions: ML in Motion

## Design System: Analog Bauhaus (Analog Lab)
All UI, canvas visualizations, animations, and components in this project MUST strictly adhere to the **Analog Bauhaus** design system.

### Core Tenets
1. **Physicality Over Ephemerality:** No ambiguous float, glow, or Gaussian blur. Cards, containers, and data plates feel like punched sheet metal, bakelite slabs, or heavyweight archival paper.
2. **Hard-Edge Elevation:** Zero-blur directional offset shadows (`3px 3px 0px #1A1715`), crisp hairline borders (`1.5px solid #1A1715`), and tactile insets (`inset 2px 2px 0px rgba(26,23,21,0.15)`).
3. **Primary-Driven Semantic Rigor:**
   - **Vermilion (`#C83226`):** Dynamic energy, error residuals ($y - \hat{y}$), gradient descent step paths, loss peaks, failure breakpoints.
   - **Ultramarine (`#1848B8`):** Centroid $K_1$, primary active button, verified algorithm path, anchors.
   - **Cadmium Yellow / Amber (`#E28C05`):** Centroid $K_2$, learning rate adjustments, tentative state changes, warnings, active line highlight.
   - **Sage / Forest Green (`#33634B`):** Centroid $K_3$, global convergence indicators, passed unit checks, valid constraints.
   - **Plum (`#6E3867`):** Centroid $K_4$, multiclass decision partition 4.
4. **Mechanical Tactility:** Controls mimic bench switches, stepped potentiometers, rotary dials, and mechanical tape counters (tabular numerals, black module, physical push translation).
5. **Canvas & Data Glyphs:**
   - Always pair cluster color with distinct geometric glyphs: Cluster 1 = Solid Circle, Cluster 2 = Rotated Diamond, Cluster 3 = Equilateral Triangle, Cluster 4 = Crosshair Square, Unassigned = Dashed Hollow Circle.
   - Centroids: Concentric target disc ($\varnothing 18\text{px}$) with pen trajectory ($1.5\text{px}$ dashed trail with numbered sequence dots $\mu^{(0)}, \mu^{(1)}, \dots$).
6. **Motion Physics:**
   - Avoid generic floaty ease curves. Use mechanical spring physics:
     - `mechanicalLatch`: `{ type: "spring", stiffness: 700, damping: 35, mass: 0.5 }`
     - `needleDeflection`: `{ type: "spring", stiffness: 260, damping: 20, mass: 1 }`
     - `pointTransition`: `{ type: "tween", duration: 0.32, ease: [0.25, 1, 0.5, 1] }`

See [DESIGN_SYSTEM.md](file:///d:/Projects/ML%20in%20Motion/DESIGN_SYSTEM.md) for full token matrices and technical styling definitions.

