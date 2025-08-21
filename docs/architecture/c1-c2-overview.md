# System Architecture Overview

This document follows the C4 model principles to design and visualize the system architecture at different levels of abstraction, from high-level system context to detailed implementation components.

## C1: System Context

*What is the system and who uses it?*

```mermaid
graph TB
    User[Scrabble Player]
    System["Scrabble Points Calculator"]
    
    User -->|Uses| System
    
    style User fill:#f9f9f9
    style System fill:#e8f5e8
```

## C2: Container Diagram

*How is the system structured and what technologies are used?*

```mermaid
graph TB
    User[Scrabble Player]
    
    subgraph "Scrabble Points Calculator System"
        Frontend["Web Application<br/>(React, TypeScript, Tailwind CSS)"]
        Backend["API Application<br/>(Spring Boot, Java)"]
        Database["Database<br/>(PostgreSQL)"]
    end
    
    User --> Frontend
    Frontend -->|REST API| Backend
    Backend -->|JPA/SQL| Database
    
    style Frontend fill:#e1f5fe
    style Backend fill:#e8f5e8
    style Database fill:#fff3e0
```