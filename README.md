# Balkaneum

The purpose of this project is an assesment of technical skill for a job application at Balkaneum.

This app consists of the two parts, the backend and the frontend.
## Backend
The backend is written in TypeScript, with the NestJS Framework, and TypeORM for accessing the PostgreSQL database. Redis is used for the caching layer, and Socket.io for the realtime quotes distribution.

### Requirements
- NodeJS (v12.x.x shoud work)
- PostgreSQL
- Redis
- Yarn

### Configuration
This application uses `dotenv` for the configuration. The following variables should be exported or placed into `.env` file before running the application:
```bash
POSTGRESQL_HOST=localhost
POSTGRESQL_PORT=5432
POSTGRESQL_USER=balkaneum
POSTGRESQL_PASSWORD=
POSTGRESQL_DATABASE=balkaneum
BALKANEUM_API_BASE_URL=http://balkaneum.com:31227/api/v1/
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=
```

### Running
To install the dependencies, run:
```bash
yarn install
```
To run, execute the following command:
```bash
yarn start
```
The database tables will be automatically created.

## Frontend
The frontend is also written in TypeScript, with ReactJS and MobX (MobX State Tree to be precise) for the state management. Ant Design component library is used.

### Configuration
The following variable should be exported or placed in the `.env` file:

```bash
REACT_APP_API_URL=http://localhost:4000 # Url to the backend
```

### Running
To install the dependencies, run:
```bash
yarn install
```
To run, execute the following command:
```bash
yarn start
```