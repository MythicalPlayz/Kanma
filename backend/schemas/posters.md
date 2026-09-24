# Poster Model Design

## Fields & Specifications

| Field | Type | Required | Default | Allowed Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | String | Yes | — | Unique, can be random |  |
| `posterImage` | String | Yes | `'https://placehold.co/1280x720?text=Poster+PlaceHolder'` | Valid URL format | Horizontal key art |
| `posterAlt` | String | No | - | Alt Description | - |
| `redirectURL` | String | Yes | `'/movies/[]'` | Valid URL format | redirect to |



---

## Visual Relationship / Structure

```mermaid
erDiagram
    MOVIE {
        string id PK "Unique random"
        string posterImage "Valid image URL"
        string directTo "Image Alt"
        string directTo "Valid video URL"
    }