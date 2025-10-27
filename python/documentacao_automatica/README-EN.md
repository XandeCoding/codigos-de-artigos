# 🧩 Automated Documentation using MkDocs and Python

Something I really enjoy is browsing through library documentation — honestly, good documentation is something I find beautiful to see and also difficult to maintain 😅.

Now imagine: every time a change is made to a behavior, having to go to the page that explains it, copy and paste the code, write what changed, run the build, check if everything is correct... wait, that's not how it should be! — I'm already tired just thinking about it 😤.

## 🐛 Tool to be documented

I created a very simple tool that makes a call to the PokeAPI, fetches information about a Pokémon, and displays the result in the terminal.

The source code can be found here: [Automated Documentation](https://github.com/XandeCoding/codigos-de-artigos/tree/main/python/documentacao_automatica)

Talking a bit more about the project: I used Poetry to manage the virtual environment and keep the libraries isolated from the rest of the system (nobody wants to clutter their PC with libs, right?).
But you can use any other tool, like pyenv or virtualenvwrapper — it doesn't matter.

The installed libraries are listed in pyproject.toml, so just install them and start playing.

## 📝 How to document

![Pokémon API access code PokeAPI]({{ get_img_url('python/documentacao_automatica/docs/assets/pokemon_code.png') }})

This is a small piece of the code I'll use as an example.
You must have noticed those """ — they are Docstrings, used to document code. It's a very common convention for documenting modules, classes, functions... well, anything.
If you're going to document something, I highly recommend using docstrings 😜.

These docstrings are what make the magic happen: we'll make them be automatically read and inserted into the corresponding documentation pages.
With the docstrings ready and explaining what each function does, we can proceed.

## ⬆️ Installing MkDocs

To install using Poetry it's very simple — just use poetry add, or pip install if you're not using it.

![Code showing how to install mkdocs]({{ get_img_url('python/documentacao_automatica/docs/assets/instalar-mkdocs.png') }})

**_Note:_** When installing mkdocstrings, replace [python] with the language you're using.
Check the official documentation to verify support: Mkdocstrings Docs.

We installed MkDocs, a nice theme called mkdocs-material (a matter of taste, but I really like it 😄), and finally mkdocstrings, a plugin that scans the project and inserts the docstrings into the corresponding pages.

So now? What do we do with all this? 🤔 Don't worry, you don't need to send a letter to a TV show — it's much simpler than that 😂.
Following the step-by-step below, your documentation will be ready in no time:

### Step 1️⃣

Open a terminal inside the project folder and use the command:
```bash
mkdocs new .
```
This will create the configuration files and the docs folder.

### Step 2️⃣

Now you should have a file called mkdocs.yml in the project root.
In it, add the following configurations:
```yml
    site_name: Automated Documentation # You can use your application's name

    theme:
        name: material # Adds the nice theme

        plugins:
        - search # Plugin that enables search in the documentation
        - mkdocstrings: # This one makes the magic happen!
            default_handler: python
```
**_Note:_** Yeah, the code looks a bit ugly, but this way you can just copy and paste — my laziness salutes yours 🙏

The mkdocstrings plugin is responsible for reading the docstrings and automatically adding them to the corresponding pages.

### Step 3️⃣

Run the commands:

```bash
mkdocs build
mkdocs serve
```
Then, access the documentation through your browser at:
👉 http://127.0.0.1:8000/

You'll see something similar to the image below:

![Documentation page index]({{ get_img_url('python/documentacao_automatica/docs/assets/mkdocs-index.png') }})
                  
### Step 4️⃣

When you access it, you'll see an introduction explaining how to add pages — it's very simple!
Just create a .md file inside the docs folder in the project root, and it will be automatically added to the documentation structure.

Your structure should look similar to this:

![Folder structure]({{ get_img_url('python/documentacao_automatica/docs/assets/estrutura.png') }})

### Step 5️⃣

Now let's go to the pokemon page, used to document the pokemon module we saw at the beginning.

![Documentation markdown file]({{ get_img_url('python/documentacao_automatica/docs/assets//markdown.png') }})

In the page content, we have a brief introduction and then something like:

```markdown
::: src.pokemon
```

But what is this?
This command maps the module to be automatically documented — the path is the same one used in the import.
Don't believe it works? Take a look at the result:

![Pokémon module documentation]({{ get_img_url('python/documentacao_automatica/docs/assets/mkdocs-pokemon.png') }})

### Step 6️⃣

Enjoy! 😁

## 🎉 The End

In just a few steps, we already have pretty nice documentation!
If you add new modules or want to create more pages, just include the file inside the docs folder, and you're done.

I hope you enjoyed it!
And if you have any questions (or found any errors — it happens to the best of us 😅), just leave a comment below!
