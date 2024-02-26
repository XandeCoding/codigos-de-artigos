from quart import Blueprint 
from quart_schema import validate_request, validate_response
from injector import Inject

from src.repositories.note_repository import NoteRepository

from src.handlers.note_handler import get_note_by_id
from src.routers.schemas.note_schema import NoteSchema, NoteCreateSchema


router = Blueprint('notes', __name__, url_prefix="/v1/notes")

@router.route("/<string:id_note>", methods=["GET"])
@validate_response(NoteSchema)
async def get_note(
    note_repository: Inject[NoteRepository],
    id_note: str
) -> NoteSchema:
    data = get_note_by_id(note_repository, id_note)
    return NoteSchema(message=data.message)

# @router.route("/", methods=["POST"])
# @validate_request(NoteCreateSchema)
# @validate_response(dict)
# async def add_note(note: NoteCreateSchema):
#     note_repository = NoteRepository()
#     document_id = note_repository.add({"message": note.message})

#     return {"id": document_id}
