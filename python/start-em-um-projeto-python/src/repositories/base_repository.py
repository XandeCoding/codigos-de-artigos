import abc

from tinydb import TinyDB


class InterfaceRepository(abc.ABC):
    @property
    @abc.abstractmethod
    def collection():
        ...

class BaseRepository:
    def __init__(self):
        self._db = TinyDB('db.json')
