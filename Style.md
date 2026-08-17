Project Style Guide

Purpose

This document defines general style and consistency guidelines for the project.

The goal is to make the project feel like one coherent system, regardless of the technology, language, platform, or type of application being used.

These guidelines should be adapted to the actual technologies and existing conventions of the project.

Do not introduce a new style system when an established one already exists.

---

1. General Principle

Prioritize:

- Clarity
- Consistency
- Readability
- Maintainability
- Simplicity

Avoid unnecessary decoration, complexity, or stylistic decisions that provide no practical benefit.

Consistency is more important than personal preference.

---

2. Existing Style Comes First

Before changing or adding code:

1. Inspect existing conventions.
2. Follow the established naming style.
3. Follow the existing formatting.
4. Reuse existing patterns.
5. Avoid introducing conflicting styles.

Do not rewrite existing code simply because another style is personally preferred.

---

3. Naming

Use names that clearly communicate purpose.

Names should describe what something represents or does.

Prefer:

- Descriptive names
- Consistent terminology
- Existing project vocabulary

Avoid meaningless names such as:

- "thing"
- "stuff"
- "random"
- "test2"
- "newThing"

Temporary names may be used during development but should not remain in completed code.

Follow language-specific naming conventions already established by the project.

---

4. Formatting

Code formatting should remain consistent throughout the project.

Follow the existing conventions for:

- Indentation
- Line breaks
- Braces
- Quotes
- Semicolons
- Trailing commas
- Import organization
- File structure

If the project uses a formatter or linter, follow its configuration rather than creating a separate formatting style.

---

5. Code Readability

Prefer code that is easy to understand.

Avoid:

- Unnecessarily clever implementations
- Extremely compressed code
- Excessive nesting
- Long functions
- Long conditional chains when simpler alternatives exist
- Unclear abbreviations

Readable code is generally preferred over the shortest possible code.

---

6. Functions and Methods

Functions should have a clear purpose.

Prefer functions that:

- Perform one primary responsibility
- Have descriptive names
- Have understandable inputs and outputs
- Avoid unnecessary side effects

If a function becomes difficult to understand, consider whether responsibilities should be separated.

Do not split functions unnecessarily just to make them smaller.

---

7. Comments

Comments should provide information that is not obvious from the code itself.

Useful comments explain:

- Why a decision was made
- Important limitations
- Non-obvious behavior
- Workarounds
- External constraints

Avoid comments that simply describe obvious syntax.

Bad:

// Increase counter
counter = counter + 1

Better:

// Prevent duplicate processing when the same event is received twice.

---

8. Documentation

Documentation should be:

- Accurate
- Concise
- Easy to maintain
- Relevant to the current implementation

Do not document behavior that no longer exists.

When behavior changes significantly, update the relevant documentation.

---

9. UI and Visual Style

If the project contains a user interface, visual elements should follow a consistent design system.

Maintain consistency in:

- Colors
- Typography
- Spacing
- Sizing
- Borders
- Radius
- Icons
- Components
- Interaction states

Avoid introducing a completely different visual style for a single feature without a clear reason.

---

10. Layout and Responsiveness

For projects with responsive interfaces:

- Prefer flexible layouts.
- Avoid unnecessary fixed dimensions.
- Consider different screen sizes.
- Prevent content from overflowing.
- Maintain readable text.
- Keep interactive elements usable.

Responsive behavior should be considered when creating or modifying UI components.

---

11. Accessibility

When the project has a user interface, accessibility should be considered from the beginning.

Pay attention to:

- Semantic structure
- Keyboard interaction
- Focus states
- Labels
- Readable contrast
- Alternative text where appropriate
- Clear error messages
- Usable interactive elements

Do not sacrifice usability for visual decoration.

---

12. Interaction Design

Interactive elements should provide clear feedback.

Consider states such as:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Success
- Error

Animations should support understanding and feedback rather than distract from the task.

---

13. Visual Effects

Visual effects should be used intentionally.

Avoid excessive:

- Blur
- Shadows
- Gradients
- Glow effects
- Transparency
- Animations

Visual effects should not reduce readability, accessibility, or performance.

---

14. Responsive and Adaptive Behavior

The interface should adapt to its environment when applicable.

Consider:

- Screen size
- Input method
- Device capabilities
- Content length
- Orientation
- Accessibility settings

Do not assume every user interacts with the project in the same way.

---

15. Performance-Aware Style

Stylistic decisions should not create unnecessary performance costs.

Avoid unnecessary:

- Large assets
- Heavy animations
- Repeated rendering
- Excessive DOM operations
- Expensive visual effects
- Redundant processing

Use visual complexity only when its benefit justifies its cost.

---

16. Consistency Over Preference

When personal preference conflicts with the existing project style:

Prefer the established project convention.

A new style should be introduced only when:

- The existing style has a clear problem.
- The change solves that problem.
- The change can be applied consistently.
- The impact on existing code is understood.

---

17. Technology-Specific Rules

Technology-specific formatting should follow the conventions appropriate to the technology being used.

Examples may include:

- Language-specific naming conventions
- Framework conventions
- Component conventions
- File naming conventions
- Formatter configuration
- Linter configuration

Do not apply rules from one technology blindly to another.

---

18. New Components or Modules

New components, modules, or UI elements should follow existing patterns.

Before creating one:

1. Check whether a similar element already exists.
2. Reuse existing styles or utilities where appropriate.
3. Follow existing naming conventions.
4. Keep the new element consistent with the rest of the project.

---

Core Principle

Write code and design interfaces that look like they belong to the same project.

Clarity over cleverness.

Consistency over personal preference.

Purpose over decoration.