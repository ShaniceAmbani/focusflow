from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

from app.config import Config


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app(config_overrides=None):
    app = Flask(__name__)

    app.config.from_object(Config)

    if config_overrides:
        app.config.update(config_overrides)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # Import models so Flask-Migrate can detect them
    from app.models import User, Project, Task

    # Register authentication routes
    from app.routes.auth.routes import auth_bp
    app.register_blueprint(auth_bp)

    # Register project routes
    from app.routes.project_routes import project_bp
    app.register_blueprint(project_bp)

    # Register task routes
    from app.routes.task_routes import task_bp
    app.register_blueprint(task_bp)

    return app