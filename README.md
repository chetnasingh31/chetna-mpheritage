# MP Heritage Portal & Administrator Console

An official-grade, premium digital portal designed for the **Directorate of Archaeology, Government of Madhya Pradesh**. The platform acts as the public interface for heritage exploration, museum discovery, souvenir replica shopping, and administrative oversight.

---

## 🏛️ Project Architecture & Modules

The project is structured as a mono-repository containing both frontend and backend modules:

```
.
├── backend/            # Node/Express API Server (Skeleton setup)
├── frontend/           # React + Vite application (Portal, Shop, & Admin Console)
├── package.json        # Root workspace manager and orchestrator
├── .gitignore          # Unified root-level Git ignore configuration
└── README.md           # Master documentation file
```

### 1. Public Visitor Portal (`frontend/`)
* **Heritage Exploration**: Discover UNESCO World Heritage sites (Bhimbetka, Sanchi, Khajuraho) and regional state museums.
* **E-Ticket Booking System**: Fully interactive online e-ticket booking modal supporting nationality-based pricing tier checks, date picker, automated ticket quantity calculation, and a printable PDF-style receipt with procedural vector QR code generator.
* **Souvenir Replica Shop**: 
  * Premium Indian-craft product catalog with period-based filtering (Gupta Era, Chandela Era, Paramara Era).
  * 360-degree interactive image carousel showcasing replica items from different angles.
  * Real-time customer review board with an interactive star rating submission form.
  * Horizontal recommendation carousel featuring "Also Bought Together" items.

### 2. Official Administrative Console (`/admin`)
* **Secure Authentication**: Secure, role-based login system with dynamic verification code challenges.
* **Admin Dashboard**: Real-time stats band tracking active visitors, pending excavation approvals, and pending reviews.
* **Content Workspace**: Edit, publish, or delete official government circulars, recruitment notices, and active tenders.
* **Approvals & Permits**: Oversee and authorize structural excavation permits.
* **User & Access Management**: Manage administrative accounts, roles, and granular system permission matrices.
* **Feature Flags**: Dynamic toggle switches to enable/disable system modules (e.g., Ticket Bookings, International Gateway).
* **System Audit Logs**: Time-stamped event trails tracking all administrator actions.

---

## 🎨 Theme & Typography Guidelines

Following Indian Government web accessibility and design guidelines, the interface uses a formal, readable, and premium light theme:

* **Typography**:
  * **Headings**: `Montserrat` (Sans-Serif) – Geometric, official, and authoritative.
  * **Body & Lists**: `Inter` (Sans-Serif) – Highly readable for descriptions, tables, and system logs.
  * **Mono Elements**: Monospace font families for security reference codes and audit trails.
* **Color Palette**:
  * **Primary Backgrounds**: Soft cream & light parchment (`#FAF6F0`, `#FCFAF7`, `#FCFAF5`).
  * **Cards & Containers**: Clean white (`#FFFFFF`) with thin terracotta borders (`rgba(184, 92, 56, 0.15)`).
  * **Primary/Terracotta Accent**: Deep clay terracotta (`#B85C38`).
  * **Secondary/Gold Accent**: Saffron gold (`#C9A84C`).
  * **Success/Active Badges**: Forest green (`#2E7D32` / `#E8F5E9`).
  * **Error/Destructive Badges**: Deep crimson (`#D32F2F` / `#FFEBEE`).

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18
* **Build Tooling**: Vite (featuring fast Hot Module Replacement)
* **Styling**: Pure CSS (Design tokens configured in `index.css`)
* **Deployment & Mocking**: LocalStorage-backed state persistence for notices, bookings, and custom review records.
* **Backend Framework**: Express.js + Node.js (with structured Config, Controller, Route, Model, and Middleware directories)

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* npm (v8 or higher)

### Setup & Installation

From the project root directory, run the following commands:

1. **Install all dependencies** (for both frontend and backend):
   ```bash
   npm run install:all
   ```

2. **Start the development servers** concurrently:
   ```bash
   npm run dev
   ```
   * **Frontend Server**: running at `http://localhost:5173`
   * **Backend Server**: running at `http://localhost:5000`

### Demo Credentials
To access the Administrator Console (`/admin`):
* **Email**: `superadmin@mp.gov.in`
* **Password**: `demo123`
* **Passcode**: Enter the 6-digit code shown on the screen under the security warning message.
