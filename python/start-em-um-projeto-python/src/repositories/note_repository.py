from src.repositories.base_repository import BaseRepository, InterfaceRepository
from tinydb import Query


class NoteRepository(InterfaceRepository, BaseRepository):
    COLLECTION_NAME = "notes"

    @property
    def collection(self):
        print("SELF", self.COLLECTION_NAME, self._db)
        return self._db.table(self.COLLECTION_NAME)

    def get_by_id(self, id: str):
        return self.collection.get(doc_id=id)

