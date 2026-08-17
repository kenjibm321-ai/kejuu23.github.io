Project Rules

Purpose

This document defines the general rules that must be followed when working on this project.

These rules are project-wide and apply to developers, contributors, and AI coding assistants.

The goal is to keep the project:

- Consistent
- Maintainable
- Predictable
- Secure
- Understandable
- Easy to extend

These rules describe how changes should be made, not what specific features the project must contain.

---

1. Understand Before Changing

Before modifying the project:

1. Inspect the existing structure.
2. Identify the relevant files.
3. Understand how the affected functionality currently works.
4. Check existing utilities, components, functions, and services.
5. Check the project architecture.
6. Determine whether the requested functionality already exists in another form.

Do not make changes based only on assumptions.

---

2. Preserve Existing Functionality

Existing functionality should be preserved unless the requested change explicitly requires modifying or removing it.

Do not:

- Remove working features without a reason.
- Rewrite unrelated code.
- Replace existing implementations unnecessarily.
- Change behavior that was not part of the requested task.
- Modify unrelated files simply because they could be improved.

A focused change should remain focused.

---

3. Changes Must Have a Reason

Every meaningful change should have a clear purpose.

Before adding something, consider:

- Is it required?
- Does the project already have a solution?
- Can existing code be reused?
- Does the change introduce unnecessary complexity?
- Does it conflict with the current architecture?
- Will it make future maintenance harder?

Do not add complexity simply because it is technically possible.

---

4. Dependencies

Do not introduce new dependencies without a clear reason.

Before adding a dependency:

1. Check whether the functionality can be implemented with existing tools.
2. Check whether an existing dependency already provides the functionality.
3. Consider the maintenance and performance cost.
4. Consider whether the dependency is appropriate for the project.
5. Only introduce it when the benefit justifies the additional complexity.

Do not replace the project's technology stack without explicit approval.

---

5. Technology Decisions

Respect the technologies already used by the project.

Do not automatically introduce:

- A framework
- A library
- A build system
- A database
- A new programming language
- A new architecture

simply because it may be popular or convenient.

Technology changes should be intentional and compatible with the project's goals.

---

6. File and Folder Changes

Create new files only when they provide a meaningful organizational benefit.

Before creating a new file:

- Check whether an existing file already has the appropriate responsibility.
- Check whether the new file would reduce complexity.
- Follow the existing naming conventions.
- Place the file in the appropriate directory.

Do not create unnecessary files.

Do not move or rename existing files without a reason.

---

7. Code Reuse

Prefer reuse over duplication.

Before creating new logic:

- Search for existing functions.
- Search for existing utilities.
- Search for existing components.
- Search for existing services.
- Search for existing styles.

If existing code can be reused safely, reuse it.

Do not duplicate logic simply because it is faster to write.

---

8. Separation of Responsibilities

Keep responsibilities separated.

Examples:

- UI code handles presentation and interaction.
- Application logic handles behavior.
- Services handle external communication.
- Data layers handle data access.
- Utilities handle reusable generic operations.

Do not place unrelated responsibilities into the same module without a clear reason.

---

9. Naming

Use clear and descriptive names.

Names should communicate what something represents or does.

Avoid meaningless names such as:

- "thing"
- "stuff"
- "temp"
- "random"
- "test2"
- "newFile"

Temporary names may be used during development but should not remain in finished code.

Follow the project's existing naming conventions.

---

10. Configuration and Secrets

Never expose sensitive information unnecessarily.

Do not commit:

- API keys
- Passwords
- Private tokens
- Authentication credentials
- Private certificates
- Database credentials
- Other secrets

Use the project's existing environment or configuration system when applicable.

Do not modify security-sensitive configuration without understanding its consequences.

---

11. Error Handling

Code should handle expected failures appropriately.

Consider:

- Invalid input
- Missing data
- Network failures
- Unexpected responses
- Missing resources
- Permission problems
- Invalid configuration

Do not silently ignore important errors.

Error handling should provide enough information to diagnose the problem without exposing sensitive information.

---

12. User Input and External Data

Do not assume that external input is always valid.

Validate or safely handle data when appropriate.

This includes:

- User input
- API responses
- URL parameters
- Form data
- Files
- Database results
- Third-party services

Never trust external data blindly.

---

13. Security

Security should be considered whenever a change involves:

- Authentication
- Authorization
- User input
- External APIs
- Databases
- File handling
- Sensitive information
- Server-side functionality

Do not weaken existing security controls to make development easier.

---

14. Performance

Avoid unnecessary performance costs.

Consider:

- Repeated operations
- Excessive DOM manipulation
- Large assets
- Unnecessary network requests
- Memory usage
- Expensive computations
- Excessive animations

Do not optimize prematurely, but do not introduce obvious inefficiencies without reason.

---

15. Documentation

Update relevant documentation when a change significantly affects:

- Project architecture
- Development rules
- Public APIs
- Configuration
- Installation
- Important workflows
- Major behavior

Do not create documentation for trivial implementation details unless it provides lasting value.

---

16. AI Coding Assistant Rules

When an AI coding assistant works on this project:

1. Read the relevant project documentation first.
2. Inspect existing code before making assumptions.
3. Follow the existing architecture.
4. Follow the project's naming and style conventions.
5. Reuse existing code where appropriate.
6. Modify only what is necessary.
7. Do not invent project requirements.
8. Do not invent APIs, dependencies, files, or architecture.
9. Do not replace technologies without approval.
10. Do not perform unrelated refactoring.
11. Explain major architectural changes before applying them.
12. Verify the result after making changes.

If the requirements are ambiguous and the decision could significantly affect the project, ask for clarification instead of guessing.

---

17. Refactoring

Refactoring is allowed when it provides a clear benefit.

However:

- Do not refactor unrelated code during a focused task.
- Do not change behavior unintentionally.
- Do not rewrite functioning code simply for personal preference.
- Preserve existing interfaces when possible.
- Verify functionality after refactoring.

---

18. Completion Standard

A task is not considered complete merely because the code has been written.

Before considering a change complete:

- The implementation should match the request.
- Existing functionality should remain intact.
- Relevant errors should be handled.
- The code should follow project conventions.
- The change should be tested appropriately.
- Any important limitations should be reported.

See "TESTING.md" for the project's testing requirements.

---

Core Principle

Understand first.

Change only what is necessary.

Preserve what already works.

Prefer simplicity.

Do not introduce complexity without a reason.