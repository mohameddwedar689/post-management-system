# 📝 Post Management System

A robust, production-ready **Post Management System** built with **Node.js**, **Express**, and **MongoDB**, following **Clean Architecture** and **Domain-Driven Design (DDD)** principles. The system features event-driven processing with **Apache Kafka** and is fully containerized with **Docker**.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running with Docker](#running-with-docker-recommended)
  - [Running Locally](#running-locally)
- [API Endpoints](#-api-endpoints)
- [Kafka Events](#-kafka-events)
- [Layer Details](#-layer-details)
- [Docker Services](#-docker-services)
- [License](#-license)

---

## ✨ Features

- **RESTful API** for managing posts (Create, Read, List)
- **Clean Architecture** with clear separation of concerns across 4 layers
- **Domain-Driven Design** with domain entities and repository interfaces
- **Event-Driven Architecture** using Apache Kafka (producer & consumer)
- **MongoDB** for persistent data storage
- **Docker & Docker Compose** for one-command deployment
- **Retry Logic** for Kafka connection resilience
- **Health Checks** for MongoDB and Zookeeper containers

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose 9** | MongoDB ODM |
| **Apache Kafka** | Message broker for event streaming |
| **KafkaJS** | Kafka client for Node.js |
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **dotenv** | Environment variable management |
| **Nodemon** | Development hot-reloading |

---

## 🏗 Architecture

The project follows **Clean Architecture** principles, organizing code into four distinct layers with clear dependency rules — inner layers never depend on outer layers.

```
┌─────────────────────────────────────────────┐
│                API Layer                     │
│         (Controllers & Routes)              │
├─────────────────────────────────────────────┤
│            Application Layer                │
│             (Use Cases)                     │
├─────────────────────────────────────────────┤
│             Domain Layer                    │
│     (Entities & Repository Interfaces)      │
├─────────────────────────────────────────────┤
│          Infrastructure Layer               │
│   (Database, Repositories, Kafka)           │
└─────────────────────────────────────────────┘
```

**Dependency Flow:**
```
API → Application → Domain ← Infrastructure
```

The **Domain Layer** is at the center and has zero external dependencies. The **Infrastructure Layer** implements the interfaces defined by the Domain Layer (Dependency Inversion Principle).

---

## 📁 Project Structure

```
post-management-system/
├── src/
│   ├── api/                          # API Layer
│   │   ├── controllers/
│   │   │   └── postController.js     # Request handlers
│   │   └── routes/
│   │       └── postRoutes.js         # Route definitions
│   │
│   ├── application/                  # Application Layer
│   │   └── post/
│   │       ├── createPost.js         # Create post use case
│   │       ├── getPost.js            # Get single post use case
│   │       └── listPosts.js          # List all posts use case
│   │
│   ├── domain/                       # Domain Layer
│   │   └── post/
│   │       ├── Post.js               # Post entity
│   │       └── PostRepository.js     # Repository interface (abstract)
│   │
│   ├── infrastructure/               # Infrastructure Layer
│   │   ├── database/
│   │   │   └── mongo.js              # MongoDB connection
│   │   ├── kafka/
│   │   │   ├── producer.js           # Kafka producer (publishes events)
│   │   │   └── consumer.js           # Kafka consumer (processes events)
│   │   └── repositories/
│   │       ├── PostModel.js           # Mongoose schema/model
│   │       └── MongoPostRepository.js # Repository implementation
│   │
│   └── server.js                     # Application entry point
│
├── .dockerignore                     # Docker ignore rules
├── .env                              # Environment variables (not in git)
├── .gitignore                        # Git ignore rules
├── Dockerfile                        # Docker image definition
├── docker-compose.yml                # Multi-container setup
├── package.json                      # Dependencies & scripts
└── README.md                         # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker & Docker Compose** (recommended approach)

  OR for local development:

- **Node.js** >= 20.x
- **MongoDB** running locally
- **Apache Kafka** & **Zookeeper** running locally

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohameddwedar689/post-management-system.git
   cd post-management-system
   ```

2. **Install dependencies** (for local development only):
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Config
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/posts_db

# Kafka
KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=posts-service
KAFKA_TOPIC=post-created
```

> **Note:** When running with Docker Compose, the environment variables are overridden by those defined in `docker-compose.yml`.

### Running with Docker (Recommended)

Start all services with a single command:

```bash
docker-compose up --build
```

This will spin up 4 containers:
| Container | Port |
|---|---|
| **post-api** (Node.js app) | `3000` |
| **mongodb** | `27017` |
| **kafka** | `9092` |
| **zookeeper** | `2181` |

To stop all services:
```bash
docker-compose down
```

### Running Locally

> Make sure MongoDB and Kafka are running on your machine first.

**Development mode** (with hot-reloading):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

---

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Returns `"API Running"` |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/posts` | List all posts |
| `GET` | `/api/posts/:id` | Get a specific post by ID |

---

### `POST /api/posts` — Create a Post

**Request Body:**
```json
{
  "title": "My First Post",
  "content": "This is the content of the post.",
  "author": "Mohamed"
}
```

**Success Response (201):**
```json
{
  "id": "665a1b2c3d4e5f6789012345",
  "title": "My First Post",
  "content": "This is the content of the post.",
  "author": "Mohamed",
  "createdAt": "2026-05-18T18:00:00.000Z",
  "updatedAt": "2026-05-18T18:00:00.000Z"
}
```

**Error Response (500):**
```json
{
  "error": "Invalid post data"
}
```

---

### `GET /api/posts` — List All Posts

**Success Response (200):**
```json
[
  {
    "id": "665a1b2c3d4e5f6789012345",
    "title": "My First Post",
    "content": "This is the content of the post.",
    "author": "Mohamed",
    "createdAt": "2026-05-18T18:00:00.000Z",
    "updatedAt": "2026-05-18T18:00:00.000Z"
  }
]
```

> Posts are returned sorted by `createdAt` in descending order (newest first).

---

### `GET /api/posts/:id` — Get a Post by ID

**Success Response (200):**
```json
{
  "id": "665a1b2c3d4e5f6789012345",
  "title": "My First Post",
  "content": "This is the content of the post.",
  "author": "Mohamed",
  "createdAt": "2026-05-18T18:00:00.000Z",
  "updatedAt": "2026-05-18T18:00:00.000Z"
}
```

**Error Response (500):**
```json
{
  "error": "Post not found"
}
```

---

## 📨 Kafka Events

The system uses Apache Kafka for event-driven communication. When a post is created, a `POST_CREATED` event is published to the `post-created` topic.

### Event Flow

```
POST /api/posts
      │
      ▼
  Controller
      │
      ▼
  Use Case (createPost)
      │
      ├──▶ Save to MongoDB
      │
      └──▶ Publish to Kafka ──▶ Topic: "post-created"
                                        │
                                        ▼
                                    Consumer
                                        │
                                        ▼
                                  Process Event
                                  (log details)
```

### Event Schema

**Topic:** `post-created`

**Message Format:**
```json
{
  "event": "POST_CREATED",
  "data": {
    "postId": "665a1b2c3d4e5f6789012345",
    "title": "My First Post",
    "content": "This is the content of the post.",
    "author": "Mohamed",
    "created_at": "2026-05-18T18:00:00.000Z",
    "updated_at": "2026-05-18T18:00:00.000Z"
  }
}
```

### Producer

- Connects to Kafka with **retry logic** (5 retries, 3s interval)
- Publishes `POST_CREATED` events after successful post creation
- Serializes messages as JSON

### Consumer

- Subscribes to the `post-created` topic
- Consumer group: `post-group`
- Reads from the beginning of the topic
- Logs post details upon receiving a `POST_CREATED` event

---

## 🔍 Layer Details

### 1. Domain Layer (`src/domain/`)

The innermost layer containing the core business logic. It has **zero external dependencies**.

- **`Post.js`** — The Post entity with properties: `id`, `title`, `content`, `author`, `createdAt`, `updatedAt`
- **`PostRepository.js`** — Abstract repository interface defining the contract: `create()`, `findById()`, `findAll()`. Throws `"Not implemented"` errors to enforce implementation by subclasses.

### 2. Application Layer (`src/application/`)

Contains the **use cases** (business operations). Each use case is a single function that orchestrates domain logic.

- **`createPost.js`** — Validates input, creates a `Post` entity with a UUID, persists it via the repository, and publishes a Kafka event through the injected `eventPublisher`.
- **`getPost.js`** — Retrieves a single post by ID. Throws `"Post not found"` if the post doesn't exist.
- **`listPosts.js`** — Retrieves all posts. Throws `"No posts found"` if the collection is empty.

### 3. API Layer (`src/api/`)

Handles HTTP concerns — request parsing, response formatting, and routing.

- **`postController.js`** — Maps HTTP requests to use cases and returns JSON responses with appropriate status codes.
- **`postRoutes.js`** — Defines Express routes and maps them to controller functions.

### 4. Infrastructure Layer (`src/infrastructure/`)

Implements external concerns and provides concrete implementations of domain interfaces.

- **`database/mongo.js`** — Manages MongoDB connection using Mongoose. Exits the process on connection failure.
- **`repositories/PostModel.js`** — Defines the Mongoose schema for posts with required fields: `title`, `content`, `author`, and auto-generated timestamps.
- **`repositories/MongoPostRepository.js`** — Concrete implementation of `PostRepository` using Mongoose. Maps between Mongoose documents and domain `Post` entities.
- **`kafka/producer.js`** — Kafka producer with retry logic for resilient connections. Publishes `POST_CREATED` events.
- **`kafka/consumer.js`** — Kafka consumer that subscribes to the `post-created` topic and processes incoming events.

---

## 🐳 Docker Services

The `docker-compose.yml` defines 4 services:

| Service | Image | Port | Description |
|---|---|---|---|
| **mongo** | `mongo:latest` | `27017` | MongoDB database with health check |
| **zookeeper** | `confluentinc/cp-zookeeper:7.3.2` | `2181` | Kafka dependency manager with health check |
| **kafka** | `confluentinc/cp-kafka:7.3.2` | `9092` | Message broker, depends on Zookeeper |
| **api** | Custom (Dockerfile) | `3000` | Node.js application, depends on MongoDB & Kafka |

### Startup Order

```
Zookeeper (healthy) → Kafka (started) → API
MongoDB   (healthy) ─────────────────→ API
```

Docker Compose ensures services start in the correct order using `depends_on` with health check conditions.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Mohamed Dwedar**

- GitHub: [@mohameddwedar689](https://github.com/mohameddwedar689)
