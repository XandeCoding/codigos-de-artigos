from os import getenv, getcwd
from enum import StrEnum
from pathlib import Path
import logging

class IMG_PROVIDER(StrEnum):
    LOCAL = 'LOCAL'
    GITHUB = 'GITHUB'

    def is_local(self):
        return self is self.LOCAL

def define_env(env):
    ### Functions
    @env.macro
    def get_img_url(image_path):
        provider = IMG_PROVIDER(getenv('IMG_PROVIDER', IMG_PROVIDER.LOCAL.value))
        logging.warning(f'IMG_PROVIDER - {provider}')

        if provider.is_local():
            base_path = Path(getcwd()).resolve().parent
            return f'file://{str(base_path)}/{image_path}'
        else:
            base_path = 'https://github.com/XandeCoding/codigos-de-artigos/blob/main'
            return f'{base_path}/{image_path}?raw=true'
    

    # Set functions
    env.macro(get_img_url, 'transform_to_github_img_url')

