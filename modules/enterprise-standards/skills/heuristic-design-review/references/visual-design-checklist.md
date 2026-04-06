# Visual Design Principles Checklist

Detailed evaluation checklist for visual design quality across web and mobile platforms.

---

## How to Use This Checklist

For each principle, walk through the evaluation questions. Mark each as:
- **Pass** - Criteria met, no issues
- **Minor** - Small deviation, does not impact usability
- **Major** - Significant issue, impacts user experience
- **Critical** - Severe issue, prevents effective use
- **N/A** - Not applicable to this evaluation

Provide specific evidence for any non-Pass rating.

---

## V1: Visual Hierarchy

The arrangement of elements in order of importance.

### Evaluation Questions

- [ ] Is there a clear primary focal point on each screen?
- [ ] Does element sizing reflect importance (larger = more important)?
- [ ] Are headings, subheadings, and body text visually distinct?
- [ ] Does the primary CTA dominate over secondary actions?
- [ ] Is the most important information positioned in high-attention areas (top-left for LTR, center for mobile)?
- [ ] Do color and weight distinguish primary from secondary content?

### Web-Specific
- [ ] Does above-the-fold content contain the most critical information?
- [ ] Does the hero section clearly communicate the primary value proposition?
- [ ] Are sidebar elements subordinate to main content?

### Mobile-Specific
- [ ] Is the most important action reachable with one thumb (bottom of screen)?
- [ ] Does the top of the screen show context (where am I)?
- [ ] Are actionable items visually distinct from informational content?

### Common Issues
- All elements competing for attention (no clear hierarchy)
- CTA buttons same visual weight as navigation links
- Important information buried below decorative content

---

## V2: Contrast

Differences in color, size, or texture that make elements stand out.

### Evaluation Questions

- [ ] Does body text meet WCAG AA contrast ratio (4.5:1 for normal text)?
- [ ] Does large text meet WCAG AA contrast ratio (3:1 for 18px+ or 14px+ bold)?
- [ ] Do interactive elements have sufficient contrast against their background?
- [ ] Are primary and secondary actions visually distinct from each other?
- [ ] Does the contrast work in all states (default, hover, active, disabled, focus)?
- [ ] Is color not the sole means of conveying information?

### Web-Specific
- [ ] Does contrast work across light and dark modes (if supported)?
- [ ] Are link colors distinguishable from body text without underlines?
- [ ] Do focus indicators have sufficient contrast (3:1 against adjacent colors)?

### Mobile-Specific
- [ ] Does contrast hold up under bright sunlight conditions?
- [ ] Are disabled states distinguishable from enabled states?
- [ ] Do selected/unselected tab bar items have clear contrast?

### Common Issues
- Light gray text on white background (insufficient contrast)
- Placeholder text indistinguishable from input values
- Disabled buttons look identical to enabled buttons
- Error states rely solely on red color (color blindness)

### Contrast Ratio Quick Reference

| Element | WCAG AA | WCAG AAA |
|---------|---------|----------|
| Normal text (< 18px) | 4.5:1 | 7:1 |
| Large text (>= 18px or >= 14px bold) | 3:1 | 4.5:1 |
| UI components and graphical objects | 3:1 | N/A |
| Focus indicators | 3:1 | N/A |

---

## V3: Balance

The distribution of visual weight across a composition.

### Evaluation Questions

- [ ] Does the overall layout feel stable and intentional?
- [ ] Are heavy elements (images, dark areas) counterbalanced?
- [ ] Is the grid system applied consistently?
- [ ] Do forms have balanced label-input-help text proportions?
- [ ] Is the layout not excessively top-heavy or lopsided?
- [ ] Does asymmetric balance create energy where appropriate?

### Web-Specific
- [ ] Do multi-column layouts distribute visual weight evenly?
- [ ] Are sidebars proportional to main content areas?
- [ ] Does the footer balance the header weight?

### Mobile-Specific
- [ ] Is content centered appropriately for single-column layouts?
- [ ] Are bottom navigation items evenly distributed?
- [ ] Do cards and list items have balanced internal layout?

### Common Issues
- All visual weight on one side of the screen
- Inconsistent margins creating imbalanced whitespace
- Footer with no content competing with heavy header

---

## V4: Scale

Using relative size to indicate importance and create depth.

### Evaluation Questions

- [ ] Is a consistent type scale used throughout (e.g., 12/14/16/20/24/32)?
- [ ] Are primary elements larger than secondary elements?
- [ ] Do touch/click targets meet minimum sizes?
- [ ] Is the scale responsive across breakpoints?
- [ ] Do icons scale proportionally with text?
- [ ] Are images sized appropriately for their context?

### Web-Specific
- [ ] Does the type scale adapt across breakpoints (mobile: 16px base, desktop: 18px+)?
- [ ] Are click targets minimum 44x44px?
- [ ] Do hero images/text scale gracefully?

### Mobile-Specific
- [ ] Are touch targets minimum 44x44pt (iOS) or 48x48dp (Android)?
- [ ] Does the UI support Dynamic Type (iOS) or font scaling (Android)?
- [ ] Are icons minimum 24x24pt for tappable elements?

### Touch Target Size Reference

| Platform | Minimum Size | Recommended Size |
|----------|-------------|-----------------|
| iOS | 44x44pt | 48x48pt |
| Android | 48x48dp | 56x56dp |
| Web (touch) | 44x44px | 48x48px |
| Web (pointer) | 24x24px | 32x32px |

### Common Issues
- Text too small on mobile (below 14px)
- Touch targets too close together (< 8px gap)
- Inconsistent type scale (random font sizes)
- Icons not scaling with text preferences

---

## V5: White Space (Negative Space)

Empty areas that provide breathing room and focus.

### Evaluation Questions

- [ ] Is spacing between content groups adequate for separation?
- [ ] Are margins and padding consistent (using a spacing scale)?
- [ ] Does white space create clear content boundaries?
- [ ] Is the layout breathable (not cramped)?
- [ ] Is the spacing scale systematic (e.g., 4/8/12/16/24/32/48)?
- [ ] Is micro-spacing (within components) as intentional as macro-spacing?

### Web-Specific
- [ ] Do section dividers use whitespace rather than lines where possible?
- [ ] Is paragraph spacing consistent throughout content pages?
- [ ] Do wide viewports use max-width to prevent over-stretching?

### Mobile-Specific
- [ ] Is content not edge-to-edge without any padding (minimum 16px horizontal)?
- [ ] Is spacing between tappable elements sufficient to prevent mistaps?
- [ ] Do scrollable areas have clear content start/end indicators?

### Spacing Scale Example

```
4px  - Tight: within components (icon to label)
8px  - Compact: related elements (input to help text)
12px - Default: between elements in a group
16px - Comfortable: between component groups
24px - Spacious: between sections
32px - Open: between major content blocks
48px - Generous: page-level spacing
64px - Expansive: hero/feature section margins
```

### Common Issues
- No consistent spacing scale (pixel values appear random)
- Content crammed together with no breathing room
- Too much white space making content feel disconnected
- Uneven margins between similar elements

---

## V6: Proximity

Elements placed close together are perceived as related.

### Evaluation Questions

- [ ] Are related elements grouped together?
- [ ] Are unrelated elements separated by meaningful space?
- [ ] Do form labels sit closer to their inputs than to adjacent fields?
- [ ] Are action buttons near the content they act upon?
- [ ] Are section headers closer to their content than to preceding sections?
- [ ] Do card/container boundaries correctly group related content?

### Web-Specific
- [ ] Are navigation groups logically clustered?
- [ ] Do sidebar widgets have clear separation from each other?
- [ ] Are footer sections grouped by category?

### Mobile-Specific
- [ ] Are list item actions (swipe, buttons) within the item boundary?
- [ ] Are bottom sheet actions near the content they reference?
- [ ] Do floating action buttons clearly relate to their context?

### The Proximity Test
Cover half the screen. Can you still tell which label belongs to which field? If not, proximity is wrong.

### Common Issues
- Form labels equidistant from multiple inputs
- Action buttons far from the content they affect
- Section headers orphaned from their content
- Unrelated items appearing grouped by accident

---

## V7: Unity

The sense that all parts of a design belong together.

### Evaluation Questions

- [ ] Is the color palette limited and consistently applied?
- [ ] Are no more than 2-3 font families used?
- [ ] Do components share a consistent visual language?
- [ ] Are border radii consistent across elements (not mixed sharp/rounded)?
- [ ] Are shadows/elevations from a consistent scale?
- [ ] Does every screen feel like part of the same product?

### Web-Specific
- [ ] Are link styles consistent throughout the site?
- [ ] Do form elements share a consistent treatment?
- [ ] Are page layouts using a consistent grid structure?

### Mobile-Specific
- [ ] Do all screens use the same navigation pattern?
- [ ] Are transitions between screens consistent?
- [ ] Do cards, lists, and detail views share visual DNA?

### Unity Audit Method
1. Take screenshots of 5 different screens
2. Place them side by side
3. Do they look like they belong to the same product?
4. Can you identify the same color palette, type scale, and component style?

### Common Issues
- Multiple border radius values (2px, 4px, 8px, 12px across components)
- Inconsistent button styles across pages
- Mixed icon styles (outline on one page, filled on another)
- Different card styles for similar content types

---

## V8: Gestalt Principles

How the brain organizes visual information.

### Evaluation Questions

**Similarity:**
- [ ] Do elements that function similarly look similar?
- [ ] Are clickable elements visually consistent?
- [ ] Do data items of the same type share visual treatment?

**Closure:**
- [ ] Are implied shapes and boundaries clear without explicit borders?
- [ ] Can users perceive groups without visible containers?

**Continuity:**
- [ ] Do aligned elements create natural visual flow?
- [ ] Are grid lines (implied or explicit) consistent?
- [ ] Does content alignment guide the eye smoothly?

**Common Region:**
- [ ] Are grouped elements enclosed in a shared container or background?
- [ ] Do card boundaries correctly define content groups?
- [ ] Are section backgrounds used to define regions?

### Common Issues
- Interactive and non-interactive elements styled identically (similarity violation)
- Groups only implied by proximity, not reinforced by region
- Misaligned elements breaking continuity
- Overly complex layouts that fight perceptual grouping

---

## V9: Movement and Flow

Visual flow that guides the user's eye through content.

### Evaluation Questions

- [ ] Does content follow a natural reading pattern (F-pattern or Z-pattern)?
- [ ] Do visual cues (arrows, color gradients, images) guide eye movement?
- [ ] Is the scroll experience designed (content reveals naturally)?
- [ ] Are animations purposeful (guiding attention, showing relationships)?
- [ ] Do animations respect prefers-reduced-motion?
- [ ] Is the visual path aligned with the task flow?

### Web-Specific
- [ ] Does the F-pattern apply to content-heavy pages?
- [ ] Does the Z-pattern apply to landing/marketing pages?
- [ ] Are scroll-triggered animations enhancing understanding?

### Mobile-Specific
- [ ] Is the vertical scroll flow logical (most important content first)?
- [ ] Do swipe patterns align with content navigation?
- [ ] Are transitions between screens directionally consistent?

### Common Issues
- No clear visual path (eye bounces randomly)
- Animations that distract rather than guide
- Content order doesn't match task priority
- Scroll direction inconsistencies

---

## V10: Dominance

One element exerts more influence than others.

### Evaluation Questions

- [ ] Is there a single dominant element per screen or section?
- [ ] Does the dominant element align with the user's primary task?
- [ ] Is dominance achieved through deliberate means (size, color, position)?
- [ ] Are competing dominant elements avoided (only one "loudest voice")?
- [ ] Does the dominant element change appropriately per context?

### Web-Specific
- [ ] Does the hero section have a clear dominant element?
- [ ] Are product pages dominated by the product image?
- [ ] Is the primary CTA the most visually dominant action?

### Mobile-Specific
- [ ] Does the screen's primary action stand out clearly?
- [ ] Are bottom navigation items appropriately subdued versus content?
- [ ] Do alert/overlay states correctly dominate underlying content?

### Common Issues
- Multiple elements competing for dominance
- Decorative elements dominating over content
- CTA lost in visual noise
- No focal point on landing pages

---

## V11: Rhythm

Organized movement through repeating elements.

### Evaluation Questions

- [ ] Do lists, cards, and grids create a consistent visual rhythm?
- [ ] Are repeating patterns predictable and scannable?
- [ ] Does rhythm variation create intentional emphasis?
- [ ] Is content density appropriate for the rhythm?
- [ ] Are repeating elements consistently sized and spaced?

### Web-Specific
- [ ] Do blog/article listings have consistent card rhythm?
- [ ] Are data tables rhythmically consistent across rows?
- [ ] Do grid galleries create pleasing visual patterns?

### Mobile-Specific
- [ ] Do infinite scroll lists maintain rhythm as content loads?
- [ ] Are list items consistently structured for quick scanning?
- [ ] Do section breaks create rhythm between content types?

### Common Issues
- Inconsistent card heights breaking grid rhythm
- Random spacing between list items
- No visual pattern in repeating content
- Rhythm too monotonous (no variation = no emphasis)

---

## Summary Scorecard

Use this to compile results:

```markdown
## Visual Design Scorecard

| # | Principle | Score | Notes |
|---|-----------|-------|-------|
| V1 | Visual Hierarchy | | |
| V2 | Contrast | | |
| V3 | Balance | | |
| V4 | Scale | | |
| V5 | White Space | | |
| V6 | Proximity | | |
| V7 | Unity | | |
| V8 | Gestalt Principles | | |
| V9 | Movement and Flow | | |
| V10 | Dominance | | |
| V11 | Rhythm | | |

**Passing:** X/11
**Critical Issues:** X
**Major Issues:** X
**Minor Issues:** X
**Cosmetic Issues:** X
```
