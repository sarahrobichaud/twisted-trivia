# Quiz Cove

> NOTE: Rebuilding the client, not public yet

### Objective

Create a simplified kahoot-like experience.

## Backend Documentation

### Highlights

#### Current Features

- Time based score multiplier
    - Linear interpolation if answer is within the first half of the time limit
    - Minimum baseline if within the second half of the time limit
- Early round end when everyone has answered
- Dynamic question time limit and points based on question
- Automatic game cleanup if not accessed for a while
- Socket authentication
- Disconnects all players when "host" leaves
  
#### Hexagonal architecture

I learned about this architecture in the middle of the project and thought it would be a good fit and a good learning opportunity for me. (100% aware it is overkill)

I have implemented ports/adapters to handle communcation from the infrastructure layer to domain as well as maintainting a clear separation of primary use cases (driving the app) and secondary use cases (driven by the app). It enables easy swapping of external concerns like the HTTP, websocket and data persistence solutions.

- Domain layer 100% free of any infrastructure concerns
- Application layer serves at an intermediary between the domain and infrastructure

- Custom dependency injection container manages the application's components. It handles creation and wiring of services, repositories, and adapters in a centralized place maintaining proper separation of concerns and enabling easy component swapping.

```
Domain <- Application <- Infrastructure <- Presentation
```