
def define_env(env):
    ### Functions
    @env.macro
    def get_img_url(image_path):
        base_url = 'https://github.com/XandeCoding/codigos-de-artigos/blob/main'
        return f'{base_url}/{image_path}?raw=true'
    

    # Set functions
    env.macro(get_img_url, 'transform_to_github_img_url')

