# Movie Model Design

## Fields & Specifications

| Field | Type | Required | Default | Allowed Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | String | Yes | — | Unique, lowercase, no spaces (`/^[a-z0-9-]+$/`) | URL slug (e.g., `oppenheimer-2023`) |
| `titleEN` | String | Yes | — | Min 1 char | Trim whitespace |
| `titleAR` | String | Yes | — | Min 1 char | Trim whitespace |
| `descriptionEN` | String | Yes | — | Max 500 chars | English synopsis |
| `descriptionAR` | String | Yes | — | Max 500 chars | Arabic synopsis |
| `director` | String | Yes | — | Min 1 char | Trim whitespace |
| `cast` | [String] | Yes | — | Array min length: 1; items min 1 char | Trim whitespace on entries |
| `releaseDate` | Date | Yes | — | Valid ISO date format (`YYYY-MM-DD`) | Release or premiere date |
| `durationMin` | Number | No | `0` | Min `0` | Runtime in minutes |
| `canBook` | Boolean | No | `true` | `true`, `false` | Controls active seat reservation |
| `rating` | Enum | Yes | `'NR'` | `['G', 'PG', '12+', '15+', '17+', '18+', 'NR']` | Content / age certification |
| `status` | Enum | Yes | `'Coming Soon'` | `['Coming Soon', 'Released', 'Completed', 'Cancelled', 'Banned']` | Release lifecycle |
| `genre` | Enum | Yes | — | `['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Animation']` | Primary film genre |
| `language` | Enum | Yes | `'en'` | `['ar', 'en', 'fr', 'es', 'de', 'cn', 'jp', 'kr']` | Original audio language code |
| `posterURL` | String | Yes | `'https://placehold.co/600x900?text=No+Poster'` | Valid URL format | Vertical key art |
| `trailerURL` | String | Yes | `'https://www.youtube.com/watch?v=dQw4w9WgXcQ'` | Valid URL format | Official trailer stream |

---

## Visual Relationship / Structure

```mermaid
erDiagram
    MOVIE {
        string id PK "Unique custom slug (lowercase, hyphenated)"
        string titleEN "Required, trimmed"
        string titleAR "Required, trimmed"
        string descriptionEN "Max 500 chars"
        string descriptionAR "Max 500 chars"
        string director "Required, trimmed"
        string_array cast "Min 1 item, trimmed"
        date releaseDate "ISO Date format"
        number durationMin "Min 0, default 0"
        boolean canBook "Default true"
        enum rating "G, PG, 12+, 15+, 17+, 18+, NR"
        enum status "Coming Soon, Released, Completed, Cancelled, Banned"
        enum genre "Action, Comedy, Drama, Sci-Fi, Horror, Animation"
        enum language "ar, en, fr, es, de, cn, jp, kr"
        string posterURL "Valid image URL"
        string trailerURL "Valid video URL"
    }