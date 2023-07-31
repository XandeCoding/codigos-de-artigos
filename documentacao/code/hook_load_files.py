import logging
from typing import TypedDict
from pathlib import Path, PurePath
from os import walk, getcwd
from shutil import copyfile

log = logging.getLogger('mkdocs')

class DocumentData(TypedDict):
    origin: Path 
    name: str

IGNORE_LIST = frozenset({'documentacao', '.cache', '.git', '.github', '__pycache__'})
INDEX_DOC_TITLE = 'Códigos de Artigos'

def load_files():
    projects_path = Path(getcwd()).resolve().parent
    documents_path = Path(getcwd() + '/docs')

    log.info(f'Lendo os arquivos a partir de: {projects_path}')
    files_path = _get_md_files_path(projects_path)

    
    for data in load_documents_data(files_path):
        _save_file(
            origin=data['origin'],
            destination=_get_destination(documents_path, data['name'])
        )

def load_documents_data(files_path: list[Path]):
    for document_origin in files_path:
        yield {
            'origin': document_origin,
            'name': _get_title_name(document_origin)
        } 

    return


def _get_md_files_path(path) -> list[Path]:
    markdown_documents = []

    for (dir_path, _dir_names, file_names) in walk(path):
        if _ignore_dir(dir_path):
            continue
        for file in file_names:
            if 'README.md' == file:
                markdown_documents.append(Path(f'{dir_path}/{file}'))

    return markdown_documents


def _get_title_name(file_path) -> str:
    with open(file_path, 'r') as file:
        return file.readline().replace('#',  '').strip()


def _get_destination(documents_path: Path, title_name: str) -> Path:
    if title_name == INDEX_DOC_TITLE:
        title_name = 'index'

    return documents_path.joinpath(f'{title_name}.md')


def _save_file(origin, destination):
    log.info(f'\nSalvando arquivo `{origin}` em `{destination}`...')
    try:
       copyfile(origin, destination)
    except Exception as exc:
        log.error(f'Houve um erro ao salvar o arquivo: `{destination}` - {str(exc)}')
        return
    log.debug(f'Arquivo `{destination}` salvo com sucesso!')


def _ignore_dir(dir_path) -> bool:
    return bool(IGNORE_LIST.intersection(PurePath(dir_path).parts))


load_files()
