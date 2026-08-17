# DATABASE.md

# Database Documentation

## Purpose

This document defines the database structure and database-related conventions used by the project.

The database currently stores:

- User accounts
- User profiles
- General learning progress
- Per-lesson learning progress
- Application assets
- Vocabulary content

This document should be treated as the reference for database-related development.

Any database structure change must be reflected in this document.

---

# 1. Database Structure

Current tables:

- users
- profiles
- progress
- user_progress
- assets
- vocabulary

General relationship:

users
├── profiles
├── progress
└── user_progress

assets

vocabulary

---

# 2. Naming Convention

Database names must use the exact names defined in this document.

Do not rename database tables or columns inside application code unless the database schema is intentionally changed.

Examples:

Correct:

users
user_id
display_name
avatar_url
user_progress
lesson_id
created_at
updated_at

Incorrect:

user
userId
displayName
avatarUrl
userProgress
lessonId
createdAt
updatedAt

When writing application code, API code, queries, services, or database functions, use the exact database column names.

If the programming language or framework normally uses another naming convention, map the database field explicitly instead of changing the database name.

Example:

Database:
user_id

Application variable:
userId

This is acceptable only when the application layer intentionally maps:

user_id -> userId

Do not assume that userId is the actual database column.

---

# 3. USERS

Purpose:

Stores the primary identity of each user.

Table:

users

Columns:

id
username
email
created_at
updated_at

Schema:

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    username TEXT NOT NULL UNIQUE,

    email TEXT UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

Constraints:

- id is the primary key.
- username is required.
- username must be unique.
- email must be unique when provided.
- created_at defaults to NOW().
- updated_at defaults to NOW().

---

# 4. PROFILES

Purpose:

Stores information displayed on the user's profile.

Table:

profiles

Columns:

id
user_id
display_name
bio
avatar_url
created_at
updated_at

Schema:

CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    display_name TEXT,

    bio TEXT,

    avatar_url TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

Relationship:

users.id
    ↓
profiles.user_id

Relationship type:

One user -> One profile

Because user_id is UNIQUE inside profiles.

When a user is deleted, the associated profile is deleted automatically.

---

# 5. PROGRESS

Purpose:

Stores general learning statistics belonging to a user.

Table:

progress

Columns:

id
user_id
xp
level
streak
updated_at

Schema:

CREATE TABLE progress (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    xp INTEGER NOT NULL DEFAULT 0,

    level TEXT NOT NULL DEFAULT 'N5',

    streak INTEGER NOT NULL DEFAULT 0,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

Relationship:

users.id
    ↓
progress.user_id

Relationship type:

One user -> One progress record

Current fields:

xp
level
streak

Important:

The current level field is a general level value.

Do not assume that this field represents the progress of every individual language.

Language-specific progress must use an appropriate data source.

---

# 6. USER_PROGRESS

Purpose:

Stores learning progress for individual lessons.

Table:

user_progress

Columns:

id
user_id
lesson_id
completed
progress
updated_at

Schema:

CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    lesson_id BIGINT NOT NULL,

    completed BOOLEAN NOT NULL DEFAULT FALSE,

    progress INTEGER NOT NULL DEFAULT 0,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_lesson
        UNIQUE (user_id, lesson_id),

    CONSTRAINT progress_range
        CHECK (progress >= 0 AND progress <= 100)
);

Relationships:

users.id
    ↓
user_progress.user_id

Relationship type:

One user -> Many user_progress records

Constraints:

- The same user cannot have duplicate records for the same lesson.
- progress must be between 0 and 100.
- completed is boolean.
- user_id references users.id.

Important:

lesson_id currently does NOT have a foreign key to a lessons table.

Do not invent a lessons table or assume one exists.

If a lessons table is added in the future, this document must be updated.

---

# 7. ASSETS

Purpose:

Stores reusable application assets.

Table:

assets

Columns:

id
asset_key
name
category
url
alt_text
is_active
created_at
updated_at

Schema:

CREATE TABLE assets (
    id BIGSERIAL PRIMARY KEY,

    asset_key TEXT NOT NULL UNIQUE,

    name TEXT NOT NULL,

    category TEXT NOT NULL,

    url TEXT NOT NULL,

    alt_text TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

Important:

asset_key must be unique.

is_active determines whether an asset is currently active.

---

# 8. VOCABULARY

Purpose:

Stores vocabulary learning content.

Table:

vocabulary

Columns:

id
language
level
word
kana
romaji
meaning
type
example_jp
example_id
audio_url
image_url
tags
created_at
updated_at

Schema:

CREATE TABLE vocabulary (
    id BIGSERIAL PRIMARY KEY,

    language VARCHAR(20) NOT NULL,

    level VARCHAR(10) NOT NULL,

    word VARCHAR(255),

    kana VARCHAR(255),

    romaji VARCHAR(255),

    meaning TEXT NOT NULL,

    type VARCHAR(50),

    example_jp TEXT,

    example_id TEXT,

    audio_url TEXT,

    image_url TEXT,

    tags TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

Supported language concept:

Japanese
German
English
Korean

Important:

Not every language must use every field.

For example:

kana
romaji

may only be relevant to certain languages.

Do not force irrelevant values into these fields.

The language field determines which language the vocabulary entry belongs to.

---

# 9. Database Relationships

Current relationships:

users
│
├── profiles
│
├── progress
│
└── user_progress


assets

vocabulary

Foreign keys:

profiles.user_id
    -> users.id

progress.user_id
    -> users.id

user_progress.user_id
    -> users.id

No current foreign key:

user_progress.lesson_id

No current foreign key:

vocabulary -> users

No current foreign key:

assets -> users

Do not invent relationships that are not defined here.

---

# 10. Dashboard Data

The dashboard may use data from:

users
profiles
progress
user_progress

Potential general information:

User information:

users.username
profiles.display_name
profiles.avatar_url

General progress:

progress.xp
progress.level
progress.streak

Lesson progress:

user_progress.lesson_id
user_progress.completed
user_progress.progress
user_progress.updated_at

Important:

Do not claim that language-specific progress can be directly retrieved from progress.

The current progress table does not contain a language column.

If language-specific progress is required, determine the relationship through the actual lesson/content architecture or update the database schema intentionally.

---

# 11. Database Access Rules

Application code should not directly assume database implementation details without following the project's architecture.

Follow:

RULES.md
ARCHITECTURE.md

When database access is required:

Application
    ↓
Application Logic / Service
    ↓
Database Access Layer
    ↓
Database

The exact architecture depends on the existing project.

Do not bypass existing services or database abstractions without a reason.

---

# 12. Code Generation Rules

When generating code that interacts with the database:

1. Read DATABASE.md first.
2. Use the exact table names.
3. Use the exact column names.
4. Use the correct relationships.
5. Respect database constraints.
6. Do not invent columns.
7. Do not invent tables.
8. Do not invent foreign keys.
9. Do not assume fields exist because they would be convenient.
10. Do not silently rename database fields.
11. Do not generate queries against undocumented tables.
12. Do not create fake database data and present it as real data.

Example:

Correct:

SELECT username
FROM users
WHERE id = $1;

Incorrect:

SELECT userName
FROM users
WHERE userId = $1;

The second query is invalid against the current schema because:

userName does not exist.

userId does not exist.

The actual fields are:

username
id

---

# 13. Application Variable Naming

Application variables may use the naming conventions of their programming language.

For example:

Database:

user_id

Application:

userId

This is acceptable if the mapping is explicit.

Example:

const userId = user.user_id;

However, database queries must use the actual database field:

SELECT user_id
FROM user_progress;

Do not change database naming simply to match application naming.

---

# 14. API Response Naming

API responses may use a different naming convention if the project's API convention requires it.

Example:

Database:

display_name
avatar_url

API:

displayName
avatarUrl

This is acceptable if the API layer intentionally maps the values.

The database itself must still use:

display_name
avatar_url

Keep the boundaries clear:

Database field:
display_name

Backend variable:
displayName

API response:
displayName

---

# 15. Data Integrity

Important constraints must be preserved.

Do not remove or bypass:

UNIQUE constraints
PRIMARY KEY constraints
FOREIGN KEY constraints
CHECK constraints
NOT NULL constraints

unless the database design is intentionally being changed.

Current important constraints include:

users.username
    UNIQUE

users.email
    UNIQUE

profiles.user_id
    UNIQUE

progress.user_id
    UNIQUE

user_progress(user_id, lesson_id)
    UNIQUE

user_progress.progress
    0-100

---

# 16. Deletion Behavior

Current user-related tables use:

ON DELETE CASCADE

Therefore:

Deleting users.id
    ↓
Deletes profiles belonging to that user
    ↓
Deletes progress belonging to that user
    ↓
Deletes user_progress belonging to that user

Be careful when writing DELETE queries.

Deleting a user can remove multiple related records.

Do not perform destructive deletion automatically.

---

# 17. Schema Changes

Before changing the database schema:

1. Inspect the current schema.
2. Search the project for references to affected tables and columns.
3. Identify affected API endpoints.
4. Identify affected services.
5. Identify affected UI features.
6. Determine migration requirements.
7. Update the database.
8. Update application code.
9. Test the affected functionality.
10. Update DATABASE.md.

Do not make silent schema changes.

---

# 18. Destructive Operations

The original database reset contains:

DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

These commands are destructive.

They must NOT be executed automatically.

Only use destructive database operations when a complete reset is explicitly intended.

Never delete production data merely to make development easier.

---

# 19. Current Complete Schema

The current database schema is:

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    xp INTEGER NOT NULL DEFAULT 0,
    level TEXT NOT NULL DEFAULT 'N5',
    streak INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    progress INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_lesson
        UNIQUE (user_id, lesson_id),

    CONSTRAINT progress_range
        CHECK (progress >= 0 AND progress <= 100)
);

CREATE TABLE assets (
    id BIGSERIAL PRIMARY KEY,
    asset_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vocabulary (
    id BIGSERIAL PRIMARY KEY,
    language VARCHAR(20) NOT NULL,
    level VARCHAR(10) NOT NULL,
    word VARCHAR(255),
    kana VARCHAR(255),
    romaji VARCHAR(255),
    meaning TEXT NOT NULL,
    type VARCHAR(50),
    example_jp TEXT,
    example_id TEXT,
    audio_url TEXT,
    image_url TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---

# 20. Source of Truth

DATABASE.md describes the intended database structure.

The actual database schema is the final runtime source of truth.

If DATABASE.md and the actual database differ:

1. Inspect the actual database.
2. Determine which version is intended.
3. Do not blindly overwrite either one.
4. Update DATABASE.md after the intended schema is confirmed.

Application code must not invent database structures.

---

# Core Principle

The database schema must remain explicit and predictable.

When generating database-related code:

Read DATABASE.md first.

Use the exact database names.

Respect the exact relationships.

Respect the exact constraints.

If something does not exist in the schema, do not assume that it exists.

If a new table, column, relationship, or constraint is required, propose the schema change first and update DATABASE.md accordingly.