# Vitaway Dashboard

A comprehensive organization/employer dashboard for a multi-tenant health platform built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Overview

This dashboard enables organizations to:

- Monitor employee engagement and health trends
- Track program participation and utilization
- Identify population-level risk categories
- Generate and export reports
- Manage employee onboarding
- Send notifications to employees

## Features

### 🏠 Dashboard Overview
- Total employees enrolled
- Active vs inactive users
- Engagement rate percentage
- Risk category distribution
- Program participation metrics

### 🏥 Population Health
- BMI distribution analysis
- Blood pressure risk levels
- Diabetes risk indicators
- Stress and nutrition assessments
- Program completion rates

### 📊 Engagement & Utilization
- Login frequency trends
- Weekly/monthly active users
- Appointment booking and attendance
- Learning content completion
- Inactivity indicators

### 👥 Employee Management
- Manual employee onboarding
- Bulk CSV upload
- Employee list with engagement status
- Program assignment
- Notification system

### 📄 Reporting & Export
- Generate organization-level reports
- Export data in PDF and CSV formats
- View export history
- Audit trail for compliance

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vitaway-employeer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` with your configuration

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                 # Overview page
│   │   ├── population-health/       # Population health metrics
│   │   ├── engagement/              # Engagement analytics
│   │   ├── employees/               # Employee management
│   │   └── reports/                 # Reporting & exports
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Root page (redirects to dashboard)
├── components/
│   ├── dashboard/                   # Dashboard-specific components
│   │   ├── metric-card.tsx
│   │   ├── chart-card.tsx
│   │   ├── data-table.tsx
│   │   ├── risk-badge.tsx
│   │   └── status-badge.tsx
│   ├── layout/                      # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── dashboard-layout.tsx
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── utils.ts                     # Utility functions
│   ├── auth.ts                      # Authentication utilities
│   └── api-client.ts                # API client
├── types/
│   └── index.ts                     # TypeScript type definitions
```

## Security & Privacy

### Role-Based Access Control

Two user roles are supported:

1. **Organization Admin**
   - Full access within their organization
   - Can onboard employees
   - Can view analytics and reports
   - Can export data
   - Can send notifications

2. **Organization Analyst** (Optional)
   - Read-only access
   - Cannot onboard employees
   - Cannot export sensitive data

### Tenant Isolation

- All data is scoped to the authenticated organization
- Backend enforces strict tenant-based access control
- Frontend components assume proper authorization checks

### Data Privacy

- All displayed data is aggregated and anonymized
- No individual health records are accessible
- Risk indicators are non-diagnostic
- Export operations are audited

## API Integration

The application uses a centralized API client (`lib/api-client.ts`) for all backend communications. 

### Key API Endpoints (to be implemented):

- `GET /dashboard/metrics` - Dashboard overview metrics
- `GET /dashboard/population-health` - Population health data
- `GET /dashboard/engagement` - Engagement metrics
- `GET /employees` - Employee list (paginated)
- `POST /employees` - Add employee
- `POST /employees/bulk-upload` - Bulk upload employees
- `GET /reports` - List reports
- `POST /reports/generate` - Generate new report
- `GET /exports/history` - Export audit trail

## Authentication Setup

The dashboard includes authentication utilities in `lib/auth.ts`. You need to integrate with your authentication provider:

### Recommended Auth Providers:
- NextAuth.js
- Clerk
- Auth0
- Supabase Auth

### Required Implementation:
1. Update `getCurrentUser()` function
2. Update `getCurrentOrganizationId()` function
3. Implement session management
4. Add protected routes middleware

## Data Models

All TypeScript interfaces and types are defined in `types/index.ts`:

- `UserRole` - Organization admin or analyst
- `RiskCategory` - Low, medium, high
- `DashboardMetrics` - Overview metrics
- `PopulationHealthData` - Health trend data
- `EngagementMetrics` - Usage metrics
- `Employee` - Employee record
- `Report` - Report metadata
- `ExportHistory` - Export audit record

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Next Steps

1. **Integrate Authentication**
   - Choose and implement an auth provider
   - Update auth utilities in `lib/auth.ts`
   - Add protected route middleware

2. **Connect Backend API**
   - Implement API endpoints
   - Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
   - Replace mock data with real API calls

3. **Add Real-time Features**
   - WebSocket integration for live updates
   - Notification system
   - Real-time engagement tracking

4. **Enhance Security**
   - Implement rate limiting
   - Add CSRF protection
   - Configure CSP headers
   - Enable audit logging

5. **Testing**
   - Add unit tests
   - Add integration tests
   - Add E2E tests

6. **Monitoring**
   - Error tracking (e.g., Sentry)
   - Analytics (e.g., Google Analytics)
   - Performance monitoring

## Contributing

1. Follow the established code structure
2. Maintain TypeScript type safety
3. Use shadcn/ui components consistently
4. Follow Tailwind CSS best practices
5. Ensure responsive design
6. Document new features

## License

[Your License Here]

## Support

For questions or issues, please contact your development team.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
