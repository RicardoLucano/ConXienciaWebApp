# ROLE

You are a Senior Software Architect, Senior Full Stack Engineer, Product Manager, UX Designer, and AI Systems Engineer.

You have 15+ years of experience designing scalable SaaS applications, CRM systems, AI-assisted productivity tools, and modern cloud architectures.

Your responsibility is NOT only to write code.

Your responsibility is to design a production-ready system with clean architecture, scalability, security, maintainability, and future AI integration.

Think like an engineer building a product that will be used daily for many years.

---

# PROJECT

Develop a modern web application called:

# FuXion Business Hub

The application will become the central operating system for myself and my FuXion business team.

The platform must centralize customer management, partner management, lead tracking, follow-ups, analytics, notifications, AI assistants, productivity tools, and future business modules.

The project should be designed with long-term scalability in mind.

---

# PRIMARY GOALS

The application should help users:

- Never forget a follow-up.
- Manage customers efficiently.
- Manage business partners.
- Manage prospects.
- Improve business organization.
- Analyze performance.
- Increase productivity.
- Integrate AI assistants.
- Become the single workspace for daily business activities.

---

# TARGET USERS

Initially:

- Only me

Later:

- My entire FuXion team

Later:

- Hundreds or thousands of users.

Therefore, architecture must support multi-tenancy.

Every user must have isolated data.

---

# AUTHENTICATION

Implement secure authentication using:

- Google OAuth

Each authenticated user must have:

- Their own private database records
- Secure authentication
- Protected routes
- Session management
- Role-based permissions (future)

Future roles:

- Owner
- Admin
- Team Leader
- Member

---

# CORE MODULES

## 1. Customer CRM

Each customer should contain:

- Full name
- Phone number
- Country
- City
- Notes
- Interested products
- Purchased products
- Purchase history
- Last purchase date
- Next follow-up date
- Status
- Tags
- Creation date
- Last modification date

Capabilities:

- Create
- Edit
- Delete
- Search
- Filter
- Sort
- Archive

Future AI features:

Automatically calculate the ideal follow-up date based on:

- Product type
- Purchase frequency
- Customer behavior
- Previous interactions

Initially:

Follow-up dates can be manually assigned.

---

## 2. Customer Leads

Similar to Customer CRM.

Without purchase history.

Fields:

- Name
- Phone
- Interest
- Notes
- Follow-up date
- Status
- Tags

---

## 3. Partner CRM

Fields:

- Name
- Phone
- Country
- Notes
- Current rank
- Team size
- Last contact
- Next follow-up
- Tags

Future:

Automatically synchronize follow-up scheduling with Google Calendar.

---

## 4. Partner Leads

Fields:

- Name
- Phone
- Notes
- Interest level
- Follow-up date
- Status

---

## 5. Notifications

The application must generate intelligent reminders.

Notification types:

### Upcoming Follow-up

Generated:

2 days before scheduled follow-up.

### Overdue Follow-up

Generated:

Immediately after missing the scheduled date.

Notifications should be filterable by:

- Customer
- Customer Lead
- Partner
- Partner Lead

Notification center requirements:

- Read/unread
- Archive
- Search
- Filter
- Mark all as read

---

## 6. Dashboard

Provide KPI dashboards.

Examples:

Customers

- Total customers
- New customers this month
- Purchases
- Upcoming follow-ups
- Missed follow-ups

Partners

- Total partners
- Active partners
- New partners
- Upcoming follow-ups

Leads

- Conversion rate
- Active leads
- New leads

General

- Daily activity
- Weekly activity
- Monthly activity

Use interactive charts.

---

## 7. Google Calendar Integration

Features:

Read calendar

Create events

Update events

Delete events

Automatically synchronize follow-up events.

---

## 8. Quick Actions

Every phone number should provide:

- WhatsApp shortcut
- Copy phone number
- Call shortcut (future)

---

## 9. Resource Center

Create a configurable page containing useful shortcuts.

Examples:

- OFFIX Login
- Preferred Client Portal
- Xion Academy
- Aware FuXion
- Support WhatsApp
- Internal Documentation

The administrator should be able to add, edit or remove shortcuts.

---

## 10. Inventory Module (Future)

Reserve architecture.

Future capabilities:

Products

Stock

Warehouses

Purchase Orders

Inventory Movements

Reports

---

## 11. AI Assistant (Future)

The application should be designed so AI modules can be plugged in without requiring architecture changes.

Planned AI capabilities:

### Conversation Analysis

Analyze:

- WhatsApp conversations
- Instagram conversations
- Messenger conversations

Provide:

Communication quality score

Leadership score

Sales score

Empathy score

Trust score

Persuasion score

Follow-up quality

Missed opportunities

---

### Personality Analysis

Infer personality using:

- DISC
- Big Five
- Communication style
- Buying behavior

Suggest:

- Best communication style
- Best follow-up strategy
- Objections
- Recommended response

---

### AI Response Generator

Generate responses that are:

Professional

Empathetic

Persuasive

Personalized

Context-aware

---

## 12. Reports

Export:

Excel

CSV

PDF

Reports should support filtering by:

Date

User

Customer

Partner

Lead

Status

Country

---

## 13. Internationalization

Current language:

Spanish

Future:

English

French

Italian

The application should use proper i18n architecture from day one.

---

# NON-FUNCTIONAL REQUIREMENTS

Architecture should prioritize:

Scalability

Maintainability

Clean Code

SOLID

Domain Driven Design when appropriate

Reusable components

Responsive design

Accessibility

Security

Performance

Modularity

Offline-ready architecture (future)

Dark mode

Light mode

Mobile-friendly

PWA-ready

---

# TECH STACK

Preferred:

Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- TailwindCSS
- shadcn/ui

Backend

- Node.js
- NestJS (preferred over Express)
- TypeScript

Database

Recommend the best option between:

- PostgreSQL
- Supabase
- Firebase
- MongoDB

Explain why.

Authentication

Google OAuth

ORM

Prisma

Storage

Recommend the best option.

Notifications

Recommend architecture.

Hosting

Recommend cloud provider.

CI/CD

Recommend pipeline.

---

# EXPECTED DELIVERABLES

Before writing any code, produce:

1. System architecture

2. Technology justification

3. Database schema

4. ER Diagram

5. Folder structure

6. API specification

7. Authentication flow

8. Wireframes

9. UX proposal

10. UI design system

11. Component architecture

12. Database migration strategy

13. AI integration strategy

14. Notification architecture

15. Security considerations

16. Deployment strategy

17. Roadmap divided into milestones

18. Development plan by iterations

19. Risk analysis

20. Future scalability recommendations

Only after these documents are approved should implementation begin.

Throughout development, always follow software engineering best practices and explain architectural decisions before implementing them. Favor long-term maintainability over short-term speed, and ensure the solution is extensible enough to evolve into a complete Business Operating System with integrated AI capabilities.