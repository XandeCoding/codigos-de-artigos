from quart import Quart

app = Quart(__name__)


@app.route("/")
async def read_root():
    return {"hello": "world"}


app.run()
