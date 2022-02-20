from flask import Blueprint, request, session

blueprint = Blueprint("verification", __name__, url_prefix="/verification")


from app.routes.verification.register.routes import blueprint as verification_register_module


blueprint.register_blueprint(verification_register_module)

