from typing import Optional

from src.repositories.base_repository import BaseRepository
from src.models.note_model import NoteModel


class NoteRepository(BaseRepository):
    COLLECTION_NAME = "notes"

    @property
    def collection(self):
        return self._db.table(self.COLLECTION_NAME)

    def get_by_id(self, id: str) -> Optional[NoteModel]:
        if note := self.collection.get(doc_id=id):
            return NoteModel(
                id=note.doc_id,
                message=note["message"]
            )

    def add(self, message: str):
        return self.collection.insert(
            { "message": message }
        )

