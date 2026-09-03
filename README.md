# FocusFlow

FocusFlow is a full-stack productivity management application designed to help users organize projects and manage tasks efficiently.

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- Create and manage projects
- Create and manage tasks
- Assign tasks to projects
- Set task priorities
- Update task status
- Delete projects and tasks
- Persistent data storage with PostgreSQL
- Responsive React interface
- RESTful Flask API
- Backend automated tests

## Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router

### Backend

- Python
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-Migrate

### Database

- PostgreSQL

### Testing

- Pytest

## Project Structure

```text
focusflow/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   └── routes/
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ShaniceAmbani/focusflow.git
cd focusflow
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file containing your local configuration:

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=your-postgresql-database-url
```

Run the database migrations:

```bash
flask db upgrade
```

Start the Flask server:

```bash
python run.py
```

The backend runs locally on:

```text
http://127.0.0.1:5000
```

### 3. Frontend setup

Open another terminal:

```bash
cd focusflow/frontend
npm install
npm run dev
```

The frontend will be available through the Vite development server.

## API Overview

### Authentication

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Register a new user        |
| POST   | `/api/auth/login`    | Authenticate a user        |
| GET    | `/api/auth/me`       | Get the authenticated user |

### Projects

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/projects`      | Get user projects |
| POST   | `/api/projects`      | Create a project  |
| DELETE | `/api/projects/<id>` | Delete a project  |

### Tasks

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | `/api/tasks`      | Get user tasks |
| POST   | `/api/tasks`      | Create a task  |
| PUT    | `/api/tasks/<id>` | Update a task  |
| DELETE | `/api/tasks/<id>` | Delete a task  |

## Testing

From the backend directory:

```bash
source venv/bin/activate
pytest
```

The current test suite contains tests covering authentication, projects, and tasks.

## Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

The production files are generated in the `dist` directory.

## Security

Environment variables containing secrets and credentials are excluded from version control using `.gitignore`.

Do not commit your local `.env` file or database credentials to the repository.

## Project Goal

FocusFlow demonstrates a complete full-stack application workflow, connecting a React frontend to a Flask REST API and PostgreSQL database with authenticated user access and persistent data management.
