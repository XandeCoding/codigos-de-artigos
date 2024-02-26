from pydantic import BaseModel


class NoteModel(BaseModel):
    id: str
    message: str

