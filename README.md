# Timecheck API

# StudyApp Setup Docker

## Prerequisites

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Install [git](https://github.com/git-guides/install-git)

## Run Backend as a Docker Container

1. Clone Repository:

```bash
git clone https://github.com/krish-21/Timecheck-API.git
```

2. cd into Directory:

```bash
cd StudyApp
```

3. Start Server:

```bash
docker-compose -f docker-dev.yaml up -d
```

Server is ready at [http://127.0.0.1:8000](http://127.0.0.1:8000) | [http://localhost:8000](http://localhost:8000)

Prisma Studio is ready at: [http://127.0.0.1:5555](http://127.0.0.1:5555) | [http://localhost:5555](http://localhost:5555)

## To Stop the Server

1. Stop Server:

```bash
docker-compose -f docker-dev.yaml down
```

# Timecheck Setup Local

## Prerequisites

1. Install [VSCode](https://code.visualstudio.com/download)
2. Install [git](https://github.com/git-guides/install-git)
3. Install [NVM](https://github.com/nvm-sh/nvm)
4. Install [Docker](https://docs.docker.com/get-docker/)

## Setup VSCode

1. Download ESLint Extension
2. Download Prettier Extension
3. Download Prisma Extension

## Setup PostgreSQL

PostgreSQL will run in a Docker container.

1. Download PostgreSQL 15.1:

```bash
docker pull postgres:15.1
```

2. Run the container:

```bash
docker run --name pg-timecheck -e POSTGRES_USER=timecheck -e POSTGRES_PASSWORD=timecheck -p 5432:5432 postgres:15.1
```

3. Open another Terminal Tab/Window

```
⌘N/⌘T (MacOS) or ^N/^T (Windows)
```

4. Exec into the container:

```bash
docker exec -it pg-timecheck bash
```

5. Run PSQL:

```psql
psql -U timecheck
```

6. Connect to default DB:

```psql
\c postgres
```

7. Drop previously existing DB for timecheck:

```psql
DROP DATABASE timecheck;
```

8. Create new DB for timecheck:

```psql
CREATE DATABASE timecheck;
```

9. Connect to newly created DB:

```psql
\c timecheck
```

## Setup Repository

1. Clone Repository:

```bash
git clone https://github.com/krish-21/Timecheck-API.git
```

2. cd into Directory:

```bash
cd Timecheck-API
```

3. Install specified node version using nvm:

```bash
nvm install
```

4. Use installed node version using nvm:

```bash
nvm use
```

5. Copy sample env & Rename file:

```bash
cp .env.sample .env
```

## Setup Dependencies

1. Install Node Modules:

```bash
npm ci
```

IMPORTANT: Do not run `npm install` as it will edit `package.json`!

2. Setup Husky

```bash
npm run prepareHusky
```

3. Reset DB, Sync with latest Schema & Seed DB:

```bash
npm run resetDB
```

## Run Server

1. If the Docker container for PostgreSQL is not running, start it:

```bash
docker start pg-timecheck
```

2. Start the Server:

```bash
npm run dev
```

Server is ready at [http://127.0.0.1:8000](http://127.0.0.1:8000) | [http://localhost:8000](http://localhost:8000)

Prisma Studio is ready at: [http://127.0.0.1:5555](http://127.0.0.1:5555) | [http://localhost:5555](http://localhost:5555)
