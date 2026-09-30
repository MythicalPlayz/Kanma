# Cinema Model Design

## Fields & Specifications

| Field | Type | Required | Default | Allowed Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | String | Yes | — | Unique primary key (e.g., UUID or CUID) | Primary Key |
| `nameEN` | String | Yes | — | Non-empty string | English cinema name |
| `nameAR` | String | Yes | — | Non-empty string, Arabic script | Arabic cinema name |
| `addressEN` | String | Yes | — | Non-empty string | English street/district address |
| `addressAR` | String | Yes | — | Non-empty string, Arabic script | Arabic street/district address |
| `googleMapsLink` | String | Yes | — | Valid URL (`https://maps.google.com/...` or `https://goo.gl/maps/...`) | Location link |
| `imageURL` | String | No | `'https://placehold.co/1280x720?text=Cinema+Placeholder'` | Valid URL format | Exterior/interior photo |

---

## Visual Relationship / Structure

```mermaid
erDiagram
    CINEMA {
        string id PK "Unique identifier"
        string nameEN "English display name"
        string nameAR "Arabic display name"
        string addressEN "English address"
        string addressAR "Arabic address"
        string googleMapsLink "Google Maps URL"
        string imageURL "Cover image URL"
    }