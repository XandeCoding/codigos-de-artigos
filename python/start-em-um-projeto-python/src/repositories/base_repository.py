import abc

from tinydb import TinyDB

from src.configs.database import DatabaseSettings


class BaseRepository:
    def __init__(self):
        # TODO: ADICIONAR ADPATER
        config = DatabaseSettings()
        self._db = TinyDB(config.database_url)

    @property
    @abc.abstractmethod
    def collection():
        ...
