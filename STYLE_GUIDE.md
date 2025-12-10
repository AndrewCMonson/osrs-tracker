# OSRS Tracker Style Guide

This document contains all styling information for the OSRS Tracker frontend application. Use this guide when generating assets, designing new components, or maintaining visual consistency.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Theme System](#theme-system)
4. [Component Styles](#component-styles)
5. [Animations](#animations)
6. [Background Patterns](#background-patterns)
7. [Spacing & Layout](#spacing--layout)
8. [Shadows & Effects](#shadows--effects)
9. [Icons](#icons)

---

## Color System

The application uses the **OKLCH** color space for all colors, providing better perceptual uniformity and color consistency across themes.

### Primary Color Palette

#### Amber (Accent Color)
- **Primary Accent (Dark)**: `oklch(70% 0.15 65)`
- **Primary Accent (Light)**: `oklch(55% 0.18 65)`
- **Amber 500**: Used for hover states and highlights
- **Amber 600**: Primary button background
- **Amber 700**: Gradient end color
- **Amber 400**: Link hover color

#### Stone (Neutral Palette)

**Dark Theme:**
- **Background Primary**: `oklch(12.3% 0.013 58.06)` - Main background
- **Background Secondary**: `oklch(18% 0.012 60)` - Secondary surfaces
- **Background Tertiary**: `oklch(22% 0.01 60)` - Elevated surfaces
- **Text Primary**: `oklch(94.5% 0.009 83.6)` - Main text
- **Text Secondary**: `oklch(70% 0.01 60)` - Secondary text
- **Text Muted**: `oklch(55% 0.01 60)` - Muted/disabled text
- **Border Color**: `oklch(28% 0.01 60)` - Default borders

**Light Theme:**
- **Background Primary**: `oklch(98% 0.005 60)` - Main background
- **Background Secondary**: `oklch(95% 0.008 60)` - Secondary surfaces
- **Background Tertiary**: `oklch(92% 0.01 60)` - Elevated surfaces
- **Text Primary**: `oklch(20% 0.015 60)` - Main text
- **Text Secondary**: `oklch(40% 0.01 60)` - Secondary text
- **Text Muted**: `oklch(55% 0.01 60)` - Muted/disabled text
- **Border Color**: `oklch(85% 0.01 60)` - Default borders

### Semantic Colors

#### Success (Emerald)
- **Background**: `bg-emerald-600/20`
- **Text**: `text-emerald-400`
- **Border**: `border-emerald-600/30`

#### Destructive (Red)
- **Background**: `bg-red-600/20`
- **Text**: `text-red-400`
- **Border**: `border-red-600/30`
- **Button**: `bg-red-600` with `hover:bg-red-500`

#### Ironman Badge
- **Background**: `bg-gray-600/20`
- **Text**: `text-gray-300`
- **Border**: `border-gray-500/30`

#### Hardcore Badge
- **Background**: `bg-red-900/30`
- **Text**: `text-red-400`
- **Border**: `border-red-700/30`

#### Ultimate Badge
- **Background**: `bg-stone-600/20`
- **Text**: `text-stone-300`
- **Border**: `border-stone-500/30`

### Color Usage Guidelines

- **Amber** is the primary accent color used for:
  - Primary buttons
  - Links and interactive elements
  - Focus states
  - Highlights and emphasis
  - Progress bars
  - Logo/branding

- **Stone** provides the neutral foundation:
  - Backgrounds (950, 900, 800, 700)
  - Text colors (100, 200, 300, 400, 500, 600)
  - Borders and dividers
  - Secondary UI elements

---

## Typography

### Font Families

- **Primary (Sans)**: `'Geist', system-ui, -apple-system, sans-serif`
- **Monospace**: `'Geist Mono', ui-monospace, monospace`

### Font Sizes

- **Hero/Display**: `text-4xl md:text-6xl lg:text-7xl` (2.25rem - 4.5rem)
- **Heading 1**: `text-3xl md:text-4xl` (1.875rem - 2.25rem)
- **Heading 2**: `text-2xl md:text-3xl` (1.5rem - 1.875rem)
- **Heading 3**: `text-xl` (1.25rem)
- **Body Large**: `text-lg md:text-xl` (1.125rem - 1.25rem)
- **Body**: `text-sm` (0.875rem)
- **Small**: `text-xs` (0.75rem)

### Font Weights

- **Bold**: `font-bold` (700) - Headings, emphasis
- **Semibold**: `font-semibold` (600) - Card titles, labels
- **Medium**: `font-medium` (500) - Buttons, navigation
- **Regular**: Default (400) - Body text

### Text Utilities

- **Text Gradient**: `.text-gradient` - Creates a gradient text effect
  ```css
  background: linear-gradient(135deg, oklch(80% 0.15 65) 0%, oklch(70% 0.12 45) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  ```

---

## Theme System

The application supports both **Dark** (default) and **Light** themes with automatic switching based on user preference or manual toggle.

### Theme Variables

All theme colors are defined as CSS custom properties:

```css
/* Dark Theme */
--bg-primary: oklch(12.3% 0.013 58.06);
--bg-secondary: oklch(18% 0.012 60);
--bg-tertiary: oklch(22% 0.01 60);
--text-primary: oklch(94.5% 0.009 83.6);
--text-secondary: oklch(70% 0.01 60);
--text-muted: oklch(55% 0.01 60);
--border-color: oklch(28% 0.01 60);
--accent: oklch(70% 0.15 65);

/* Light Theme */
--bg-primary: oklch(98% 0.005 60);
--bg-secondary: oklch(95% 0.008 60);
--bg-tertiary: oklch(92% 0.01 60);
--text-primary: oklch(20% 0.015 60);
--text-secondary: oklch(40% 0.01 60);
--text-muted: oklch(55% 0.01 60);
--border-color: oklch(85% 0.01 60);
--accent: oklch(55% 0.18 65);
```

### Theme Implementation

- Themes are applied via the `dark` or `light` class on the root HTML element
- Theme preference is stored in `localStorage`
- Defaults to system preference if no saved preference exists
- Theme toggle button available in header

---

## Component Styles

### Buttons

**Base Styles:**
- Border radius: `rounded-lg`
- Font: `text-sm font-medium`
- Transition: `transition-all duration-200`
- Focus: `focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2`
- Disabled: `disabled:opacity-50 disabled:pointer-events-none`

**Variants:**

1. **Default (Primary)**
   - Background: `bg-amber-600`
   - Text: `text-white`
   - Hover: `hover:bg-amber-500`
   - Shadow: `shadow-lg shadow-amber-900/20 hover:shadow-amber-900/30`

2. **Destructive**
   - Background: `bg-red-600`
   - Text: `text-white`
   - Hover: `hover:bg-red-500`
   - Shadow: `shadow-lg shadow-red-900/20`

3. **Outline**
   - Border: `border-2 border-amber-600/50`
   - Background: `bg-transparent`
   - Text: `text-amber-100`
   - Hover: `hover:bg-amber-600/10 hover:border-amber-500`

4. **Secondary**
   - Background: `bg-stone-700`
   - Text: `text-stone-100`
   - Hover: `hover:bg-stone-600`
   - Shadow: `shadow-lg shadow-stone-900/20`

5. **Ghost**
   - Background: Transparent
   - Text: `text-stone-300`
   - Hover: `hover:bg-stone-800 hover:text-stone-100`

6. **Link**
   - Text: `text-amber-500`
   - Hover: `hover:underline hover:text-amber-400`
   - Underline offset: `underline-offset-4`

**Sizes:**
- **Small**: `h-8 px-3 text-xs`
- **Default**: `h-10 px-5 py-2`
- **Large**: `h-12 px-8 text-base`
- **Icon**: `h-10 w-10`

### Cards

**Base Card:**
- Border radius: `rounded-xl`
- Border: `border border-stone-800`
- Background: `bg-stone-900/80`
- Backdrop: `backdrop-blur-sm`
- Shadow: `shadow-xl`

**Card Components:**
- **CardHeader**: `flex flex-col space-y-1.5 p-6`
- **CardTitle**: `text-xl font-semibold leading-none tracking-tight text-stone-100`
- **CardDescription**: `text-sm text-stone-400`
- **CardContent**: `p-6 pt-0`
- **CardFooter**: `flex items-center p-6 pt-0`

### Badges

**Base Styles:**
- Display: `inline-flex items-center`
- Border radius: `rounded-full`
- Padding: `px-2.5 py-0.5`
- Font: `text-xs font-semibold`
- Transition: `transition-colors`

**Variants:**
- **Default**: `bg-amber-600/20 text-amber-400 border border-amber-600/30`
- **Secondary**: `bg-stone-700 text-stone-300 border border-stone-600`
- **Success**: `bg-emerald-600/20 text-emerald-400 border border-emerald-600/30`
- **Destructive**: `bg-red-600/20 text-red-400 border border-red-600/30`
- **Outline**: `border border-stone-600 text-stone-300`
- **Ironman**: `bg-gray-600/20 text-gray-300 border border-gray-500/30`
- **Hardcore**: `bg-red-900/30 text-red-400 border border-red-700/30`
- **Ultimate**: `bg-stone-600/20 text-stone-300 border border-stone-500/30`

### Inputs

**Base Styles:**
- Height: `h-10`
- Border radius: `rounded-lg`
- Border: `border-2 border-stone-700`
- Background: `bg-stone-800/50`
- Padding: `px-4 py-2`
- Font: `text-sm text-stone-100`
- Placeholder: `placeholder:text-stone-500`
- Transition: `transition-all duration-200`

**Focus State:**
- Border: `focus:border-amber-500`
- Ring: `focus:ring-2 focus:ring-amber-500/20`
- Outline: `focus:outline-none`

**Disabled State:**
- Cursor: `disabled:cursor-not-allowed`
- Opacity: `disabled:opacity-50`

### Tabs

**TabsList:**
- Background: `bg-stone-800/50`
- Border radius: `rounded-lg`
- Padding: `p-1`
- Gap: `gap-1`

**TabsTrigger:**
- Base: `rounded-md px-4 py-2 text-sm font-medium transition-all duration-200`
- **Active**: `bg-amber-600 text-white shadow-lg shadow-amber-900/30`
- **Inactive**: `text-stone-400 hover:text-stone-200 hover:bg-stone-700/50`
- Focus: `focus-visible:ring-2 focus-visible:ring-amber-500`

**TabsContent:**
- Animation: `animate-in fade-in-0 slide-in-from-bottom-2 duration-300`
- Margin: `mt-4`

### Progress Bars

**Base Styles:**
- Border radius: `rounded-full`
- Background: `bg-stone-800`
- Fill: `bg-gradient-to-r from-amber-600 to-amber-500`
- Transition: `transition-all duration-500 ease-out`

**Sizes:**
- **Small**: `h-1.5`
- **Medium**: `h-2.5` (default)
- **Large**: `h-4`

**Label:**
- Position: `absolute right-0 -top-5`
- Font: `text-xs text-stone-400`

---

## Animations

### Keyframe Animations

1. **Fade In**
   ```css
   @keyframes fade-in {
     from { opacity: 0; }
     to { opacity: 1; }
   }
   ```
   - Duration: `0.3s`
   - Easing: `ease-out`

2. **Slide In From Bottom**
   ```css
   @keyframes slide-in-from-bottom {
     from {
       transform: translateY(10px);
       opacity: 0;
     }
     to {
       transform: translateY(0);
       opacity: 1;
     }
   }
   ```
   - Duration: `0.3s`
   - Easing: `ease-out`

3. **Slide In From Top**
   ```css
   @keyframes slide-in-from-top {
     from {
       transform: translateY(-10px);
       opacity: 0;
     }
     to {
       transform: translateY(0);
       opacity: 1;
     }
   }
   ```
   - Duration: `0.3s`
   - Easing: `ease-out`

4. **Pulse Glow**
   ```css
   @keyframes pulse-glow {
     0%, 100% {
       box-shadow: 0 0 20px oklch(70% 0.15 65 / 0.3);
     }
     50% {
       box-shadow: 0 0 40px oklch(70% 0.15 65 / 0.5);
     }
   }
   ```

### Animation Classes

- `.animate-in`: `fade-in 0.3s ease-out forwards`
- `.fade-in-0`: `fade-in 0.3s ease-out forwards`
- `.slide-in-from-bottom-2`: `slide-in-from-bottom 0.3s ease-out forwards`
- `.slide-in-from-top-2`: `slide-in-from-top 0.3s ease-out forwards`

### Transition Durations

- **Fast**: `duration-200` (200ms) - Buttons, inputs, hovers
- **Medium**: `duration-300` (300ms) - Content transitions
- **Slow**: `duration-500` (500ms) - Progress bars, complex animations

---

## Background Patterns

### Grid Pattern

**Dark Theme:**
```css
background-image: 
  linear-gradient(to right, oklch(25% 0.01 60 / 0.1) 1px, transparent 1px),
  linear-gradient(to bottom, oklch(25% 0.01 60 / 0.1) 1px, transparent 1px);
background-size: 40px 40px;
```

**Light Theme:**
```css
background-image: 
  linear-gradient(to right, oklch(75% 0.01 60 / 0.15) 1px, transparent 1px),
  linear-gradient(to bottom, oklch(75% 0.01 60 / 0.15) 1px, transparent 1px);
background-size: 40px 40px;
```

**Usage:** `.bg-grid-pattern` with optional `opacity-50`

### Radial Gradient

**Dark Theme:**
```css
background: radial-gradient(
  ellipse at center top,
  oklch(25% 0.05 65 / 0.3) 0%,
  transparent 60%
);
```

**Light Theme:**
```css
background: radial-gradient(
  ellipse at center top,
  oklch(70% 0.12 65 / 0.2) 0%,
  transparent 60%
);
```

**Usage:** `.bg-radial-gradient`

### Glass Effect

**Dark Theme:**
```css
background: oklch(15% 0.01 60 / 0.5);
backdrop-filter: blur(12px);
border: 1px solid oklch(30% 0.01 60 / 0.3);
```

**Light Theme:**
```css
background: oklch(98% 0.01 60 / 0.7);
backdrop-filter: blur(12px);
border: 1px solid oklch(85% 0.01 60 / 0.5);
```

**Usage:** `.glass`

---

## Spacing & Layout

### Container

- **Max Width**: `container mx-auto`
- **Padding**: `px-4` (default), responsive padding on larger screens

### Common Spacing Values

- **Tight**: `gap-1`, `space-y-1`, `p-1`
- **Small**: `gap-2`, `space-y-1.5`, `p-2`
- **Medium**: `gap-4`, `space-y-4`, `p-4`, `p-6`
- **Large**: `gap-6`, `space-y-6`, `p-8`, `p-12`, `p-16`
- **Section Padding**: `py-12`, `py-20`, `py-32` (responsive: `lg:py-32`)

### Border Radius

- **Small**: `rounded-md` (0.375rem)
- **Medium**: `rounded-lg` (0.5rem) - Buttons, inputs
- **Large**: `rounded-xl` (0.75rem) - Cards
- **Full**: `rounded-full` - Badges, pills

### Layout Patterns

- **Header**: `sticky top-0 z-50` with `backdrop-blur-lg`
- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Flex**: `flex items-center justify-between gap-4`

---

## Shadows & Effects

### Box Shadows

**Standard Shadows:**
- **Small**: `shadow-sm`
- **Medium**: `shadow-lg` - Buttons, cards
- **Large**: `shadow-xl` - Cards
- **Colored Shadows**:
  - Amber: `shadow-amber-900/20`, `shadow-amber-900/30`
  - Red: `shadow-red-900/20`
  - Stone: `shadow-stone-900/20`

**Light Theme Override:**
- `shadow-amber-900/30` → `oklch(55% 0.15 65 / 0.15)`
- `shadow-lg` → Standard light shadow

### Backdrop Effects

- **Blur**: `backdrop-blur-sm` (cards), `backdrop-blur-lg` (header)
- **Opacity**: Used with backgrounds (e.g., `bg-stone-900/80`, `bg-stone-800/50`)

### Selection

**Dark Theme:**
```css
background: oklch(65% 0.15 65 / 0.4);
color: white;
```

**Light Theme:**
```css
background: oklch(65% 0.15 65 / 0.3);
color: oklch(20% 0.01 60);
```

### Focus Outline

```css
outline: 2px solid oklch(70% 0.15 65);
outline-offset: 2px;
```

---

## Scrollbars

### Dark Theme

- **Width/Height**: `10px`
- **Track**: `oklch(20% 0.01 60)`
- **Thumb**: `oklch(35% 0.02 60)`
- **Thumb Hover**: `oklch(45% 0.03 60)`
- **Border Radius**: `5px`

### Light Theme

- **Track**: `oklch(92% 0.01 60)`
- **Thumb**: `oklch(75% 0.02 60)`
- **Thumb Hover**: `oklch(65% 0.03 60)`
- **Border Radius**: `5px`

---

## Icons

### Icon Library

The application uses **Lucide React** for icons.

### Common Icons

- **Sword**: Logo/branding
- **Search**: Search functionality
- **Sun/Moon**: Theme toggle
- **User**: User menu
- **LogIn/LogOut**: Authentication
- **Menu/X**: Mobile navigation
- **Trophy**: Milestones
- **TrendingUp**: Progress tracking
- **Target**: Goals
- **Shield**: Verification
- **Zap**: Features/energy
- **ChevronRight**: Navigation

### Icon Sizing

- **Small**: `h-4 w-4` (16px) - Buttons, inline
- **Medium**: `h-5 w-5` (20px) - Headers, cards
- **Large**: `h-6 w-6` (24px) - Hero sections, large buttons

### Icon Colors

Icons inherit text color from their container. Common patterns:
- `text-white` - On colored backgrounds
- `text-amber-500` - Accent/highlight
- `text-stone-400` - Secondary
- `text-stone-500` - Muted/disabled

---

## Responsive Design

### Breakpoints

- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (≥ 768px)
- **Desktop**: `lg:` (≥ 1024px)

### Common Responsive Patterns

- **Text Sizes**: `text-4xl md:text-6xl lg:text-7xl`
- **Padding**: `py-20 lg:py-32`
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **Visibility**: `hidden md:flex`, `md:hidden`
- **Max Width**: `max-w-xl mx-auto`, `max-w-4xl mx-auto`

---

## Z-Index Scale

- **Base**: `0` (default)
- **Header**: `z-50` - Sticky header
- **Dropdowns**: `z-50` - User menu, modals
- **Overlays**: Higher z-index for modals and overlays

---

## Accessibility

### Focus States

All interactive elements have visible focus states:
- **Ring**: `focus-visible:ring-2 focus-visible:ring-amber-500`
- **Offset**: `focus-visible:ring-offset-2`
- **Outline**: `focus-visible:outline-none` (replaced by ring)

### Color Contrast

- Text colors meet WCAG AA standards
- Primary text on backgrounds maintains 4.5:1 contrast ratio
- Secondary text maintains 3:1 contrast ratio

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for icon-only buttons
- Role attributes for custom components (tabs, modals)

---

## Design Principles

1. **Dark-First**: Dark theme is the default, with light theme as an alternative
2. **Amber Accent**: Amber is the primary accent color throughout
3. **Subtle Gradients**: Gradients are used sparingly for emphasis
4. **Glass Morphism**: Backdrop blur effects for modern depth
5. **Smooth Transitions**: All interactive elements have 200ms transitions
6. **Consistent Spacing**: 4px base unit (Tailwind's default)
7. **Rounded Corners**: Consistent border radius (lg for buttons, xl for cards)
8. **Layered Shadows**: Colored shadows match element colors

---

## Asset Generation Guidelines

When generating assets based on this style guide:

1. **Colors**: Use OKLCH values for accurate color reproduction
2. **Typography**: Use Geist font family (or closest equivalent)
3. **Spacing**: Follow 4px base unit system
4. **Shadows**: Match shadow colors to element colors
5. **Themes**: Generate both dark and light variants
6. **Icons**: Use Lucide icon style as reference
7. **Border Radius**: Match component specifications
8. **Gradients**: Use specified gradient directions and stops

---

## Notes

- All colors use OKLCH color space for better perceptual uniformity
- Theme switching is instant with CSS custom properties
- Backdrop filters require browser support (Safari, Chrome, Edge)
- Grid pattern uses 40px × 40px base size
- All transitions use ease-out timing function
- Focus states are keyboard-only (focus-visible) to avoid mouse interaction issues
