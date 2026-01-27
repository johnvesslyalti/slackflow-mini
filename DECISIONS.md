# Design Decisions

## Requests vs Tickets
Requests represent customer intent.
Tickets represent agent-owned work.
This separation ensures explicit ownership, avoids duplicate handling,
and enables accurate SLA tracking.

## Database as the Source of Truth
All ownership and state transitions are enforced at the database layer
using transactions and constraints.
This prevents race conditions when multiple agents act concurrently.

## SLA Design
SLA is implemented as a timestamp-derived state machine rather than timers.
This guarantees correctness across restarts, delayed jobs,
and partial system failures.

## Slack as an Adapter
Slack is treated as an external integration layer.
Slack interactions are translated into domain commands,
keeping core business logic independent of Slack-specific behavior.

## Trade-offs
- Slack integration is intentionally mocked to focus on system design
- No distributed locking; database constraints are sufficient for this scope
- Single-region deployment assumed
