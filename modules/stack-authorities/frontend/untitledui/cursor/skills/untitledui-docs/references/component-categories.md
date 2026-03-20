# Untitled UI Component Categories

Comprehensive breakdown of all components organized by category with usage examples and access levels.

## Base Components (Core UI Primitives)

### Buttons
**Access**: Free + PRO variants

**Free Components**:
- `button` - Standard button with variants (primary, secondary, tertiary, link)
- `button-group` - Horizontal/vertical button groupings

**PRO Components**:
- `social-button` - Social media login buttons (Google, Facebook, Apple, etc.)
- `app-store-button` - Download buttons (App Store, Google Play)
- `utility-button` - Icon-only buttons, floating action buttons

**Usage Examples**:
```tsx
<Button variant="primary" size="md">Click me</Button>
<ButtonGroup>
  <Button>Left</Button>
  <Button>Right</Button>
</ButtonGroup>
```

### Form Inputs
**Access**: Free + PRO variants

**Free Components**:
- `input` - Text, email, password, number inputs with labels
- `textarea` - Multi-line text input with character counts
- `select` - Dropdown select with search and multi-select
- `checkbox` - Single checkboxes and checkbox groups
- `radio` - Radio buttons and radio groups
- `toggle` - Switch/toggle controls

**PRO Components**:
- `verification-code-input` - OTP/code entry with auto-focus
- `text-editor` - Rich text editor with formatting toolbar
- `date-picker` - Date selection with calendar popup
- `file-uploader` - Drag-drop file upload with progress

**Usage Examples**:
```tsx
<Input label="Email" type="email" placeholder="you@example.com" />
<Select options={[...]} label="Country" searchable />
<Checkbox label="Accept terms" />
<Toggle label="Enable notifications" />
```

### Display Components
**Access**: Free + PRO variants

**Free Components**:
- `badge` - Status badges with colors and variants
- `badge-group` - Multiple badge display
- `tag` - Removable tags/chips
- `avatar` - User avatars with initials fallback
- `tooltip` - Hover tooltips with positioning

**PRO Components**:
- `progress-indicator` - Linear and circular progress
- `slider` - Range and multi-handle sliders
- `rating-badge` - Star ratings and review badges
- `qr-code` - QR code generation with styling
- `credit-card` - Credit card display with brand detection
- `illustration` - Empty state illustrations

**Usage Examples**:
```tsx
<Badge variant="success">Active</Badge>
<Avatar name="John Doe" src="/avatar.jpg" size="md" />
<Tooltip content="Help text">Hover me</Tooltip>
```

### Navigation Components
**Access**: Free + PRO variants

**Free Components**:
- `dropdown` - Dropdown menus with sections
- `tabs` - Tab navigation with variants
- `breadcrumb` - Breadcrumb navigation trails

**PRO Components**:
- `pagination` - Page navigation with ellipsis
- `carousel` - Image/content carousels with indicators

### Media Components
**Access**: PRO only

**PRO Components**:
- `video-player` - Custom video player with controls
- `featured-icon` - Large decorative icons for sections

### Feedback Components
**Access**: Free + PRO variants

**Free Components**:
- `alert` - Inline alerts with variants (info, success, warning, error)
- `notification` - Toast notifications

**PRO Components**:
- `loading-indicator` - Spinners, skeletons, progress bars
- `empty-state` - Empty state with illustration and CTA
- `code-snippet` - Code display with syntax highlighting and copy

## Application Components (Complex App Features)

**Access**: Majority PRO, some free

### Layout Components (PRO)
- `sidebar-navigation` - Collapsible sidebar with nested items
- `header-navigation` - Top app bar with search and actions
- `page-header` - Page title with breadcrumbs and actions
- `card-header` - Card component headers with actions
- `section-header` - Section dividers with titles
- `section-footer` - Section footers with actions

**Usage Examples**:
```tsx
<SidebarNavigation items={navItems} collapsed={false} />
<PageHeader title="Dashboard" breadcrumbs={[...]} actions={<Button>New</Button>} />
```

### Overlays (PRO)
- `modal` - Dialog modals with sizes and variants
- `slideout` - Side panel/drawer with positions
- `command-menu` - Command palette (Cmd+K style)

**Usage Examples**:
```tsx
<Modal open={isOpen} onClose={handleClose} title="Edit User">
  {/* content */}
</Modal>
<Slideout position="right" open={isOpen}>
  {/* panel content */}
</Slideout>
```

### Data Display (PRO)
- `table` - Advanced tables with sorting, filtering, pagination
- `line-chart` - Line and area charts
- `bar-chart` - Bar and column charts
- `pie-chart` - Pie and donut charts
- `radar-chart` - Radar/spider charts
- `activity-gauge` - Circular progress gauges
- `metric` - Stat cards with trends
- `activity-feed` - Timeline/feed of events

**Usage Examples**:
```tsx
<Table columns={columns} data={data} sortable filterable />
<LineChart data={chartData} xAxis="month" yAxis="revenue" />
<Metric value="$45,231" label="Revenue" change="+12.3%" trend="up" />
```

### Forms Advanced (PRO)
- `date-picker` - Calendar date selection
- `calendar` - Full calendar view with events
- `file-uploader` - File upload with drag-drop and progress

### Content (PRO)
- `messaging` - Chat/message interface
- `progress-steps` - Step indicators for multi-step flows
- `inline-cta` - In-content call-to-action blocks
- `content-divider` - Section dividers with labels

## Marketing Components (Landing Pages)

**Access**: PRO only

### Hero Sections
- `header-navigation` - Marketing site nav with mega menu
- `hero-section` - Hero with various layouts (centered, split, with image)
- `banner` - Top announcement banner with dismiss

**Variants**:
- Simple centered text
- Split with image
- With video background
- With form (lead capture)

### Feature Sections
- `feature-section` - Feature grids and lists with icons
- `metric-section` - Stats/numbers showcase
- `social-proof-section` - Logo clouds, customer testimonials

**Layouts**:
- 3-column grid
- Alternating rows
- Centered with icons
- With screenshots

### Conversion Sections
- `pricing-section` - Pricing tables with tiers
- `cta-section` - Call-to-action sections
- `newsletter-cta` - Newsletter signup forms

**Pricing Variants**:
- 3-tier comparison
- Feature matrix
- Toggle annual/monthly
- Highlighted recommended plan

### Social Proof
- `testimonial-section` - Customer testimonials with photos
- `team-section` - Team member grids
- `blog-section` - Blog post previews

### Content Sections
- `content-section` - Rich text content areas
- `contact-section` - Contact forms with info
- `faq-section` - FAQ accordions
- `careers-section` - Job listings

### Footer
- `footer` - Marketing site footer with columns

## Page Templates (Complete Examples)

**Access**: PRO only

### Application Templates
- `dashboards-01` - Analytics dashboard with sidebar
- `dashboards-02` - Metrics dashboard with cards
- `settings-pages-01` - Settings with tabs
- `settings-pages-02` - Settings with sidebar nav
- `informational-pages-01` - Content page with sidebar
- `informational-pages-02` - Full-width content page

### Marketing Templates
- `landing-page` - Complete landing page (hero, features, pricing, footer)
- `pricing-page` - Pricing page with comparison table
- `blog` - Blog listing page
- `blog-post` - Article page with sidebar
- `about-page` - About us page
- `contact-page` - Contact page with form and map
- `team-page` - Team directory
- `legal-page` - Terms/privacy page
- `faq-page` - FAQ page with search

### Shared Page Templates
- `login-page` - Login/signin page
- `signup-page` - Registration page
- `verification-page` - Email/phone verification
- `forgot-password-page` - Password reset
- `404-page` - Not found error page
- `email-template` - Transactional email templates

## Foundation Components

### Icons
**Free**: 1,100+ line-style icons via `@untitledui/icons`
**PRO**: 4,600+ icons across 4 styles via `@untitledui-pro/icons`

**Styles** (PRO):
- Line: Minimalist outlined icons
- Solid: Filled icons
- Duocolor: Two-tone icons with accent color
- Duotone: Dual-color overlay effect

**Common Icon Categories**:
- Interface: arrows, chevrons, close, menu, search
- Communication: mail, phone, message, chat
- Users: user, users, profile, avatar
- Media: play, pause, image, video, camera
- Files: document, folder, upload, download
- Actions: edit, delete, add, save, copy
- Navigation: home, settings, dashboard, map
- Commerce: cart, credit-card, tag, package
- Social: facebook, twitter, linkedin, github
- Status: check, x, alert, info, help

### Other Foundations
- `logo` - Brand logos and wordmarks
- `file-icon` - File type icons (PDF, DOCX, etc.)
- `flag-icon` - Country flags
- `avatar` - User avatar images and placeholder sets

## Component Selection Guide

### Choose Base Components When:
- Building core UI elements (buttons, forms, navigation)
- Need consistent primitives across your app
- Working on authentication flows, forms, basic layouts
- Budget-conscious (many free options)

### Choose Application Components When:
- Building dashboards or admin panels
- Need data visualization (charts, metrics)
- Implementing complex interactions (modals, slideouts, tables)
- Building internal tools or SaaS apps

### Choose Marketing Components When:
- Building landing pages or marketing sites
- Need pre-built sections (hero, pricing, testimonials)
- Want consistent marketing page layouts
- Building multi-page marketing site

### Choose Page Templates When:
- Want to scaffold complete pages quickly
- Need design consistency across pages
- Building common page types (dashboard, settings, pricing)
- Want to see how components work together

## Access Summary

| Category | Free | PRO |
|----------|------|-----|
| Base Components | ✓ Core variants | ✓ All variants + advanced |
| Application Components | ✓ Limited | ✓ Full library |
| Marketing Components | ✗ | ✓ Full library |
| Page Templates | ✗ | ✓ Full library |
| Icons | ✓ 1,100+ line | ✓ 4,600+ (4 styles) |
| CLI | ✓ Basic | ✓ Full access |
| MCP Server | ✓ Free components | ✓ Full access with API key |
