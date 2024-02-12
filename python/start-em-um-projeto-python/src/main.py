from quart import Quart
from src.repositories.note_repository import NoteRepository

app = Quart(__name__)


@app.route("/")
def read_root():
    return {"hello": "world"}

@app.route("/notes/<string:id_note>")
def get_note(id_note: str):
    note_repository = NoteRepository()
    return note_repository.get_by_id(id_note)

app.run()
