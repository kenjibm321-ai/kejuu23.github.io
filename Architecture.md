Project Architecture

Purpose

This document defines the general architectural principles of the project.

It describes how the project should be understood and how new functionality should fit into the existing system.

This document does not define specific project features.

Project-specific functionality should be documented separately.

---

1. Architecture Overview

The project should be treated as a system made of independent responsibilities.

A general application may contain some or all of the following layers:

User
  ↓
Presentation / Interface
  ↓
Application / Feature Logic
  ↓
Services
  ↓
Data / External Systems

Not every project requires every layer.

Only introduce a layer when the project actually needs it.

---

2. Existing Architecture Comes First

When modifying the project, the existing architecture should be inspected before introducing new structures.

Do not assume that a standard architecture must be used.

The correct architecture is the one that fits the project's actual requirements and current structure.

When adding a feature:

1. Identify where the feature belongs.
2. Identify which existing modules it interacts with.
3. Reuse existing architectural patterns.
4. Add new layers only when necessary.
5. Keep the change consistent with the rest of the system.

---

3. Separation of Responsibilities

Each part of the project should have a clear responsibility.

A component, module, or service should not handle unrelated responsibilities unless there is a clear reason.

Typical responsibilities may include:

Presentation

Responsible for:

- Displaying information
- Receiving user interaction
- Updating visual states
- Managing presentation-specific behavior

Application Logic

Responsible for:

- Feature behavior
- Business rules
- State transitions
- Coordinating different parts of the application

Services

Responsible for:

- API communication
- External services
- Network operations
- Other external integrations

Data Layer

Responsible for:

- Reading data
- Writing data
- Data transformation
- Persistence

Utilities

Responsible for:

- Generic reusable operations
- Shared helper functions
- Small independent operations

These are guidelines, not mandatory layers.

---

4. Dependency Direction

Dependencies should generally flow from higher-level behavior toward lower-level services.

A typical structure is:

Interface
   ↓
Application Logic
   ↓
Services
   ↓
External Resources

Avoid unnecessary circular dependencies.

Avoid making low-level utilities depend directly on high-level UI or feature modules.

---

5. Feature Organization

When the project grows, related functionality should be grouped logically.

A possible structure is:

project/
├── src/
│   ├── components/
│   ├── features/
│   ├── services/
│   ├── utils/
│   └── data/
├── assets/
└── ...

This is only an example.

The actual project structure should follow the architecture already established in the repository.

Do not reorganize the entire project simply to match this example.

---

6. Module Boundaries

Modules should have clear boundaries.

A module should expose only what other parts of the project actually need.

Avoid unnecessary coupling between modules.

When a module becomes too large:

1. Identify separate responsibilities.
2. Determine whether they are genuinely independent.
3. Extract them only if doing so improves maintainability.
4. Preserve existing behavior.

Do not split modules purely to increase the number of files.

---

7. Data Flow

Data should have a predictable flow through the application.

A typical flow may look like:

Input
  ↓
Validation
  ↓
Application Logic
  ↓
Data / Service
  ↓
Processing
  ↓
State
  ↓
Presentation

The exact flow depends on the project.

Data should not move between unrelated parts of the system without a clear reason.

---

8. State Management

State should be kept as close as practical to the functionality that owns it.

Use local state when only one feature needs the information.

Use shared state only when multiple independent parts of the application genuinely require it.

Do not introduce a global state management system for a problem that can be solved with simpler local state.

---

9. External Systems

External systems may include:

- APIs
- Databases
- Authentication providers
- File storage
- Third-party services
- External libraries

External dependencies should be isolated where practical.

The rest of the application should not need to understand unnecessary implementation details of an external service.

---

10. API Architecture

If the project uses APIs, API communication should have a clear boundary.

A typical structure is:

Application
   ↓
API / Service Layer
   ↓
External API

The application should not scatter identical request logic across many unrelated files.

API-specific error handling, request configuration, and response processing should be centralized when appropriate.

---

11. Backend Architecture

If a backend exists, the general structure may be:

Client
  ↓
Backend API
  ↓
Application Logic
  ↓
Data Layer
  ↓
Database / External Service

Sensitive operations should be handled on the server when required.

Private credentials must never be exposed to the client.

---

12. Database Architecture

When a database is used, database-specific operations should remain separated from presentation logic.

Prefer:

UI
 ↓
Application Logic
 ↓
Service / Backend
 ↓
Database

rather than allowing UI components to depend directly on database implementation details.

---

13. Configuration

Configuration should be separated from application logic when practical.

Configuration may include:

- Environment-specific settings
- API endpoints
- Feature flags
- Build settings
- Runtime options

Sensitive configuration must be handled securely.

Do not hardcode secrets into source code.

---

14. Adding New Features

When adding a new feature:

1. Understand the existing architecture.
2. Identify the appropriate module or layer.
3. Determine which existing components can be reused.
4. Define the feature's data flow.
5. Implement the smallest reasonable change.
6. Integrate it with the existing architecture.
7. Test the feature and affected functionality.

Do not create a completely separate architecture for a single feature unless there is a strong reason.

---

15. Changing Architecture

Architectural changes should be treated differently from normal feature changes.

Before changing architecture:

- Identify the problem with the current structure.
- Explain why the change is necessary.
- Identify affected modules.
- Consider migration risks.
- Consider compatibility with existing functionality.
- Plan how the change will be tested.

Large architectural changes should not be performed silently.

---

16. Scalability

The project should scale according to actual needs.

Start with the simplest architecture that satisfies the requirements.

When complexity increases:

Simple Structure
      ↓
Identify Complexity
      ↓
Separate Responsibility
      ↓
Introduce Appropriate Abstraction
      ↓
Verify

Do not introduce enterprise patterns, complex state systems, microservices, or unnecessary infrastructure without a real requirement.

---

17. Compatibility

New functionality should integrate with existing functionality whenever possible.

Before changing a shared module, consider:

- What depends on it?
- What behavior does it currently provide?
- Could another feature be affected?
- Does its public interface need to remain compatible?

Changes to shared infrastructure require additional caution.

---

18. Architecture Decision Principle

Architecture should optimize for:

- Simplicity
- Clarity
- Maintainability
- Reliability
- Security
- Appropriate scalability

The project should not become more complicated simply because a more complicated architecture exists.

Use the smallest architectural solution that correctly solves the problem.

---

Core Principle

Architecture exists to make the project easier to understand and maintain.

Do not design the project around architecture.

Design the architecture around the project.