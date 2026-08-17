Testing Guidelines

Purpose

This document defines the general testing process for changes made to the project.

A change should not be considered complete merely because the code was written successfully or because no immediate error was observed.

The purpose of testing is to verify that:

- The requested behavior works.
- Existing functionality remains intact.
- Expected errors are handled.
- Important edge cases are considered.
- The change does not introduce unnecessary regressions.

Testing should be appropriate to the type and risk of the change.

---

1. Testing Principle

Every meaningful change should be verified before it is considered complete.

General workflow:

Implement
   ↓
Inspect
   ↓
Basic Validation
   ↓
Functional Testing
   ↓
Error / Edge Case Testing
   ↓
Regression Testing
   ↓
PASS → Complete
FAIL → Fix → Test Again

Not every change requires the same depth of testing.

A small text change does not require the same testing process as a database or authentication change.

---

2. Understand What Changed

Before testing, identify:

- What was changed?
- Which files were modified?
- Which functionality is affected?
- Which existing functionality depends on the changed code?
- What could reasonably break because of the change?

Testing should focus on both the direct feature and its affected surroundings.

---

3. Basic Validation

Perform appropriate basic validation before functional testing.

Depending on the project, this may include:

- Syntax checking
- Type checking
- Linting
- Formatting validation
- Build validation
- Compilation
- Import validation
- Dependency validation
- Configuration validation

Use the project's existing tools when available.

Do not invent a separate validation system unnecessarily.

---

4. Functional Testing

Test the actual behavior requested by the change.

Verify that:

- The feature can be used.
- Expected inputs produce expected results.
- Expected outputs are correct.
- User interactions work as intended.
- Data is processed correctly.
- State changes occur correctly.
- Related functionality behaves correctly.

Do not test only whether the code runs.

Test whether it produces the correct behavior.

---

5. Error Testing

Test expected failure conditions.

Depending on the project, this may include:

- Invalid input
- Missing input
- Missing data
- Network failure
- Invalid response
- Missing resource
- Permission failure
- Invalid configuration
- Unexpected state

The system should fail gracefully where appropriate.

Important errors should not be silently ignored.

---

6. Edge Case Testing

Consider unusual but valid situations.

Examples include:

- Empty values
- Very large values
- Very small values
- Long text
- Special characters
- Duplicate actions
- Repeated requests
- Large datasets
- Missing optional values
- Unexpected but valid combinations of inputs

The purpose is not to test every imaginable scenario.

Focus on cases that could realistically expose a defect.

---

7. Regression Testing

After making a change, verify that existing functionality still works.

At minimum:

- Test the changed functionality.
- Test directly related functionality.
- Test shared components or utilities affected by the change.
- Test important workflows affected by the change.

A feature is not considered successful if it fixes one problem while breaking another.

---

8. Integration Testing

When multiple parts of the system interact, test the connection between them.

Examples:

UI → Application Logic
Application → API
API → Database
Service → External Provider
Module → Module

Verify that:

- Data is passed correctly.
- Expected responses are handled.
- Errors propagate appropriately.
- Interfaces between components remain compatible.

---

9. UI Testing

For projects containing a user interface, verify:

- Layout
- Content
- Navigation
- Inputs
- Buttons
- Interactive elements
- Loading states
- Error states
- Empty states
- Success states
- Focus states
- Disabled states

Check that the interface remains usable after the change.

---

10. Responsive Testing

For responsive interfaces, test appropriate screen sizes and environments.

Consider:

- Mobile
- Tablet
- Desktop

Check for:

- Overflow
- Broken layouts
- Overlapping elements
- Unreadable content
- Incorrect spacing
- Inaccessible controls
- Navigation problems

Responsive testing is required when a change can affect layout or interaction across different screen sizes.

---

11. API and Network Testing

When the project communicates with external services, verify:

- Request method
- Request parameters
- Request payload
- Response status
- Response structure
- Loading behavior
- Failure behavior
- Timeout behavior where relevant

Do not assume external services always return valid data.

Never expose sensitive credentials while testing.

---

12. Data Testing

When working with structured or persistent data, verify:

- Expected data exists.
- Data has the expected structure.
- Missing data is handled.
- Invalid data is handled.
- Data transformations are correct.
- Data is stored or retrieved correctly.

Testing should account for both valid and invalid data when appropriate.

---

13. Security Testing

Additional testing is required when changes involve:

- Authentication
- Authorization
- User input
- File handling
- APIs
- Databases
- Sensitive information
- Permissions
- External integrations

Verify that:

- Sensitive information is not exposed.
- Unauthorized actions are rejected.
- Input is handled safely.
- Existing security controls remain intact.
- Secrets are not committed to source code.

Do not weaken security controls simply to make testing easier.

---

14. Performance Testing

Performance should be considered when changes may affect:

- Large datasets
- Rendering
- Network usage
- Memory usage
- CPU-intensive operations
- Startup time
- Build size
- Repeated operations

Look for obvious regressions.

Do not perform extensive performance benchmarking for trivial changes unless required.

---

15. Automated Tests

If the project already has automated tests:

- Run relevant existing tests.
- Add tests when the change introduces behavior that should be covered.
- Do not delete tests merely because they fail after a change.
- Investigate failures before modifying the tests.
- Keep tests aligned with intended behavior.

Existing automated testing infrastructure should be preferred over creating a parallel testing system.

---

16. Manual Testing

Manual testing may be appropriate when:

- Testing UI behavior
- Verifying visual changes
- Testing user workflows
- Checking device-specific behavior
- Testing interactions difficult to automate

Manual testing should still follow a clear process.

---

17. Test Status

Use clear testing statuses:

- "PASS" — Tested and working as expected.
- "FAIL" — Tested and a problem was found.
- "PARTIAL" — Some relevant tests passed, but testing is incomplete.
- "NOT TESTED" — The change has not been verified.
- "BLOCKED" — Testing cannot currently be completed because of an external limitation.

Never report "PASS" when the relevant behavior was not actually verified.

---

18. AI Coding Assistant Testing Rules

When an AI coding assistant makes a change:

1. Inspect the modified code.
2. Identify what could be affected.
3. Perform appropriate validation.
4. Test the requested behavior.
5. Test relevant error conditions.
6. Test important edge cases.
7. Check for regressions.
8. Run existing automated tests when available.
9. Report the testing performed.
10. Clearly report anything that could not be tested.

The AI must not claim that a change works when it has not been verified.

If testing is unavailable, state that clearly.

---

19. Failed Tests

When a test fails:

FAIL
 ↓
Identify the cause
 ↓
Fix the implementation
 ↓
Run the test again
 ↓
PASS

Do not hide failed tests.

Do not simply remove or weaken a test to make the project pass unless the expected behavior itself has intentionally changed and the test should legitimately be updated.

---

20. Definition of Done

A change can generally be considered complete when:

- The requested functionality is implemented.
- Basic validation succeeds.
- Relevant functionality has been tested.
- Important error conditions have been considered.
- Relevant edge cases have been considered.
- Existing affected functionality still works.
- Appropriate automated tests pass when available.
- UI behavior has been verified when applicable.
- Security implications have been checked when applicable.
- Testing limitations are clearly documented.

The exact testing depth should match the risk and scope of the change.

---

Core Principle

Do not assume that code works.

Verify it.

A change is complete when it has been implemented, appropriately tested, and its limitations are understood.