from pydantic import BaseModel

class NoteSchema(BaseModel):
    message: str

class NoteCreateSchema(NoteSchema):
    pass

class NoteDataSchema(NoteSchema):
    id: str
