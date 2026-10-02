# Account Model Design (L1)

## Fields & Specifications

| Field | Type | Required | Default | Allowed Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | String | Yes | Auto UUID | 64 characters (e.g. SHA-256 hash or combined UUID/Hex string) | Primary Key |
| `FName` | String | Yes | — | Non-empty, trimmed, letters only, max 50 chars | First Name |
| `LName` | String | Yes | — | Non-empty, trimmed, letters only, max 50 chars | Last Name |
| `email` | String | Yes | — | Valid email format, lowercase, unique | Used for auth & notifications |
| `password` | String | Yes | — | Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number | Stored as bcrypt hash |
| `telephone` | String | Yes | — | Egyptian format: `^(?:\+201\|01)[0125][0-9]{8}$`, unique | Mobile number |

---

## Visual Structure

```mermaid
erDiagram
    ACCOUNT {
        string _id PK "UUID(64)"
        string FName "First Name"
        string LName "Last Name"
        string email UK "Unique lowercase email"
        string password "Hashed (min 8, 1 lower, 1 upper, 1 digit)"
        string telephone UK "Egyptian phone (01X / +201X)"
        datetime createdAt "Timestamp"
        datetime updatedAt "Timestamp"
    }