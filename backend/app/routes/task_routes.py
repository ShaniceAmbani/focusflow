from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.task import Task
from app.models.project import Project


task_bp = Blueprint(
    "tasks",
    __name__,
    url_prefix="/api/tasks"
)


def get_user_project(project_id, user_id):
    return Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()


@task_bp.route("", methods=["POST"])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    title = data.get("title")
    description = data.get("description")
    status = data.get("status", "pending")
    priority = data.get("priority", "medium")
    due_date = data.get("due_date")
    project_id = data.get("project_id")

    if not title:
        return jsonify({"error": "Task title is required"}), 400

    if not project_id:
        return jsonify({"error": "Project ID is required"}), 400

    project = get_user_project(project_id, user_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    if status not in ["pending", "in_progress", "completed"]:
        return jsonify({
            "error": "Invalid status"
        }), 400

    if priority not in ["low", "medium", "high"]:
        return jsonify({
            "error": "Invalid priority"
        }), 400

    task = Task(
        title=title,
        description=description,
        status=status,
        priority=priority,
        due_date=due_date,
        project_id=project_id
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({
        "message": "Task created successfully",
        "task": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "due_date": task.due_date,
            "project_id": task.project_id
        }
    }), 201


@task_bp.route("", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    if page < 1:
        page = 1

    if per_page < 1 or per_page > 50:
        per_page = 10

    pagination = Task.query.join(
        Project
    ).filter(
        Project.user_id == user_id
    ).order_by(
        Task.created_at.desc()
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    tasks = [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "due_date": task.due_date.isoformat()
            if task.due_date else None,
            "project_id": task.project_id,
            "created_at": task.created_at.isoformat()
            if task.created_at else None,
            "updated_at": task.updated_at.isoformat()
            if task.updated_at else None
        }
        for task in pagination.items
    ]

    return jsonify({
        "tasks": tasks,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages
        }
    }), 200


@task_bp.route("/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):
    user_id = int(get_jwt_identity())

    task = Task.query.join(
        Project
    ).filter(
        Task.id == task_id,
        Project.user_id == user_id
    ).first()

    if not task:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({
        "task": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "due_date": task.due_date.isoformat()
            if task.due_date else None,
            "project_id": task.project_id,
            "created_at": task.created_at.isoformat()
            if task.created_at else None,
            "updated_at": task.updated_at.isoformat()
            if task.updated_at else None
        }
    }), 200


@task_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    task = Task.query.join(
        Project
    ).filter(
        Task.id == task_id,
        Project.user_id == user_id
    ).first()

    if not task:
        return jsonify({"error": "Task not found"}), 404

    if "title" in data:
        if not data["title"]:
            return jsonify({
                "error": "Task title cannot be empty"
            }), 400

        task.title = data["title"]

    if "description" in data:
        task.description = data["description"]

    if "status" in data:
        if data["status"] not in [
            "pending",
            "in_progress",
            "completed"
        ]:
            return jsonify({
                "error": "Invalid status"
            }), 400

        task.status = data["status"]

    if "priority" in data:
        if data["priority"] not in [
            "low",
            "medium",
            "high"
        ]:
            return jsonify({
                "error": "Invalid priority"
            }), 400

        task.priority = data["priority"]

    if "due_date" in data:
        task.due_date = data["due_date"]

    db.session.commit()

    return jsonify({
        "message": "Task updated successfully",
        "task": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "due_date": task.due_date.isoformat()
            if task.due_date else None,
            "project_id": task.project_id
        }
    }), 200


@task_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())

    task = Task.query.join(
        Project
    ).filter(
        Task.id == task_id,
        Project.user_id == user_id
    ).first()

    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Task deleted successfully"
    }), 200