# Snacks & Category Model Design

## Fields & Specifications

### 1. Snacks Model

| Field | Type | Required | Default | Allowed Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | String | Yes | — | Unique, random UUID or auto-generated string | Primary key / unique identifier |
| `nameEN` | String | Yes | — | Min 1 char | Item name in English (trim whitespace) |
| `nameAR` | String | Yes | — | Min 1 char | Item name in Arabic (trim whitespace) |
| `category` | String / Ref | Yes | — | Must reference a valid `SnackCategory.type` | Foreign key relationship |
| `price` | Number | No | `0` | Min `0` | Item price in base currency (cannot be negative) |
| `image` | String | No | `'https://placehold.co/400x400?text=No+Image'` | Valid URL format | Square thumbnail / display image |

---

### 2. Snack Category Model

| Field | Type | Required | Default | Allowed Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `type` | String | Yes | — | Unique, slug / key identifier | Primary key (e.g., `food`, `hot-drinks`) |
| `nameEN` | String | Yes | — | Min 1 char | Category name in English (trim whitespace) |
| `nameAR` | String | Yes | — | Min 1 char | Category name in Arabic (trim whitespace) |
| `fontIcon` | [String] | Yes | — | Allowed items: `['faBowlFood', 'faPlay', 'Hotdog', 'faBlender', 'faCandyCane', 'faMugHot', 'faSnowflake']` | FontAwesome / UI icon identifiers |

---

## Visual Relationship / Structure

```mermaid
erDiagram
    SNACK_CATEGORY ||--o{ SNACK : "contains"

    SNACK_CATEGORY {
        string type PK "Unique category slug / identifier"
        string nameEN "Required, trimmed"
        string nameAR "Required, trimmed"
        string_array fontIcon "faBowlFood, faPlay, faHotdog, faBlender, faCandyCane, faMugHot, faSnowflake"
    }

    SNACK {
        string id PK "Unique identifier (UUID / random ID)"
        string nameEN "Required, trimmed"
        string nameAR "Required, trimmed"
        string category FK "References SNACK_CATEGORY.type"
        number price "Min 0, default 0"
        string image "Valid image URL, default 400x400 placeholder"
    }