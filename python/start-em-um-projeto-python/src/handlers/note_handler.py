from src.repositories.note_repository import NoteRepository
from src.models.note_model import NoteModel 


def get_note_by_id(note_repository: NoteRepository, id: str) -> NoteModel:
    note = note_repository.get_by_id(id)

    if not note:
        # TODO: ADICIONAR ERRO
        return {}

    print("NOTAAA", note)
    return note
