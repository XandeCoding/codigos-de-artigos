import injector
from src.repositories.note_repository import NoteRepository


def configure(binder: injector.Binder) -> None:
    binder.bind(NoteRepository, to=NoteRepository())
