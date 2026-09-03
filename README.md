# FocusFlow

FocusFlow is a full-stack productivity management application designed to help users organize projects and manage tasks efficiently.

## Live Demo

https://focusflow-xi-ten.vercel.app/

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

### Deployment

- Vercel — Frontend
- Render — Backend
- Render PostgreSQL — Database

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

### 1. Clone the Repository

```bash
git clone https://github.com/ShaniceAmbani/focusflow.git
cd focusflow
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the required dependencies:

```bash
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

The backend will run locally at:

```text
http://127.0.0.1:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd focusflow/frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
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

From the backend directory, activate the virtual environment and run:

```bash
source venv/bin/activate
pytest
```

The test suite contains tests covering authentication, projects, and tasks.

## Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

The production files are generated in the `dist` directory.

## Deployment

The FocusFlow frontend is deployed using Vercel, while the Flask backend and PostgreSQL database are hosted on Render.

### Frontend

Live application:

https://focusflow-xi-ten.vercel.app/

### Backend

The Flask API is deployed on Render.

Backend URL:

https://focusflow-backend-3xvf.onrender.com

## Security

Environment variables containing secrets and credentials are excluded from version control using `.gitignore`.

Do not commit your local `.env` file or database credentials to the repository.

## Project Goal

FocusFlow demonstrates a complete full-stack application workflow, connecting a React frontend to a Flask REST API and PostgreSQL database with authenticated user access and persistent data management.

The project demonstrates the development, testing, and deployment of a functional productivity management application using modern web development technologies.

## Author

**Shanice Ambani**
