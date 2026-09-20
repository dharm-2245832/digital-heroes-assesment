# AGENTS.md

## Project Overview

Build a production-quality MVP for Digital Heroes assessment.

This is a full-stack web application combining:

- Golf score tracking
- Charity contributions
- Monthly prize draws
- Subscription management

The application must prioritize functionality, clean architecture, and maintainability.

---

## Architecture Rules

Use:

- Next.js App Router
- JavaScript only
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- shadcn/ui

Avoid:

- TypeScript
- Redux
- Unnecessary abstractions
- Complex microservice architecture

---

## UI Rules

Use shadcn components whenever possible.

Design language:

- Modern SaaS
- Premium
- Minimal
- Soft gradients
- Smooth animations

Avoid:

- Golf clichés
- Excessive colors
- Heavy glassmorphism

---

## Coding Standards

- Reusable components
- Server Components first
- Use Server Actions where possible
- Validate all forms using Zod
- Never duplicate logic
- Keep files small and maintainable

---

## Database Rules

Always update:

- prisma/schema.prisma
- seed scripts

when adding models.

Use relational design.

Avoid JSON fields unless necessary.

---

## Security Rules

- Validate all user input
- Protect admin routes
- Protect server actions
- Never expose secrets
- Use environment variables

---

## Deliverables

Must be functional:

- Authentication
- Subscription System
- Score Management
- Charity Management
- Draw Engine
- User Dashboard
- Admin Dashboard

---

## Success Criteria

Priority Order:

1. Functionality
2. Data Integrity
3. Responsive Design
4. UI Polish
5. Performance

If time is limited:

Finish functionality before aesthetics.
