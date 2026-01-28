# SlackFlow Mini

SlackFlow Mini is a NestJS-based backend application designed to manage support requests, tickets, and Service Level Agreements (SLAs), with integration capabilities for Slack.

## Features

-   **Request Management**: Handle incoming support requests.
-   **Ticket System**: Convert requests into tracking tickets.
-   **SLA Tracking**: Monitor SLA status (Active, Paused, Breached, Completed) for tickets.
-   **Slack Integration**: (Module structure present) Integration points for Slack interactions.
-   **Prisma ORM**: Robust database interaction using Prisma with PostgreSQL.

## Technologies

-   [NestJS](https://nestjs.com/) - A progressive Node.js framework.
-   [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM.
-   [PostgreSQL](https://www.postgresql.org/) - Open Source Relational Database.
-   [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.

## Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn
-   PostgreSQL database instance

## Request Flow

```mermaid
graph TD
    User((User)) -->|/slack/request| Request[Request Created<br/>Status: OPEN]
    
    subgraph "Acceptance Flow"
        Request -->|/slack/accept| Transaction1{Transaction}
        Transaction1 -->|Success| Ticket[Ticket Created<br/>Status: ACTIVE]
        Transaction1 -->|Success| SLA[SLA Started<br/>Status: ACTIVE]
        Transaction1 -->|Success| ReqUpdate[Request Updated<br/>Status: ACCEPTED]
        Transaction1 -->|Fail| Rollback1[Rollback]
    end

    subgraph "Resolution Flow"
        ReqUpdate -->|/slack/resolve| Transaction2{Transaction}
        Ticket -->|/slack/resolve| Transaction2
        Transaction2 -->|Success| TicketResolved[Ticket Resolved<br/>Status: RESOLVED]
        Transaction2 -->|Success| SLACompleted[SLA Completed<br/>Status: COMPLETED]
        Transaction2 -->|Success| RequestClosed[Request Closed<br/>Status: CLOSED]
        Transaction2 -->|Fail| Rollback2[Rollback]
    end
```

## Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd slackflow-mini
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (copy from example if available, or set manually):
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/slackflow?schema=public"
    ```

4.  **Database Setup**
    Run Prisma migrations to set up your database schema:
    ```bash
    npx prisma migrate dev
    ```

## Running the Application

-   **Development**
    ```bash
    npm run start:dev
    ```

-   **Production**
    ```bash
    npm run build
    npm run start:prod
    ```

## Project Structure

-   `src/requests`: Handles incoming user requests.
-   `src/tickets`: Manages tickets created from requests.
-   `src/sla`: Service Level Agreement tracking logic.
-   `src/slack`: Slack integration module.
-   `prisma/schema.prisma`: Database schema definition.

## Development

-   **Linting**: `npm run lint`
-   **Formatting**: `npm run format`
-   **Testing**: `npm run test`

## Failure Modes Considered

- Concurrent request acceptance by multiple agents
- Duplicate Slack events due to retries
- Partial failures during request resolution
- SLA drift caused by delayed background jobs

The system relies on database constraints, transactions,
and timestamp-based calculations to remain correct
under these conditions.

