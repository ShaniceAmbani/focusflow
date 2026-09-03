import pytest

from app import create_app, db


@pytest.fixture
def app():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key-that-is-at-least-32-characters",
    })

    with app.app_context():
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )

    token = response.get_json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


@pytest.fixture
def project(client, auth_headers):
    response = client.post(
        "/api/projects",
        headers=auth_headers,
        json={
            "name": "Test Project",
            "description": "Project for task tests",
        },
    )

    return response.get_json()["project"]["id"]


def test_create_task(client, auth_headers, project):
    response = client.post(
        "/api/tasks",
        headers=auth_headers,
        json={
            "title": "Test Task",
            "description": "Task for testing",
            "status": "pending",
            "priority": "high",
            "project_id": project,
        },
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Task created successfully"
    assert data["task"]["title"] == "Test Task"
    assert data["task"]["priority"] == "high"


def test_get_tasks(client, auth_headers, project):
    client.post(
        "/api/tasks",
        headers=auth_headers,
        json={
            "title": "Test Task",
            "description": "Task for testing",
            "status": "pending",
            "priority": "medium",
            "project_id": project,
        },
    )

    response = client.get(
        "/api/tasks",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["pagination"]["total"] == 1
    assert len(data["tasks"]) == 1


def test_update_task(client, auth_headers, project):
    create_response = client.post(
        "/api/tasks",
        headers=auth_headers,
        json={
            "title": "Old Task",
            "description": "Old description",
            "status": "pending",
            "priority": "low",
            "project_id": project,
        },
    )

    task_id = create_response.get_json()["task"]["id"]

    response = client.put(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
        json={
            "title": "Updated Task",
            "status": "completed",
            "priority": "high",
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["task"]["title"] == "Updated Task"
    assert data["task"]["status"] == "completed"
    assert data["task"]["priority"] == "high"


def test_delete_task(client, auth_headers, project):
    create_response = client.post(
        "/api/tasks",
        headers=auth_headers,
        json={
            "title": "Task To Delete",
            "description": "This will be deleted",
            "status": "pending",
            "priority": "low",
            "project_id": project,
        },
    )

    task_id = create_response.get_json()["task"]["id"]

    response = client.delete(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Task deleted successfully"