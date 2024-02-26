from quart import Quart
from quart_schema import QuartSchema
import quart_injector

from src.configs.dependency_injection import configure as dependency_config
from src.routers.note_router import router as note_router



app = Quart(__name__)
QuartSchema(app)

app.register_blueprint(note_router)
quart_injector.wire(app, modules=[dependency_config])


