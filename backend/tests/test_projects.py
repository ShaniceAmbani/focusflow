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


def test_create_project(client, auth_headers):
    response = client.post(
        "/api/projects",
        headers=auth_headers,
        json={
            "name": "Test Project",
            "description": "A project for testing",
        },
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Project created successfully"
    assert data["project"]["name"] == "Test Project"


def test_get_projects(client, auth_headers):
    client.post(
        "/api/projects",
        headers=auth_headers,
        json={
            "name": "Test Project",
            "description": "A project for testing",
        },
    )

    response = client.get(
        "/api/projects",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["pagination"]["total"] == 1
    assert len(data["projects"]) == 1


def test_update_project(client, auth_headers):
    create_response = client.post(
        "/api/projects",
        headers=auth_headers,
        json={
            "name": "Old Project Name",
            "description": "Old description",
        },
    )

    project_id = create_response.get_json()["project"]["id"]

    response = client.put(
        f"/api/projects/{project_id}",
        headers=auth_headers,
        json={
            "name": "Updated Project Name",
            "description": "Updated description",
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["project"]["name"] == "Updated Project Name"
    assert data["project"]["description"] == "Updated description"


def test_delete_project(client, auth_headers):
    create_response = client.post(
        "/api/projects",
        headers=auth_headers,
        json={
            "name": "Project To Delete",
            "description": "This will be deleted",
        },
    )

    project_id = create_response.get_json()["project"]["id"]

    response = client.delete(
        f"/api/projects/{project_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Project deleted successfully"