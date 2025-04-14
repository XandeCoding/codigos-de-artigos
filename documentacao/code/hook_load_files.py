import logging
from typing import TypedDict
from pathlib import Path, PosixPath, PurePath
from os import walk, getcwd
from shutil import copyfile

log = logging.getLogger('mkdocs')

class DocumentData(TypedDict):
    origin: Path 
    name: str

IGNORE_LIST = frozenset({'documentacao', '.cache', '.git', '.github', '__pycache__'})
INDEX_DOC_TITLE = frozenset({'Códigos de Artigos', 'Article Code'})

def load_files():
    projects_path = Path(getcwd()).resolve().parent
    documents_path = Path(getcwd() + '/docs')

    log.info(f'Lendo os arquivos a partir de: {projects_path}')
    files_path = _get_md_files_path(projects_path)

    
    for data in load_documents_data(files_path):
        _save_file(
            origin=data['origin'],
            destination=_get_destination(documents_path, data['name'], data['language'])
        )

def load_documents_data(files_path: list[Path]):
    for document_origin in files_path:
        yield {
            'origin': document_origin,
            'name': _get_title_name(document_origin),
            'language': _get_file_language(document_origin)
        } 


def _get_md_files_path(path) -> list[Path]:
    markdown_documents = []

    for (dir_path, _dir_names, file_names) in walk(path):
        if _ignore_dir(dir_path):
            continue
        for file in file_names:
            if _is_documentation_file(file):
                markdown_documents.append(Path(f'{dir_path}/{file}'))

    return markdown_documents


def _get_title_name(file_path: PosixPath) -> str:
    with open(file_path, 'r') as file:
        return file.readline().replace('#',  '').strip()


def _get_destination(documents_path: Path, title_name: str, language: str) -> Path:
    file_name = 'index'
    if title_name not in INDEX_DOC_TITLE:
        file_name = title_name

    return documents_path.joinpath(f'{language}/{file_name}.md')

def _get_file_language(file_path: PosixPath) -> str:
    file_name = file_path.parts[-1]
    if 'README-EN' in file_name:
        return 'english'

    return 'português'

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

def _is_documentation_file(filename: str) -> bool:
    return 'README' in filename and '.md' in filename

load_files()
