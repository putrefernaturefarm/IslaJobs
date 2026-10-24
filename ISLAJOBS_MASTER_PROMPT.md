# IslaJobs — Master Prompt Engineering Document
## "The Zero-Hallucination Build Specification"
### Version: 1.0 | Authority: Ruebenson S. Acabal | Date: 2026-10-23
### Governance: CLAUDE.md v9.2 · Article XII Stage 1 Discovery COMPLETE

---

## ═══════════════════════════════════════════════════════════
## SECTION 0 — HOW TO USE THIS DOCUMENT
## ═══════════════════════════════════════════════════════════

This document is a **complete, self-contained build specification** for IslaJobs.
Feed it as a system prompt or reference document to any AI coding assistant.

**Rules for the AI reading this:**
1. NEVER invent features not described here. If a feature is not in this document, it does not exist.
2. NEVER guess a color. Every color is defined in Section 2 with exact hex codes.
3. NEVER guess a label. Every field label is written here exactly as it must appear in the UI.
4. NEVER skip a validation rule. Section 8 defines all business logic.
5. If you are uncertain about anything — ask. Do not hallucinate.
6. Build in the exact order defined in Section 9. No skipping stages.
7. Every screen in Section 5 must match the specification — field by field, label by label.

---

## ═══════════════════════════════════════════════════════════
## SECTION 1 — PROJECT IDENTITY
## ═══════════════════════════════════════════════════════════

```
App Name        : IslaJobs
Tagline         : "Find work. Hire help. Right here on the island."
Target Market   : Philippines (Dinagat Islands, Mindanao, and beyond)
App Type        : Two-sided marketplace — Employers (Customers) + Workers
Language        : Filipino English (casual, warm, direct)
Currency        : Philippine Peso (PHP ₱)
Phone Format    : +63 (Philippine numbers, 09XXXXXXXXX format)
Platform        : Web App (Next.js PWA — mobile-first, responsive)
Reference App   : Workermo (this is a feature-complete recreation with IslaJobs branding)
```

**What IslaJobs does (plain language):**
- Employers post jobs (cleaning, repairs, deliveries, etc.)
- Workers offer skills and get hired for those jobs
- Both parties chat, manage bookings, and process payments in-app
- Workers get paid via GCash or Maya
- All workers are verified via government ID + Police Clearance

**What IslaJobs does NOT do (won't-list):**
- No international payments or foreign currency
- No company/corporate account type (individuals only, v1.0)
- No subscription or premium tiers (v1.0)
- No AI job matching (v1.0)
- No video calls (v1.0)
- No public job board accessible without login
- No social feed or posts (not a social network)
- No ratings/reviews system (v1.0 — future feature)

---

## ═══════════════════════════════════════════════════════════
## SECTION 2 — DESIGN SYSTEM
## ═══════════════════════════════════════════════════════════

### 2.1 COLOR TOKENS (EXACT HEX — DO NOT DEVIATE)

```
/* === PRIMARY — Facebook Blue === */
--color-primary          : #1877F2   /* Main blue — buttons, active states, links */
--color-primary-dark     : #0D65D9   /* Hover/pressed state */
--color-primary-light    : #E7F3FF   /* Backgrounds, selected cards, highlights */
--color-primary-xlight   : #F0F4FF   /* Page backgrounds with blue tint */

/* === BACKGROUND === */
--color-bg-page          : #F0F2F5   /* Global page background (Facebook gray) */
--color-bg-card          : #FFFFFF   /* All cards, modals, form sections */
--color-bg-input         : #FFFFFF   /* Input fields */
--color-bg-input-focus   : #FFFFFF   /* Input focus (border changes, not bg) */
--color-bg-dark          : #18191A   /* Dark mode page background */
--color-bg-card-dark     : #242526   /* Dark mode card */
--color-bg-input-dark    : #3A3B3C   /* Dark mode input */

/* === TEXT === */
--color-text-primary     : #1C1E21   /* Main text, headings */
--color-text-secondary   : #65676B   /* Subtitles, helper text, placeholders */
--color-text-disabled    : #BCC0C4   /* Disabled state text */
--color-text-white       : #FFFFFF   /* Text on primary blue backgrounds */
--color-text-primary-dk  : #E4E6EB   /* Dark mode main text */
--color-text-secondary-dk: #B0B3B8   /* Dark mode secondary text */

/* === BORDERS === */
--color-border           : #CED0D4   /* Input borders, dividers */
--color-border-focus     : #1877F2   /* Input focus border — PRIMARY BLUE */
--color-border-dark      : #3E4042   /* Dark mode borders */

/* === SEMANTIC === */
--color-success          : #1877F2   /* Reuse primary blue for success (IslaJobs brand) */
--color-success-light    : #E7F3FF   /* Success background */
--color-error            : #FA3E3E   /* Error text and borders */
--color-error-light      : #FFEBE8   /* Error card background */
--color-warning          : #F7B928   /* Earnings, pending badges */
--color-warning-light    : #FFF4D9   /* Warning card background */

/* === STATUS BADGES === */
--color-available        : #1877F2   /* Available status — primary blue */
--color-unavailable      : #65676B   /* Unavailable status */
--color-verified         : #1877F2   /* Verified badge — blue checkmark */
--color-unverified       : #FA3E3E   /* Unverified badge — red */

/* === NAVIGATION === */
--color-nav-active       : #1877F2   /* Active tab icon + label */
--color-nav-inactive     : #65676B   /* Inactive tab icon + label */
--color-nav-bg           : #FFFFFF   /* Bottom nav background */
--color-nav-border       : #CED0D4   /* Top border of bottom nav */

/* === SERVICE CATEGORY CARD COLORS === */
--color-cat-cleaning     : #E7F0FD   /* Light blue */
--color-cat-cleaning-icon: #1877F2   /* Blue spray icon */
--color-cat-repairs      : #FFF0E6   /* Peach */
--color-cat-repairs-icon : #E87722   /* Orange wrench */
--color-cat-deliveries   : #E6F4EA   /* Light green */
--color-cat-deliveries-icon: #1DA462 /* Green box */
--color-cat-handyman     : #F0E6FF   /* Light purple */
--color-cat-handyman-icon: #7B4FBF   /* Purple hammer */
--color-cat-petcare      : #E6F7F7   /* Light teal */
--color-cat-petcare-icon : #1B9E9E   /* Teal paw */
--color-cat-cooking      : #FFF8E6   /* Light amber */
--color-cat-cooking-icon : #E8A020   /* Amber fork-spoon */
--color-cat-other        : #F0F2F5   /* Gray */
--color-cat-other-icon   : #65676B   /* Gray grid */

/* === QUICK ACTION CARD COLORS === */
--color-qa-bookings-bg   : #E7F0FD   /* Light blue — My Bookings card */
--color-qa-bookings-icon : #1877F2   /* Blue calendar icon */
--color-qa-jobs-bg       : #E6F4EA   /* Light green — Browse Jobs card */
--color-qa-jobs-icon     : #1DA462   /* Green search icon */
--color-qa-earnings-bg   : #FFF8E6   /* Light amber — Earnings card */
--color-qa-earnings-icon : #E8A020   /* Amber trending-up icon */
```

### 2.2 TYPOGRAPHY

```
Font Family     : Inter (Google Fonts — weights: 400, 500, 600, 700)
Fallback        : -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

/* TYPE SCALE */
--text-xs        : 11px / 400  /* Helper text, timestamps */
--text-sm        : 13px / 400  /* Form labels (uppercase), badges */
--text-base      : 15px / 400  /* Body text, list items */
--text-md        : 16px / 500  /* Input values, nav labels */
--text-lg        : 18px / 600  /* Section headings, card titles */
--text-xl        : 22px / 700  /* Screen headings ("Welcome back") */
--text-2xl       : 26px / 700  /* Main screen headings */

/* LABEL STYLE (form field labels) */
Form labels     : 11px / 700 / UPPERCASE / tracking-wider / --color-text-secondary
```

### 2.3 SPACING & RADIUS

```
/* SPACING */
--space-xs       : 4px
--space-sm       : 8px
--space-md       : 12px
--space-lg       : 16px
--space-xl       : 20px
--space-2xl      : 24px
--space-3xl      : 32px

/* BORDER RADIUS */
--radius-sm      : 8px    /* Badges, chips */
--radius-md      : 12px   /* Input fields */
--radius-lg      : 16px   /* Cards */
--radius-xl      : 24px   /* Modals, bottom sheets */
--radius-full    : 9999px /* Buttons (pill shape), avatar circles */

/* SHADOWS */
--shadow-card    : 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)
--shadow-nav     : 0 -1px 0px rgba(0,0,0,0.10)
```

### 2.4 INPUT FIELD SPEC

```
Height          : 52px
Background      : #FFFFFF
Border          : 1.5px solid #CED0D4
Border (focused): 1.5px solid #1877F2
Border radius   : 12px
Padding         : 0 16px
Font            : 15px / 400 / #1C1E21
Placeholder     : 15px / 400 / #BCC0C4
```

### 2.5 BUTTON SPEC

```
PRIMARY BUTTON:
  Height        : 52px
  Background    : #1877F2
  Border radius : 9999px (pill)
  Font          : 16px / 600 / #FFFFFF
  Hover bg      : #0D65D9
  Active bg     : #0A5BC4

SECONDARY BUTTON (outline):
  Height        : 52px
  Background    : transparent
  Border        : 1.5px solid #CED0D4
  Border radius : 9999px (pill)
  Font          : 16px / 600 / #1C1E21

GHOST/TEXT BUTTON:
  No border, no background
  Font          : 15px / 500 / #1877F2

DANGER BUTTON:
  Background    : #FFEBE8
  Font          : 16px / 600 / #FA3E3E
  Border        : none
```

### 2.6 CARD SPEC

```
Background      : #FFFFFF
Border radius   : 16px
Padding         : 16px
Shadow          : --shadow-card
```

### 2.7 LOGO / ICON

```
App Icon        : A briefcase icon on solid #1877F2 square with rounded corners
  — The briefcase is white (#FFFFFF)
  — Corner radius: 20% of icon size
  — On white bg contexts: show #1877F2 briefcase on white, with "IslaJobs" wordmark
Wordmark        : "IslaJobs" — Inter 700 — #1877F2
  — "Isla" in #1877F2, "Jobs" in #1C1E21 (optional treatment)
Tagline         : "Find work. Hire help." — Inter 400 — #65676B
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 3 — TECH STACK
## ═══════════════════════════════════════════════════════════

```
Framework       : Next.js 14 (App Router)
Language        : TypeScript (strict mode)
Styling         : Tailwind CSS v3 + CSS Variables (design tokens in Section 2)
Database        : Supabase (PostgreSQL)
Auth            : Supabase Auth (phone OTP + password)
Storage         : Supabase Storage (profile photos, ID documents)
State           : Zustand (client state) + React Query / TanStack Query (server state)
Forms           : React Hook Form + Zod (schema validation)
Maps            : Leaflet.js (no Google Maps — free, OpenStreetMap tiles)
Realtime        : Supabase Realtime (chat messages, notifications)
SMS             : Semaphore (Philippine SMS gateway) — for OTP
Payments        : None in v1.0 — payout details stored for manual processing
Icons           : Lucide React (consistent, clean icon set)
Notifications   : Web Push API (PWA) + Supabase realtime
Date/Time       : date-fns
PWA             : next-pwa (service worker, offline support, installable)
```

**File structure:**
```
islajobs/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify-otp/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              ← Bottom nav + auth guard
│   │   ├── home/page.tsx
│   │   ├── chats/
│   │   │   ├── page.tsx            ← Chat list
│   │   │   └── [chatId]/page.tsx   ← Chat room
│   │   ├── bookings/page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx            ← Job feed (customer: post job / worker: browse)
│   │   │   └── post/page.tsx       ← Post a job form
│   │   ├── workers/page.tsx        ← Find workers (customer only)
│   │   ├── services/page.tsx       ← Manage services (worker only)
│   │   └── more/
│   │       ├── page.tsx            ← Settings menu
│   │       ├── profile/page.tsx
│   │       ├── verification/page.tsx
│   │       ├── payout/page.tsx
│   │       ├── notifications/page.tsx
│   │       └── earnings/page.tsx
│   └── layout.tsx                  ← Root layout, providers
├── components/
│   ├── ui/                         ← Primitives: Button, Input, Card, Badge, Avatar
│   ├── layout/                     ← BottomNav, TopBar, PageHeader
│   ├── auth/                       ← RoleSelector, OTPInput
│   ├── home/                       ← HeroBanner, QuickActions, CategoryGrid
│   ├── jobs/                       ← JobCard, PostJobForm, JobFeed
│   ├── bookings/                   ← BookingCard, BookingList
│   ├── chat/                       ← ChatBubble, ChatInput, MessageList
│   ├── profile/                    ← ProfilePhoto, ProfileForm
│   └── verification/               ← VerificationForm, VerificationStatus
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts                ← Generated from Supabase schema
│   ├── validations/                ← Zod schemas per form
│   ├── hooks/                      ← useUser, useBookings, useJobs, useChat
│   └── utils/                      ← formatCurrency, formatPhone, formatDate
├── styles/
│   └── globals.css                 ← Design tokens as CSS variables
└── public/
    ├── icons/                      ← PWA icons
    └── images/
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 4 — NAVIGATION ARCHITECTURE
## ═══════════════════════════════════════════════════════════

### 4.1 BOTTOM NAVIGATION — WORKER ROLE

```
Position        : Fixed bottom, full width, z-index: 50
Height          : 64px (safe-area-inset-bottom aware)
Background      : #FFFFFF
Border top      : 1px solid #CED0D4

Tabs (left to right):
┌─────────────────────────────────────────────────────────┐
│  🏠 Home  │  💬 Chats │  📅 Bookings │  🔍 Jobs │  💼 Services │  ··· More  │
└─────────────────────────────────────────────────────────┘

Tab spec:
  Icon size     : 24px (Lucide icon)
  Label         : 11px / 500
  Active color  : #1877F2 (icon + label)
  Inactive color: #65676B (icon + label)

Routes:
  Home          → /home
  Chats         → /chats
  Bookings      → /bookings
  Jobs          → /jobs          (Browse jobs near you)
  Services      → /services      (Manage your services)
  More          → /more
```

### 4.2 BOTTOM NAVIGATION — CUSTOMER ROLE

```
Tabs (left to right):
┌─────────────────────────────────────────────────────────┐
│  🏠 Home  │  💬 Chats │  📅 Bookings │  🔍 Jobs │  👥 Workers │  ··· More  │
└─────────────────────────────────────────────────────────┘

Routes:
  Home          → /home
  Chats         → /chats
  Bookings      → /bookings
  Jobs          → /jobs          (Post a job or view posted jobs)
  Workers       → /workers       (Find workers near you)
  More          → /more
```

### 4.3 SCREEN HIERARCHY

```
PUBLIC (no auth):
  /               → redirects to /login
  /login          → Login screen
  /register       → Registration screen
  /verify-otp     → OTP verification

AUTHENTICATED (requires login):
  /home                         → Dashboard (role-aware)
  /chats                        → Chat list
  /chats/[chatId]               → Chat room
  /bookings                     → My bookings
  /jobs                         → Job feed (customer: my posts / worker: nearby jobs)
  /jobs/post                    → Post a job (customer only)
  /jobs/[jobId]                 → Job detail
  /workers                      → Find workers (customer only)
  /workers/[workerId]           → Worker profile
  /services                     → Manage services (worker only)
  /more                         → Settings menu
  /more/profile                 → Edit profile
  /more/profile/photo           → Add/change profile photo
  /more/verification            → Identity verification
  /more/payout                  → Payout details
  /more/earnings                → Earnings dashboard
  /more/notifications           → Notification settings
  /more/help                    → Help & support
  /more/about                   → About IslaJobs
  /more/privacy                 → Privacy policy (static page)
  /more/terms                   → Terms of service (static page)
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 5 — SCREEN SPECIFICATIONS
## ═══════════════════════════════════════════════════════════

Each screen is described EXACTLY. Build what is here. Nothing more. Nothing less.

---

### SCREEN 01: LOGIN
**Route:** `/login`
**Page bg:** #F0F2F5

**Layout (top to bottom, centered vertically):**

```
[DECORATIVE BACKGROUND]
  Scattered light-blue tinted icons behind content:
  wrench, briefcase, clipboard, location pin, search, shield, home
  Opacity: 0.08, color: #1877F2
  These are decorative only — non-interactive

[LOGO AREA — center]
  Briefcase icon in #E7F3FF circle (64px diameter)
  Icon color: #1877F2, icon size: 32px

[HEADING]
  "Welcome back"
  Text: 26px / 700 / #1C1E21 / center

[SUBHEADING]
  "Sign in with your phone number to find nearby workers or manage jobs."
  Text: 15px / 400 / #65676B / center
  Max width: 280px

[FORM CARD — white, radius-lg, padding 20px, shadow-card]

  [FIELD: PHONE NUMBER]
    Label    : "PHONE NUMBER" (form label style — 11px/700/uppercase/#65676B)
    Input    : type="tel", placeholder="09XXXXXXXXX"
    Validation: Philippine format — must start with 09, exactly 11 digits

  [FIELD: PASSWORD]
    Label    : "PASSWORD" (form label style)
    Input    : type="password", placeholder="" (empty)
    Right icon: eye/eye-off toggle (24px / #65676B)
    Min length: 8 characters

  [PRIMARY BUTTON]
    Label    : "Sign in"
    Width    : 100%
    Style    : Primary blue (#1877F2), pill, 52px height

  [FORGOT PASSWORD — center below button]
    "Forgot password?"
    Text: 15px / 500 / #1877F2 — ghost button style

[DIVIDER]
  Line — "OR" — Line
  Color: #CED0D4, text: 13px / 400 / #65676B

[SECONDARY BUTTON: Sign in with SMS code]
  Label    : "💬  Sign in with SMS code"
  Width    : 100%
  Style    : Secondary (outline border #CED0D4), white bg, pill

[SECONDARY BUTTON: Create account]
  Label    : "👤+ Create account"
  Width    : 100%
  Style    : Secondary (outline border #CED0D4), white bg, pill
  Action   : Navigate to /register
```

---

### SCREEN 02: REGISTER
**Route:** `/register`
**Page bg:** #F0F2F5

**Top bar:**
```
  Back arrow (←) left-aligned, color #1C1E21
  Title: none on top bar — heading is in the body
```

**Layout (top to bottom, scrollable):**

```
[DECORATIVE BACKGROUND]
  Same scattered icons as Login screen, same opacity

[HEADING BLOCK — center]
  "Create an account"
  Text: 26px / 700 / #1C1E21 / center

  "Join as a customer to hire, or as a worker to offer services nearby."
  Text: 15px / 400 / #65676B / center
  Max width: 300px

[ROLE SELECTOR CARD — white card, radius-lg, padding 20px]

  Section label: "I WANT TO USE ISLAJOBS AS"
  Text: 11px / 700 / uppercase / #65676B

  [Two role cards side by side, equal width, gap 12px]

  LEFT CARD — Customer (default selected):
    Selected state: bg #E7F3FF, border 2px solid #1877F2
    Unselected state: bg #F0F2F5, border 2px solid #CED0D4
    Icon: user-round (Lucide), 36px
      Selected icon color: #FFFFFF in #1877F2 circle (52px)
      Unselected: #65676B, no bg circle
    Label: "Customer" — 18px / 700 / #1877F2 (selected) or #1C1E21 (unselected)
    Sublabel: "Find and hire nearby workers." — 13px / 400 / #65676B / center

  RIGHT CARD — Worker:
    Selected state: bg #E7F3FF, border 2px solid #1877F2
    Unselected state: bg #F0F2F5, border 2px solid #CED0D4
    Icon: briefcase (Lucide), 36px
      Selected icon color: #FFFFFF in #1877F2 circle (52px)
      Unselected: #65676B, no bg circle
    Label: "Worker" — 18px / 700 / #1877F2 (selected) or #1C1E21 (unselected)
    Sublabel: "Offer skills and earn." — 13px / 400 / #65676B / center

  [Note below cards]
    Icon: briefcase (16px / #65676B)
    Text: "Planning to work and hire? Each role requires its own account with a different phone number."
    Text: 13px / 400 / #65676B

[PERSONAL INFO CARD — white card]

  [FIELD: FIRST NAME]
    Label: "FIRST NAME"
    Input: type="text", placeholder="" (empty)

  [FIELD: LAST NAME]
    Label: "LAST NAME"
    Input: type="text", placeholder="" (empty)

  [FIELD: DATE OF BIRTH — Worker role only, hidden for Customer]
    Label: "DATE OF BIRTH"
    Helper: "Birthday is used to confirm eligibility to work (18+)."
    Helper text: 13px / 400 / #65676B
    Input: date picker, format YYYY-MM-DD, value shows as "1998-03-22"
    Right icon: calendar (Lucide, 20px / #65676B)

[CONTACT CARD — white card]

  [FIELD: PHONE NUMBER]
    Label: "PHONE NUMBER"
    Helper: "We recommend using a valid phone number."
    Input: type="tel", placeholder="09XXXXXXXXX"

  [FIELD: PASSWORD]
    Label: "PASSWORD"
    Helper: "Use at least 8 characters."
    Input: type="password"
    Right icon: eye/eye-off toggle

  [FIELD: CONFIRM PASSWORD]
    Label: "CONFIRM PASSWORD"
    Input: type="password"
    Right icon: eye/eye-off toggle

[CHECKBOX ROW]
  Checkbox (16px, border #1877F2 when checked, fill #1877F2)
  Label: "I confirm that I am at least 18 years old."
  Text: 14px / 400 / #1C1E21
  Required: true (cannot register without checking)
  [Worker role only — hidden for Customer]

[PRIMARY BUTTON]
  Label: "Create account"
  Width: 100%
  Full primary blue, pill, 52px
  — Only enabled when all required fields valid + checkbox checked (if Worker)
```

---

### SCREEN 03: ADD PROFILE PHOTO
**Route:** `/more/profile/photo`
**Triggered:** Automatically after registration, or from profile settings
**Page bg:** #F0F2F5

**Top bar:**
```
  Back arrow (←), title "Add Profile Photo", text: 17px / 600 / #1C1E21
```

**Layout:**

```
[PROFILE PHOTO UPLOADER — center]
  Circle: 120px diameter
  Border: 3px solid #1877F2
  Default: User initials (first letter first + last name) on #E7F3FF bg
  If photo uploaded: show photo
  Camera icon badge:
    Position: bottom-right of circle
    Size: 32px circle, bg #1877F2, icon: camera (white, 16px)
    Action: Open file picker / camera

  Below circle:
    "Change photo" — 15px / 600 / #1877F2 — clickable link

[HEADING — center]
  "Add a profile photo"
  Text: 22px / 700 / #1C1E21

  "Help others recognize you. You can update it anytime from your profile."
  Text: 15px / 400 / #65676B / center / max-width: 280px

[BENEFITS CARD — white card, radius-lg]
  Three rows with icon + text:

  Row 1:
    Icon: shield (20px) in #E7F3FF square (36px, radius 8px), icon color #1877F2
    Text: "Builds trust with customers and workers"
    Text: 14px / 400 / #1C1E21

  Row 2:
    Icon: eye (20px) in #F0F2F5 square (36px, radius 8px), icon color #65676B
    Text: "Your photo is visible on bookings and job posts"
    Text: 14px / 400 / #1C1E21

  Row 3:
    Icon: pencil (20px) in #FFF8E6 square (36px, radius 8px), icon color #E8A020
    Text: "You can update it anytime from your profile"
    Text: 14px / 400 / #1C1E21

[PRIMARY BUTTON — pinned to bottom or below benefits card]
  Label: "Save Photo"
  Width: 100%
  Blue pill, 52px
  — Enabled only when a photo has been selected
  — Disabled state: bg #BCC0C4

[BOTTOM NAV visible]
```

---

### SCREEN 04: EDIT PROFILE
**Route:** `/more/profile`
**Page bg:** #F0F2F5

**Top bar:**
```
  Back arrow (←), title "Edit Profile", right: "Save" text button (#1877F2)
```

**Layout (scrollable):**

```
[HEADER CARD — white, radius-lg]
  Center-aligned:
    Profile photo circle (80px) with camera icon badge (same spec as Screen 03)
    Full name: 20px / 700 / #1C1E21 — "[First] [Last]"

[PERSONAL INFO CARD — white card]
  [FIELD: FIRST NAME] — prefilled
  [FIELD: LAST NAME] — prefilled

[CONTACT CARD — white card]

  [FIELD: CONTACT NUMBER]
    Label: "CONTACT NUMBER"
    Helper: "Use a number you can be reached on for booking updates and SMS."
    Input: type="tel", prefilled

  [FIELD: EMAIL ADDRESS]
    Label: "EMAIL ADDRESS"
    Input: type="email", placeholder="you@example.com"

  [FIELD: SHORT BIO]
    Label: "SHORT BIO"
    Helper: "Short bio: [n] characters left (max 1000)."
    Textarea: 4 rows, resize: none
    Placeholder: "Example: 3 years housekeeping experience, reliable and on time"
    Character counter updates live

[LOCATION CARD — white card]

  Section label: "LOCATION"

  If GPS obtained:
    Icon: map-pin (16px / #1877F2)
    Text: "GPS: [lat], [lng]" — 14px / 600 / #1877F2

  [BUTTON: Use current location]
    Style: Small pill button, bg #E7F3FF, text #1877F2
    Icon: map-pin (16px, left of text)
    Label: "Use current location"
    Action: navigator.geolocation.getCurrentPosition()
```

---

### SCREEN 05: VERIFICATION
**Route:** `/more/verification`
**Page bg:** #F0F2F5

**Top bar:**
```
  Back arrow (←), title "Verification"
```

**Layout (scrollable):**

```
[STATUS CARD]
  If status = 'unverified' or 'not_submitted':
    Background: #FFEBE8
    Left: shield-off icon (24px) in #FFEBE8 circle, icon color: #FA3E3E
    Heading: "Unverified" — 16px / 700 / #1C1E21
    Body: "To protect both customers and workers, a valid government ID and a recent Police Clearance are required before granting a Verified badge. Submit documents below to start the review."
    Body: 14px / 400 / #65676B

  If status = 'pending':
    Background: #FFF8E6
    Heading: "Under Review" — #E8A020
    Body: "Your documents are being reviewed. This usually takes 1-2 business days."

  If status = 'verified':
    Background: #E7F3FF
    Left: shield-check icon, color: #1877F2
    Heading: "Verified ✓" — #1877F2
    Body: "Your account is verified. Customers can now book your services."

[REQUIREMENTS CARD — white card]
  Section label: "REQUIREMENTS"

  Row 1:
    Icon: check-circle (20px / #1877F2)
    Text: "One valid government ID (PhilID, Driver's License, Passport, etc.)"
    Text: 14px / 400 / #1C1E21

  Row 2:
    Icon: check-circle (20px / #1877F2)
    Text: "Recent Police Clearance"
    Text: 14px / 400 / #1C1E21

[UPLOAD DOCUMENTS CARD — white card]
  [Only shown if status is NOT 'verified']
  Section label: "UPLOAD DOCUMENTS"

  [FIELD: ID TYPE]
    Label: "ID TYPE"
    Dropdown (select) with options:
      — PhilID (National ID)
      — Driver's License
      — Passport
      — SSS ID
      — GSIS ID
      — PRC ID
      — Voter's ID
      — Postal ID
    Placeholder: "ID type"
    Right icon: chevron-down (16px / #65676B)

  [FIELD: ID NUMBER]
    Label: "ID NUMBER"
    Input: type="text", placeholder="Enter the number on your ID"

  [TWO COLUMN UPLOAD — equal width, gap 12px]

    LEFT: ID FRONT
      Label: "ID FRONT" (above box)
      Upload box: dashed border (#CED0D4), radius 12px, height 120px, bg #F0F2F5
      Center content:
        upload icon (24px / #65676B) + "Tap to upload"
        Text: 13px / 400 / #65676B
      If uploaded: show image thumbnail, remove button (×) top-right

    RIGHT: ID BACK
      Same spec as ID FRONT

  [POLICE CLEARANCE SECTION]
    Row header: "POLICE CLEARANCE" label + "Required" badge
      Badge: bg #E7F3FF, text #1877F2, 11px/600, radius-full, padding 2px 8px

    [FIELD: REFERENCE / CONTROL NUMBER]
      Label: "REFERENCE / CONTROL NUMBER"
      Input: type="text", placeholder="e.g. 2024-000123"

    [FIELD: DATE ISSUED]
      Label: "DATE ISSUED"
      Input: date picker, placeholder="Select date issued"
      Right icon: calendar (20px / #65676B)

    [UPLOAD: POLICE CLEARANCE DOCUMENT]
      Label: "POLICE CLEARANCE DOCUMENT"
      Upload box: same spec as ID FRONT but full width, height 140px

[PRIMARY BUTTON]
  Label: "Submit for review"
  Width: 100%
  Blue pill, 52px
  — Disabled if any required field is missing
```

---

### SCREEN 06: WORKER HOME
**Route:** `/home` (when user role = 'worker')
**Page bg:** #F0F2F5

**Top bar (NOT the standard top bar — custom header):**
```
  Left: Avatar circle (40px) — photo if set, else initials on #E7F3FF bg, text #1877F2
  Center-left: 
    "Hi, [FirstName] 👋" — 20px / 700 / #1C1E21
    "[Status badge]" — "Available" (#1877F2 text, #E7F3FF bg) or "Unavailable" (#65676B)
      Badge: 12px / 600 / radius-full / padding 2px 10px
      Tapping the badge opens an availability toggle sheet
  Right:
    sun/moon icon (dark mode toggle) — 24px / #65676B
    bell icon (notifications) — 24px / #65676B — shows red dot if unread
```

**Layout (scrollable):**

```
[SEARCH BAR]
  Full width, 48px height
  Left: search icon (20px / #65676B)
  Placeholder: "Search for jobs near you..."
  Background: #FFFFFF, border: 1.5px solid #CED0D4, radius: 9999px (pill)
  Action: Navigate to /jobs with search query

[HERO BANNER — carousel, auto-rotate every 4 seconds]
  Height: 160px, border-radius: 16px
  Dot indicators at bottom center

  SLIDE 1 — Cleaning Services:
    Background: #E7F3FF (blue-tinted)
    Left side:
      Heading: "Cleaning Services" — 20px / 700 / #1877F2
      Subtext: "Keep your home spotless with trusted cleaners." — 13px / 400 / #1C1E21
    Right side: Cleaning illustration (woman with mop/broom, blue color scheme)

  SLIDE 2 — Delivery Services:
    Background: #E7F3FF
    Heading: "Delivery Services" — 20px / 700 / #1877F2
    Subtext: "Fast and reliable doorstep deliveries." — 13px / 400 / #1C1E21
    Right: Delivery rider illustration (blue color scheme)

  SLIDE 3 — Handyman Services:
    Background: #E7F3FF
    Heading: "Handyman Services" — 20px / 700 / #1877F2
    Subtext: "Fix, build, and improve with skilled help." — 13px / 400 / #1C1E21
    Right: Handyman illustration (blue color scheme)

[ACTION PROMPTS — show only if conditions are true, dismiss when resolved]

  PROMPT A: Add profile photo
    [Shown if: user has no profile photo]
    Card: white, radius-lg, shadow-card
    Left: camera icon in #FFF8E6 circle (40px), icon color #E8A020
    Center:
      "Add a profile photo" — 15px / 600 / #1C1E21
      "Build trust with customers by adding your photo" — 13px / 400 / #65676B
    Right: "Add" button — small primary blue pill
    Action: Navigate to /more/profile/photo

  PROMPT B: Complete profile to appear in search
    [Shown if: user has no location set]
    Card: white, radius-lg, shadow-card
    Left: map-pin icon in #E7F3FF circle (40px), icon color #1877F2
    Center:
      "Complete profile to appear in search" — 15px / 600 / #1C1E21
      "Add location so nearby customers can find you, and distance is calculated correctly." — 13px / 400 / #65676B
    Right: "Update" button — small primary blue pill
    Action: Navigate to /more/profile

[ACTION REQUIRED CARD — show only if NOT verified]
  Background: #FFEBE8
  Left: shield-off icon (24px) in #FFEBE8 circle, icon color #FA3E3E
  Content:
    "ACTION REQUIRED" — 11px / 700 / uppercase / #FA3E3E
    "Not Verified" — 16px / 700 / #FA3E3E
    "Your account is not verified. Customers cannot book you until verification is approved." — 13px / 400 / #65676B
  Right: "Verify" button — small pill, bg #FA3E3E, text white
  Action: Navigate to /more/verification

[QUICK ACTION CARDS — 3 cards in a horizontal row]
  Each card: white bg, radius-lg, padding 16px, shadow-card, flex-1

  CARD 1 — My Bookings:
    Icon in card (36px): calendar-check in #E7F3FF circle, icon #1877F2
    Title: "My Booki..." (truncated) — 15px / 700 / #1877F2
    Subtitle: "View your active and..." — 12px / 400 / #65676B
    Action: Navigate to /bookings

  CARD 2 — Browse Jobs:
    Icon: search in #E6F4EA circle, icon #1DA462
    Title: "Browse J..." — 15px / 700 / #1DA462
    Subtitle: "Find job posts near..." — 12px / 400 / #65676B
    Action: Navigate to /jobs

  CARD 3 — Earnings:
    Icon: trending-up in #FFF8E6 circle, icon #E8A020
    Title: "Earnings" — 15px / 700 / #E8A020
    Subtitle: "Track your income an..." — 12px / 400 / #65676B
    Action: Navigate to /more/earnings

[BROWSE BY SERVICE — section]
  Section label: "BROWSE BY SERVICE"
  Text: 13px / 700 / uppercase / #65676B, margin-bottom 12px

  Horizontal scroll row of category chips (4 visible, scroll for more):
  Each chip: 80px wide, auto height

    CLEANING:
      Square card: 64px, bg #E7F0FD, radius 16px
      Icon: spray-can (Lucide, 28px, #1877F2) centered
      Label: "Cleaning" — 12px / 500 / #1C1E21, center below card

    REPAIRS:
      Square card: bg #FFF0E6
      Icon: wrench (28px, #E87722)
      Label: "Repairs"

    DELIVERIES:
      Square card: bg #E6F4EA
      Icon: package (28px, #1DA462)
      Label: "Deliveries"

    HANDYMAN:
      Square card: bg #F0E6FF
      Icon: hammer (28px, #7B4FBF)
      Label: "Handyman"

    PET CARE:
      Square card: bg #E6F7F7
      Icon: dog (28px, #1B9E9E)
      Label: "Pet care"

    COOKING:
      Square card: bg #FFF8E6
      Icon: utensils (28px, #E8A020)
      Label: "Cooking"

    OTHER:
      Square card: bg #F0F2F5
      Icon: grid-3x3 (28px, #65676B)
      Label: "Other"

  Action on tap: Navigate to /jobs?category=[slug]

[ACTIVE BOOKINGS — section]
  Section label: "ACTIVE BOOKINGS"
  Text: 13px / 700 / uppercase / #65676B

  If no active bookings:
    Center-aligned empty state:
      calendar-check icon (48px / #CED0D4) with gentle blue tint
      "You have no active bookings." — 16px / 600 / #1C1E21, center
      "Apply to job posts or wait for a customer to book you." — 14px / 400 / #65676B, center
      [BUTTON] "Browse Jobs" — small secondary outline pill
        Action: Navigate to /jobs

  If has active bookings:
    List of BookingCard components (see bookings spec)
```

---

### SCREEN 07: CUSTOMER HOME
**Route:** `/home` (when user role = 'customer')
**Page bg:** #F0F2F5

**Top bar (same custom header as Worker Home):**
```
  Left: Avatar + "Hi, [FirstName] 👋" + "Customer" badge (blue)
  Right: sun/moon + bell
```

**Layout (scrollable):**

```
[SEARCH BAR]
  Placeholder: "Search workers or services"

[HERO BANNER]
  Same rotating carousel (3 slides)

[QUICK ACTION GRID — 3 cards in a row]

  CARD 1 — Post a job:
    Icon: file-plus in #E7F3FF circle, icon #1877F2
    Title: "Post a job" — 15px / 700 / #1877F2
    Subtitle: "Broadcast to workers" — 12px / #65676B
    Action: Navigate to /jobs/post

  CARD 2 — Workers:
    Icon: users in #E6F4EA circle, icon #1DA462
    Title: "Workers" — 15px / 700 / #1DA462
    Subtitle: "Find someone near you" — 12px / #65676B
    Action: Navigate to /workers

  CARD 3 — Spending:
    Icon: receipt in #FFF8E6 circle, icon #E8A020
    Title: "Spending" — 15px / 700 / #E8A020
    Subtitle: "Track your expenses" — 12px / #65676B
    Action: Navigate to /more/earnings (spending view)

[BROWSE BY CATEGORY]
  Same grid as Worker Home — same categories, same colors
  Action: Navigate to /workers?category=[slug]

[ACTIVE BOOKINGS]
  Section label: "ACTIVE BOOKINGS"

  If no active bookings:
    calendar icon empty state
    "You have no active bookings."
    "Post a job or hire a nearby worker to get started."
    Two buttons side by side:
      [PRIMARY] "Post a job" → /jobs/post
      [SECONDARY outline] "Find workers" → /workers
```

---

### SCREEN 08: POST A JOB
**Route:** `/jobs/post`
**Customer only** — redirect to /home if worker

**Top bar:**
```
  Back (←), title "Post a job"
```

**Layout (scrollable — all in white cards with section grouping):**

```
[CARD 1 — Job Basics]

  [FIELD: JOB TITLE]
    Label: "JOB TITLE" (form label, #1877F2 color when focused)
    Input: type="text"
    Placeholder: "e.g. Clean 2-bedroom apartment"
    Border on focus: #1877F2

  [FIELD: DESCRIPTION]
    Label: "DESCRIPTION"
    Textarea: 4 rows
    Placeholder: "Describe the tasks, expectations, and any important details."

  [FIELD: JOB ADDRESS]
    Label: "JOB ADDRESS"
    Input: type="text"
    Placeholder: "Where will the work happen?"
    Hint: Show suggestion to use current location

[CARD 2 — Job Details]

  [FIELD: CATEGORY]
    Label: "CATEGORY"
    Dropdown (select):
      Cleaning / Repairs / Deliveries / Handyman / Pet Care / Cooking / Other
    Right: chevron-down icon
    Default: "Other"

  [FIELD: SKILLS NEEDED]
    Label: "SKILLS NEEDED"
    Helper: "Helps workers find your post faster"
    Input with tag chips:
      Placeholder: "Search or add a skill..."
      Left: search icon (16px)
      Tags appear as blue chips with × to remove
      Common skills suggested as you type

  [PRICING TYPE — toggle pills]
    Label: "PRICING TYPE"
    Two pill options:
      "Hourly" | "Fixed price"
      Selected: bg #E7F3FF, border #1877F2, text #1877F2
      Unselected: bg white, border #CED0D4, text #65676B
    Default: Hourly

  [FIELD: MAXIMUM BUDGET (PHP)]
    Label: "MAXIMUM BUDGET (PHP)"
    Helper: "This is your maximum estimated budget (hourly rate × hours)."
    Input: type="number", left prefix "₱"

[CARD 3 — Schedule]

  [FIELD: MAXIMUM WORKERS NEEDED]
    Label: "MAXIMUM WORKERS NEEDED"
    Helper: "How many workers you need for this job post (minimum 1)."
    Input: type="number", min=1, default=1

  [FIELD: WHEN DO YOU NEED THIS?]
    Label: "WHEN DO YOU NEED THIS?"
    Input: date picker, placeholder="Pick a date"
    Right: calendar icon

  [FIELD: ESTIMATED HOURS]
    Label: "ESTIMATED HOURS"
    Helper: "A rough estimate helps workers understand the scope."
    Input: type="number", placeholder="e.g. 3"

  [FIELD: START TIME]
    Label: "START TIME"
    Input: time picker, placeholder="Select time"
    Right: calendar icon

  [FIELD: END TIME]
    Label: "END TIME"
    Input: time picker, placeholder="Select time"
    Right: calendar icon

[CARD 4 — Scope]

  [WHAT'S INCLUDED]
    Label: "WHAT'S INCLUDED"
    Helper: "List tasks you want the worker to do. One item per entry."
    Add item button: "+ Add one item" (tapping adds a text input row)
    Each item row: text input + × remove button
    Up to 10 items

[BOTTOM — STICKY BUTTON]
  Position: Fixed bottom above nav bar
  [PRIMARY BUTTON]: "Post job" — full width — blue pill — 52px

  Only enabled if: Job Title, Description, Category, Budget, Date are filled
```

---

### SCREEN 09: MORE / SETTINGS
**Route:** `/more`
**Page bg:** #F0F2F5

**Top bar:**
```
  No back button (this is a root tab)
  Title: "More" — 20px / 700 / #1C1E21, left-aligned
```

**Layout (scrollable list sections):**

```
[PROFILE CARD — white card, radius-lg, top of page]
  Left: Profile photo (52px circle)
  Center:
    "[First] [Last]" — 17px / 700 / #1C1E21
    "Customer" or "Worker (Available)" — 14px / 400 / #65676B
    If worker: verification badge below (blue "✓ Verified" or red "⚠ Not Verified")
  Right: chevron-right (→)
  Action: Navigate to /more/profile

[SECTION: ACCOUNT]
  List rows with left icon + title + chevron-right (→):

  Row: My Profile
    Icon: user-round in #E7F3FF, color #1877F2
    Title: "My Profile" — 16px / 400 / #1C1E21
    Navigate to /more/profile

  Row: Verification
    Icon: shield in #E7F3FF, color #1877F2
    Title: "Verification" — 16px / 400 / #1C1E21
    Right: status badge ("Verified" in blue or "Required" in red)
    Navigate to /more/verification

  Row: Payout Details [Worker only]
    Icon: banknote in #E6F4EA, color #1DA462
    Title: "Payout Details"
    Navigate to /more/payout

  Row: Earnings [Worker only]
    Icon: trending-up in #FFF8E6, color #E8A020
    Title: "Earnings"
    Navigate to /more/earnings

[SECTION: SUPPORT]
  Row: Notifications
    Icon: bell in #E7F3FF, color #1877F2
    Title: "Notifications"
    Subtitle: "Your activity notifications"
    Navigate to /more/notifications

  Row: Help & support
    Icon: circle-help in #3A3B3C bg (dark), color #FFFFFF
    Title: "Help & support"
    Subtitle: "Get help or report an issue"

  Row: Announcements
    Icon: radio in #E7F3FF, color #1877F2
    Title: "Announcements"
    Subtitle: "News and updates from IslaJobs"

[SECTION: APP INFO]
  Row: About IslaJobs
    Icon: info in #E7F3FF, color #1877F2
    Title: "About IslaJobs"
    Navigate to /more/about

  Row: Privacy policy
    Icon: file-text in #E7F3FF, color #1877F2
    Title: "Privacy policy"
    Navigate to /more/privacy

  Row: Terms of service
    Icon: file-text in #E7F3FF, color #1877F2
    Title: "Terms of service"
    Navigate to /more/terms

[SECTION: DANGER ZONE]
  Row: Delete Account
    Icon: trash-2 in #FFEBE8, color #FA3E3E
    Title: "Delete Account" — 16px / 400 / #FA3E3E
    Subtitle: "Permanently remove your account and data"
    Action: Show confirmation modal before deleting

[SIGN OUT BUTTON — full width]
  Background: #FFEBE8
  Text: "→ Sign out" — 16px / 600 / #FA3E3E
  Radius: 12px
  Action: Supabase signOut() + redirect to /login
```

---

### SCREEN 10: PAYOUT DETAILS
**Route:** `/more/payout`
**Worker only**

**Top bar:** Back (←), title "Payout Details"

**Layout:**

```
[CARD — white]
  Heading: "Payout Method" — 18px / 700 / #1C1E21
  Subtext: "Select how you want to receive your earnings." — 14px / 400 / #65676B

  [PAYOUT METHOD TOGGLE]
    Two pill buttons side by side:
      "GCash" | "Maya"
      Selected: bg #1877F2, text white, border none
      Unselected: bg white, text #1C1E21, border 1.5px #CED0D4

  [FIELD: ACCOUNT NAME]
    Label: "ACCOUNT NAME"
    Input: prefilled with user's full name

  [FIELD: GCASH NUMBER — shown when GCash selected]
    Label: "GCASH NUMBER" — #1877F2 when focused
    Input: type="tel", placeholder="09XXXXXXXXX"
    Border: #1877F2 when focused

  [FIELD: MAYA NUMBER — shown when Maya selected]
    Label: "MAYA NUMBER" — #1877F2 when focused
    Input: type="tel"

[PRIMARY BUTTON]
  Label: "Save Payout Details"
  Full width, blue pill, 52px
```

---

### SCREEN 11: ENABLE WORKER SERVICES
**Route:** `/services` (when user is Customer but wants to also offer services)
**OR shown as a prompt on Services tab if user has no worker profile**

**Top bar:** Back (←), title "Offer Your Services"

**Layout:**

```
[CENTER BLOCK]
  Briefcase icon in #E7F3FF circle (72px), icon #1877F2 (36px)

  Heading: "Start earning as a worker"
  Text: 24px / 700 / #1C1E21 / center

  Subtext: "Keep your same account and login — just add a worker profile alongside your customer profile."
  Text: 15px / 400 / #65676B / center / max-width 280px

[FORM CARD — white card]

  [FIELD: DATE OF BIRTH]
    Label: "DATE OF BIRTH"
    Helper: "Workers must be at least 18 years old"
    Input: date picker, value prefilled if set

  [CHECKBOX ROW]
    Checkbox (blue when checked)
    Label: "I confirm I am at least 18 years old."
    Text: 14px / 400 / #1C1E21

[PRIMARY BUTTON]
  Label: "Enable Worker Profile"
  Icon: briefcase (left of text)
  Full width, blue pill, 52px
  — Enabled only when date set + checkbox checked
```

---

### SCREEN 12: JOBS TAB — WORKER (Browse Jobs)
**Route:** `/jobs` (worker view)
**Page bg:** #F0F2F5

**Top bar:** title "Jobs Near You", right: filter icon (sliders-horizontal)

**Layout:**

```
[SEARCH BAR — pill]
  Placeholder: "Search for jobs near you..."
  Left: search icon

[FILTER CHIPS — horizontal scroll]
  "All" (selected by default, blue) | "Cleaning" | "Repairs" | "Deliveries" | "Handyman" | "Pet Care" | "Cooking" | "Other"
  Selected chip: bg #1877F2, text white, radius-full
  Unselected: bg white, border #CED0D4, text #65676B

[JOB CARDS — vertical list]
  Each job card (white card, radius-lg, shadow-card, padding 16px):
    Top row:
      Category chip (small, color per category)
      Posted time: "2 hours ago" — right-aligned, 12px / 400 / #65676B
    Title: "[Job Title]" — 16px / 700 / #1C1E21
    Location: map-pin icon (14px) + "[Address]" — 13px / 400 / #65676B
    Budget: "₱[amount]/hr" or "₱[amount] fixed" — 15px / 600 / #1877F2
    Footer row:
      "[Distance] away" — 12px / #65676B
      "Apply" button — small blue pill

  If no jobs:
    Empty state: search icon (48px / #CED0D4)
    "No jobs posted nearby."
    "Check back later or widen your search area."
```

---

### SCREEN 13: JOBS TAB — CUSTOMER (My Posted Jobs)
**Route:** `/jobs` (customer view)
**Page bg:** #F0F2F5

**Top bar:** title "My Jobs", right: "Post a job" button (blue pill, small)

**Layout:**

```
[TABS: "Active" | "Completed" | "Cancelled"]
  Pill tab switcher, active: blue underline

[JOB CARDS — vertical list]
  Same card layout as worker jobs but no "Apply" button
  Shows applicant count: "3 applicants"
  Status badge: "Open" (blue) / "In Progress" (amber) / "Completed" (green)
  Action: Tap to view job detail + applicant list

  If no jobs:
    Empty state
    "You haven't posted any jobs yet."
    [PRIMARY BUTTON] "Post your first job" → /jobs/post
```

---

### SCREEN 14: CHATS
**Route:** `/chats`

**Top bar:** "Chats" title

**Layout:**

```
[SEARCH BAR]
  Placeholder: "Search conversations..."

[CHAT LIST — vertical list]
  Each chat row (white bg, padding 16px, border-bottom #F0F2F5):
    Left: Avatar (48px circle) — other party's photo or initials
    Center:
      "[Full Name]" — 16px / 600 / #1C1E21
      Last message preview — 14px / 400 / #65676B, max 1 line (ellipsis)
    Right:
      Time: "9:30 AM" or "Mon" — 12px / 400 / #65676B
      Unread count badge (if any): blue circle, white text, 20px

  If no chats:
    message-circle icon (48px / #CED0D4)
    "No messages yet."
    "Your conversations with workers or customers will appear here."
```

---

### SCREEN 15: CHAT ROOM
**Route:** `/chats/[chatId]`
**Page bg:** #F0F2F5

**Top bar:**
```
  Back (←)
  Center: Avatar (36px) + "[Other Party Name]" (16px/700) + status (online/offline dot)
  Right: more-horizontal (···) menu
```

**Layout:**

```
[MESSAGE LIST — scrollable, newest at bottom]
  Own messages:
    Bubble: right-aligned, bg #1877F2, text white (#FFFFFF)
    Text: 15px / 400
    Border radius: 18px 18px 4px 18px
    Timestamp: below bubble, right, 11px / #65676B

  Other's messages:
    Bubble: left-aligned, bg #FFFFFF, text #1C1E21
    Border radius: 18px 18px 18px 4px
    Timestamp: below bubble, left, 11px / #65676B

[MESSAGE INPUT BAR — fixed bottom]
  Background: #FFFFFF, border-top 1px #CED0D4
  Padding: 12px 16px, bottom safe area
  Row:
    Left: attachment icon (paper-clip) — 24px / #65676B
    Center: text input pill (bg #F0F2F5, radius-full)
      Placeholder: "Write a message..." — 15px / 400 / #65676B
    Right: send button — circle bg #1877F2, send icon white, 40px
      Only active when text input has content
```

---

### SCREEN 16: BOOKINGS
**Route:** `/bookings`
**Page bg:** #F0F2F5

**Top bar:** "Bookings" title

**Layout:**

```
[TABS: "Active" | "Completed" | "Cancelled"]
  Same tab switcher style as Jobs

[BOOKING CARDS — vertical list]
  White card, radius-lg, shadow-card, padding 16px:

    Top row:
      Status badge: "Pending" (#E8A020) / "Accepted" (#1877F2) / "Completed" (#1DA462) / "Cancelled" (#FA3E3E)
      Date: "Oct 24, 2026" — right, 12px / #65676B

    Service/Job title: 16px / 700 / #1C1E21
    [Customer view]: "Worker: [Name]" + avatar
    [Worker view]: "Customer: [Name]" + avatar

    Location: map-pin icon + address — 13px / #65676B
    Price: "₱[amount]" — 15px / 600 / #1877F2

    Action buttons row:
      [SECONDARY] "Chat" → chat room
      [PRIMARY] "View details" (or "Accept" if status = pending for worker)

  If no bookings:
    Empty state per tab (Active/Completed/Cancelled appropriate message)
```

---

### SCREEN 17: DARK MODE (applies to all screens)

```
All screens support dark mode toggle (sun/moon icon on Home top bar)
Preference stored in localStorage + user profile

Dark mode color swaps:
  Page bg       : #18191A
  Card bg       : #242526
  Input bg      : #3A3B3C
  Text primary  : #E4E6EB
  Text secondary: #B0B3B8
  Border        : #3E4042
  Nav bg        : #242526
  Nav border    : #3E4042

Primary blue (#1877F2) stays the same in dark mode
All semantic colors (error, warning, success) stay the same
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 6 — DATABASE SCHEMA (SUPABASE / POSTGRESQL)
## ═══════════════════════════════════════════════════════════

```sql
-- ======================================================
-- USERS TABLE
-- ======================================================
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone             TEXT UNIQUE NOT NULL,          -- e.g. "+639300704265"
  email             TEXT UNIQUE,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  date_of_birth     DATE,                          -- required for workers
  profile_photo_url TEXT,
  bio               TEXT CHECK (char_length(bio) <= 1000),
  location_lat      NUMERIC(10, 7),
  location_lng      NUMERIC(10, 7),
  role              TEXT NOT NULL CHECK (role IN ('customer', 'worker', 'both')),
  is_available      BOOLEAN DEFAULT TRUE,          -- worker availability toggle
  dark_mode         BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Each user can only read/update their own row
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_own" ON users USING (auth.uid() = id);

-- ======================================================
-- VERIFICATIONS TABLE
-- ======================================================
CREATE TABLE verifications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status                TEXT NOT NULL DEFAULT 'not_submitted'
                          CHECK (status IN ('not_submitted','pending','approved','rejected')),
  id_type               TEXT,                      -- 'PhilID','Drivers License','Passport',etc.
  id_number             TEXT,
  id_front_url          TEXT,
  id_back_url           TEXT,
  police_clearance_ref  TEXT,
  police_clearance_date DATE,
  police_clearance_url  TEXT,
  rejection_reason      TEXT,                      -- filled by admin if rejected
  submitted_at          TIMESTAMPTZ,
  reviewed_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_own_verification" ON verifications USING (auth.uid() = user_id);

-- ======================================================
-- CATEGORIES TABLE (seed data)
-- ======================================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,    -- 'cleaning','repairs','deliveries','handyman','petcare','cooking','other'
  name        TEXT NOT NULL,           -- 'Cleaning','Repairs','Deliveries','Handyman','Pet Care','Cooking','Other'
  icon_name   TEXT NOT NULL,           -- Lucide icon name: 'spray-can','wrench','package','hammer','dog','utensils','grid-3x3'
  bg_color    TEXT NOT NULL,           -- CSS hex: '#E7F0FD'
  icon_color  TEXT NOT NULL,           -- CSS hex: '#1877F2'
  sort_order  INT NOT NULL DEFAULT 0
);

-- ======================================================
-- JOB POSTS TABLE
-- ======================================================
CREATE TABLE job_posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             TEXT NOT NULL CHECK (char_length(title) <= 100),
  description       TEXT NOT NULL,
  address           TEXT NOT NULL,
  location_lat      NUMERIC(10, 7),
  location_lng      NUMERIC(10, 7),
  category_slug     TEXT NOT NULL REFERENCES categories(slug),
  skills_needed     TEXT[] DEFAULT '{}',
  pricing_type      TEXT NOT NULL CHECK (pricing_type IN ('hourly', 'fixed')),
  budget_max        NUMERIC(10, 2) NOT NULL,
  workers_needed    INT NOT NULL DEFAULT 1 CHECK (workers_needed >= 1),
  scheduled_date    DATE NOT NULL,
  estimated_hours   NUMERIC(4, 1),
  start_time        TIME,
  end_time          TIME,
  what_is_included  TEXT[] DEFAULT '{}',
  status            TEXT NOT NULL DEFAULT 'open'
                      CHECK (status IN ('open','in_progress','completed','cancelled')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
-- Customers can create, read own posts; Workers can read all open posts
CREATE POLICY "customer_own_posts" ON job_posts FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "worker_read_open" ON job_posts FOR SELECT USING (status = 'open');

-- ======================================================
-- BOOKINGS TABLE
-- ======================================================
CREATE TABLE bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id   UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  worker_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','accepted','rejected','completed','cancelled')),
  worker_note   TEXT,                    -- Worker's note when applying
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_post_id, worker_id)        -- One application per worker per job
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "booking_participant" ON bookings USING (
  auth.uid() = worker_id OR auth.uid() = customer_id
);

-- ======================================================
-- CHATS TABLE
-- ======================================================
CREATE TABLE chats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id    UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  participant_1 UUID NOT NULL REFERENCES users(id),   -- always customer
  participant_2 UUID NOT NULL REFERENCES users(id),   -- always worker
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (booking_id)
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_participant" ON chats USING (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);

-- ======================================================
-- MESSAGES TABLE
-- ======================================================
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id     UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES users(id),
  content     TEXT NOT NULL CHECK (char_length(content) <= 2000),
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "message_participant" ON messages
  USING (
    chat_id IN (
      SELECT id FROM chats WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ======================================================
-- PAYOUT DETAILS TABLE
-- ======================================================
CREATE TABLE payout_details (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  method          TEXT NOT NULL CHECK (method IN ('gcash','maya')),
  account_name    TEXT NOT NULL,
  account_number  TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payout_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_own_payout" ON payout_details USING (auth.uid() = user_id);

-- ======================================================
-- NOTIFICATIONS TABLE
-- ======================================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('booking','message','verification','system')),
  data        JSONB DEFAULT '{}',       -- extra payload (e.g. booking_id, chat_id)
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_own_notifications" ON notifications USING (auth.uid() = user_id);

-- ======================================================
-- SEED DATA — CATEGORIES
-- ======================================================
INSERT INTO categories (slug, name, icon_name, bg_color, icon_color, sort_order)
VALUES
  ('cleaning',   'Cleaning',   'spray-can',  '#E7F0FD', '#1877F2', 1),
  ('repairs',    'Repairs',    'wrench',     '#FFF0E6', '#E87722', 2),
  ('deliveries', 'Deliveries', 'package',    '#E6F4EA', '#1DA462', 3),
  ('handyman',   'Handyman',   'hammer',     '#F0E6FF', '#7B4FBF', 4),
  ('petcare',    'Pet Care',   'dog',        '#E6F7F7', '#1B9E9E', 5),
  ('cooking',    'Cooking',    'utensils',   '#FFF8E6', '#E8A020', 6),
  ('other',      'Other',      'grid-3x3',   '#F0F2F5', '#65676B', 7);
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 7 — API CONTRACTS
## ═══════════════════════════════════════════════════════════

All API calls go through Supabase client. Use `@supabase/supabase-js`.
Server-side calls use `createServerClient` from `@supabase/ssr`.

```typescript
// AUTH
supabase.auth.signInWithPassword({ phone, password })
supabase.auth.signUp({ phone, password, options: { data: { first_name, last_name, role } } })
supabase.auth.verifyOtp({ phone, token, type: 'sms' })
supabase.auth.signOut()

// USER PROFILE
supabase.from('users').select('*').eq('id', userId).single()
supabase.from('users').update({ bio, location_lat, location_lng, ... }).eq('id', userId)

// PROFILE PHOTO
supabase.storage.from('avatars').upload(`${userId}/avatar.jpg`, file)
// Then store the public URL in users.profile_photo_url

// ID DOCUMENTS (private bucket — server-side only)
supabase.storage.from('verification-docs').upload(`${userId}/id-front.jpg`, file)

// JOB POSTS
supabase.from('job_posts').select('*, categories(*), users!customer_id(*)').eq('status','open')
supabase.from('job_posts').insert({ customer_id, title, description, ... })

// BOOKINGS
supabase.from('bookings').insert({ job_post_id, worker_id, customer_id, worker_note })
supabase.from('bookings').update({ status: 'accepted' }).eq('id', bookingId)

// CHATS + MESSAGES
supabase.from('chats').select('*, messages(*)').or(`participant_1.eq.${uid},participant_2.eq.${uid}`)
supabase.from('messages').insert({ chat_id, sender_id, content })
// Realtime subscription:
supabase.channel('messages').on('postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
  (payload) => { /* add to message list */ }
).subscribe()
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 8 — BUSINESS LOGIC & VALIDATION RULES
## ═══════════════════════════════════════════════════════════

```
PHONE VALIDATION:
  - Must start with "09"
  - Must be exactly 11 digits
  - Stored in DB as "+63" + last 10 digits (e.g. "+639300704265")
  - Display in app as "09XXXXXXXXX" format

PASSWORD RULES:
  - Minimum 8 characters
  - No maximum (hash with bcrypt via Supabase Auth)

AGE VERIFICATION:
  - Date of birth required for Worker role
  - Must be 18+ years old at time of registration
  - Block if under 18: show error "You must be at least 18 years old to register as a worker."

VERIFICATION GATE:
  - Workers cannot receive bookings until verification.status = 'approved'
  - If unverified worker tries to accept a job: show "Complete verification to accept bookings"
  - Customers can always post jobs (no verification required for customers in v1.0)

ROLE LOGIC:
  - A user can have role = 'both' (customer + worker on same account, different capabilities)
  - When role = 'both': bottom nav shows all tabs; home screen shows worker home by default
  - Toggle between customer/worker view via Settings if role = 'both'
  - Registration picks initial role; can add second role later from Services tab

BOOKING FLOW:
  1. Customer posts a job (status = 'open')
  2. Worker sees job in /jobs and applies (booking created, status = 'pending')
  3. Customer receives notification, views applicants, accepts one worker
  4. Accepted booking: status = 'accepted', other bookings for same job: status = 'rejected'
  5. Job post status changes to 'in_progress' when first booking is accepted
  6. Job marked complete by customer: booking status = 'completed', job status = 'completed'

CHAT RULES:
  - Chat is only created when a booking exists between two users
  - No chat without a booking
  - Message character limit: 2000

AVAILABILITY TOGGLE:
  - Workers can set is_available = true/false
  - If unavailable: still visible in search but shows "Unavailable" badge
  - Cannot receive new booking applications when unavailable

BUDGET DISPLAY:
  - Always prefix with "₱" (Philippine Peso symbol)
  - Format: ₱1,234.00 (no decimals for round numbers: ₱1,234)
  - In cards: "₱500/hr" or "₱2,500 fixed"

DATE/TIME:
  - All dates stored as UTC in DB
  - Display in Philippine time (UTC+8)
  - Date format: "Oct 24, 2026"
  - Time format: "9:30 AM" (12-hour)

DISTANCE:
  - Calculated using Haversine formula (lat/lng)
  - Display: "0.5 km away" or "1.2 km away"
  - Round to 1 decimal place
  - If no location set: hide distance, show "Location not set"
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 9 — BUILD ORDER (STAGE BY STAGE)
## ═══════════════════════════════════════════════════════════

### STAGE 1 — PROJECT SETUP (Do first, in this exact order)
```
1. npx create-next-app@latest islajobs --typescript --tailwind --app --src-dir=false
2. Install dependencies:
   npm install @supabase/supabase-js @supabase/ssr
   npm install zustand @tanstack/react-query
   npm install react-hook-form zod @hookform/resolvers
   npm install lucide-react
   npm install date-fns
   npm install next-pwa
3. Set up Tailwind config with custom color tokens from Section 2
4. Set up globals.css with CSS variables from Section 2
5. Create Supabase project, run all SQL from Section 6
6. Create .env.local:
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY= (server-side only)
7. Set up supabase/client.ts and supabase/server.ts
8. Create Supabase storage buckets:
   - 'avatars' (public)
   - 'verification-docs' (private)
```

### STAGE 2 — AUTH SCREENS
```
Build in this order:
1. /login page (Screen 01)
2. /register page (Screen 02) with role selector
3. OTP verification flow
4. Auth middleware (protect all /app routes)
5. Redirect unauthenticated → /login
6. Redirect authenticated from /login → /home
```

### STAGE 3 — CORE LAYOUT + NAVIGATION
```
1. Bottom navigation component (role-aware: customer vs worker tabs)
2. App layout wrapper with auth guard
3. Top bar / page header component
4. Route setup for all screens in Section 4.3
```

### STAGE 4 — HOME SCREENS
```
1. Worker home (Screen 06) — all sections
2. Customer home (Screen 07) — all sections
3. Hero banner carousel (auto-rotate, blue illustrations)
4. Category grid
5. Quick action cards
6. Action prompts (conditional display)
```

### STAGE 5 — PROFILE + VERIFICATION
```
1. Edit profile form (Screen 04)
2. Add profile photo (Screen 03) with Supabase Storage upload
3. Verification form (Screen 05) with document upload
4. Verification status display
```

### STAGE 6 — JOBS
```
1. Job feed (worker view — Screen 12)
2. Post a job form (Screen 08) — full form with all fields
3. My posted jobs (customer view — Screen 13)
4. Job detail page
5. Apply to job (worker) — creates booking
```

### STAGE 7 — BOOKINGS
```
1. Booking list (Screen 16) — Active/Completed/Cancelled tabs
2. Booking detail
3. Accept/reject booking (customer)
4. Status updates + notifications
```

### STAGE 8 — CHATS
```
1. Chat list (Screen 14)
2. Chat room (Screen 15) with realtime messages
3. Supabase realtime subscription for new messages
4. Unread count badges
```

### STAGE 9 — MORE / SETTINGS
```
1. More menu (Screen 09)
2. Payout details (Screen 10)
3. Enable worker services (Screen 11)
4. Settings rows with navigation
5. Sign out
6. Delete account (with confirmation modal)
```

### STAGE 10 — POLISH & PWA
```
1. Dark mode implementation (Screen 17)
2. PWA manifest + service worker
3. App icons (briefcase on blue, all sizes)
4. Loading states (skeleton screens for all lists)
5. Error states (network errors, empty states per section)
6. Toast notifications (success/error feedback)
7. Responsive layout testing (375px mobile to 1280px desktop)
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 10 — ANTI-HALLUCINATION CHECKLIST
## ═══════════════════════════════════════════════════════════

Before finalizing any screen, verify:

```
[ ] Every color used is from Section 2 color tokens — NO invented colors
[ ] Every icon used is from Lucide React — NO other icon libraries
[ ] Every field label matches exactly as written in Section 5 — no paraphrasing
[ ] No feature exists that is not in Section 5 screens or Section 8 logic
[ ] No table exists in the DB that is not in Section 6 schema
[ ] Phone numbers always Philippine format (09XXXXXXXXX, +63 prefix in DB)
[ ] Currency always ₱ PHP — never $, €, or any other
[ ] App name is "IslaJobs" everywhere — NOT "Workermo", NOT "IslandJobs"
[ ] Primary color is #1877F2 (Facebook Blue) — NOT green, NOT any other blue
[ ] All buttons are pill-shaped (border-radius: 9999px) — NOT square
[ ] Bottom nav has exactly 6 tabs — NOT 5, NOT 7
[ ] Form labels are 11px / 700 / UPPERCASE / #65676B — NOT title case
[ ] Profile photo circle border is #1877F2 — NOT green
[ ] Verification requires government ID + Police Clearance — BOTH, not either/or
[ ] Payout methods are GCash and Maya ONLY — NOT PayPal, NOT bank transfer (v1.0)
[ ] Distance uses km — NOT miles
[ ] No star ratings or review system exists in v1.0
[ ] No subscription or payment within the app in v1.0
[ ] Dark mode toggle is sun/moon icon on home screen top bar — NOT in Settings
```

---

## ═══════════════════════════════════════════════════════════
## SECTION 11 — COMPONENT NAMING CONVENTION
## ═══════════════════════════════════════════════════════════

```
PascalCase for all components:
  BottomNav           — /components/layout/BottomNav.tsx
  PageHeader          — /components/layout/PageHeader.tsx
  PrimaryButton       — /components/ui/PrimaryButton.tsx
  SecondaryButton     — /components/ui/SecondaryButton.tsx
  InputField          — /components/ui/InputField.tsx
  FormLabel           — /components/ui/FormLabel.tsx
  Card                — /components/ui/Card.tsx
  Badge               — /components/ui/Badge.tsx
  Avatar              — /components/ui/Avatar.tsx
  RoleSelector        — /components/auth/RoleSelector.tsx
  HeroBanner          — /components/home/HeroBanner.tsx
  CategoryGrid        — /components/home/CategoryGrid.tsx
  QuickActionCards    — /components/home/QuickActionCards.tsx
  ActionPrompt        — /components/home/ActionPrompt.tsx
  VerificationStatus  — /components/verification/VerificationStatus.tsx
  DocumentUpload      — /components/verification/DocumentUpload.tsx
  JobCard             — /components/jobs/JobCard.tsx
  PostJobForm         — /components/jobs/PostJobForm.tsx
  BookingCard         — /components/bookings/BookingCard.tsx
  ChatBubble          — /components/chat/ChatBubble.tsx
  MessageInput        — /components/chat/MessageInput.tsx
  PayoutForm          — /components/payout/PayoutForm.tsx
  SettingsRow         — /components/more/SettingsRow.tsx
```

---

## ═══════════════════════════════════════════════════════════
## END OF MASTER PROMPT ENGINEERING DOCUMENT
## ═══════════════════════════════════════════════════════════

```
Document   : ISLAJOBS_MASTER_PROMPT.md
Version    : 1.0
Authority  : Ruebenson S. Acabal
Stage      : Article XII Stage 1 Discovery → Stage 2 PRD READY
Governance : CLAUDE.md v9.2 · Law 3 (No Silent Failures) · Law 4 (Minimal Code)
             Law 5 (Design Taste) · Law 7 (Test-First)
Next step  : Feed this document as context to any Claude Code session and run:
             /project-init then /orch-build-mvp — build order follows Section 9
```
