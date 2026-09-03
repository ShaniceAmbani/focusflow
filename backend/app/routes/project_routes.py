from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.project import Project


project_bp = Blueprint(
    "projects",
    __name__,
    url_prefix="/api/projects"
)


@project_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"error": "Project name is required"}), 400

    project = Project(
        name=name,
        description=description,
        user_id=user_id
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        "message": "Project created successfully",
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "user_id": project.user_id
        }
    }), 201


@project_bp.route("", methods=["GET"])
@jwt_required()
def get_projects():
    user_id = int(get_jwt_identity())

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    if page < 1:
        page = 1

    if per_page < 1 or per_page > 50:
        per_page = 10

    pagination = Project.query.filter_by(
        user_id=user_id
    ).order_by(
        Project.created_at.desc()
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    projects = [
        {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "user_id": project.user_id,
            "created_at": project.created_at.isoformat()
            if project.created_at else None,
            "updated_at": project.updated_at.isoformat()
            if project.updated_at else None
        }
        for project in pagination.items
    ]

    return jsonify({
        "projects": projects,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages
        }
    }), 200


@project_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    user_id = int(get_jwt_identity())

    project = Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()

    if not project:
        return jsonify({"error": "Project not found"}), 404

    return jsonify({
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "user_id": project.user_id,
            "created_at": project.created_at.isoformat()
            if project.created_at else None,
            "updated_at": project.updated_at.isoformat()
            if project.updated_at else None
        }
    }), 200


@project_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    project = Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()

    if not project:
        return jsonify({"error": "Project not found"}), 404

    if "name" in data:
        if not data["name"]:
            return jsonify({
                "error": "Project name cannot be empty"
            }), 400

        project.name = data["name"]

    if "description" in data:
        project.description = data["description"]

    db.session.commit()

    return jsonify({
        "message": "Project updated successfully",
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "user_id": project.user_id
        }
    }), 200


@project_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    user_id = int(get_jwt_identity())

    project = Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()

    if not project:
        return jsonify({"error": "Project not found"}), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify({
        "message": "Project deleted successfully"
    }), 200