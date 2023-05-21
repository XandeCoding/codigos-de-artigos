import logging
from typing import TypedDict, Union
from pathlib import Path, PurePath
from os import walk, getcwd
from shutil import copyfile

log = logging.getLogger('mkdocs')

class DocumentData(TypedDict):
    origin: str
    name: str

IGNORE_LIST = frozenset({'documentacao'})


def load_files():
    projects_path = Path(getcwd()).resolve().parent
    documents_path = Path(getcwd() + '/docs')

    log.info(f'Lendo os arquivos a partir de: {projects_path}')
    documents = _get_md_files_path(projects_path)
    documents_data: list[DocumentData] = []

    for document_origin in documents:
        documents_data.append({
            'origin': document_origin,
            'name': _get_title_name(document_origin)
        })
    
    for data in documents_data:
        _save_file(
            origin=data['origin'],
            destination=f'{documents_path}/{data["name"]}.md'
        )

def _get_md_files_path(path) -> list[str]:
    markdown_documents = []

    for (dir_path, _dir_names, file_names) in walk(path):
        if _ignore_dir(dir_path):
            continue
        for file in file_names:
            if 'README.md' == file:
                markdown_documents.append(f'{dir_path}/{file}')

    return markdown_documents


def _get_title_name(file_path) -> str:
    with open(file_path, 'r') as file:
        return file.readline().replace('#',  '').strip()


def _save_file(origin, destination):
    log.info(f'\nSalvando arquivo `{origin}` em `{destination}`...')
    try:
       copyfile(origin, destination)
    except Exception as exc:
        log.error(f'Houve um erro ao salvar o arquivo: `{destination}` - {str(exc)}')
        return
    log.debug(f'Arquivo `{destination}` salvo com sucesso!')


def _ignore_dir(dir_path):
    return bool(IGNORE_LIST.intersection(PurePath(dir_path).parts))

load_files()
