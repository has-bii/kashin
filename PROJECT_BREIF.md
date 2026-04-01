# Project Brief: Kashin — AI-Powered Expense & Income Tracker

## The Idea

**Kashin** — a SaaS app that tracks expenses and income. Users can manually add entries (CRUD), or forward receipt/invoice emails to a dedicated address — AI automatically extracts vendor, amount, date, and category, then logs it. Users confirm or edit before saving.

## Core Features

- **Expense CRUD:** Add, view, edit, delete expenses with category, amount, date, and notes
- **Income CRUD:** Add, view, edit, delete income entries with source, amount, date, and notes
- **AI Email Parsing:** Forward emails (invoices, bills, payment confirmations) to a dedicated address → AI extracts and auto-fills expense/income data
- **Dashboard:** Overview of income vs expenses, spending trends, and category breakdowns
- **Reports & Export:** Monthly/yearly summaries, CSV/PDF export
- **Multi-tenancy:** Personal
- **Real-time updates:** Live feed via SSE when new entries are processed
- **Background jobs:** Email polling, AI processing queue, recurring transaction detection

## Target Audience

Everyone — individuals
