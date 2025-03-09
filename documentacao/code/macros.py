from os import getenv, getcwd, path
from enum import StrEnum
from pathlib import Path
import logging
import base64

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
            abs_img_path = Path(f'{str(base_path)}/{image_path}')
            image_file = open(abs_img_path, 'rb')
            image_blob = image_file.read()
            image_file.close()

            image_base64 = base64.b64encode(image_blob)
            return f'data:image/png;base64, {image_base64.decode("utf-8")}'
        else:
            base_path = 'https://github.com/XandeCoding/codigos-de-artigos/blob/main'
            return f'{base_path}/{image_path}?raw=true'
    
