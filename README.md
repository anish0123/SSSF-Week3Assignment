# SSSF week 3 exercise.

Convert the REST API from last weeks assignment to GraphQL.

## Getting started

- Clone this repo
- create .env based on .env.example
  - use MongoDB Atlas to make sure geospatial queries work
  - use individual database name to prevent clashes with other apps
- `npm i` to install dependencies
- `npm run dev` to start development server
- `npm run test` to run tests

### Interfaces

- Interfaces are basically the same as last week. The difference is interfaces for tests.

### Database

- DB schemas are the same as last week

# Important

- No authentication and authorization this week. All mutations are done with id properties. So no need to use req.user.
- Always empty your cats and users after tests.
