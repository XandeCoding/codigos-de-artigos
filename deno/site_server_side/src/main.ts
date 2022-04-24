import HTTPServer from "./core/HTTPServer.ts";
import HTMLTemplateHandler from "./handlers/HTMLTemplateHandler.ts";
import JSXTemplateHandler from "./handlers/JSXTemplateHandler.ts";

const HTTPServerInstance = new HTTPServer({
  "/": JSXTemplateHandler("index", { phrase: "Hello World" }),
  "/teste": HTMLTemplateHandler("teste"),
});

HTTPServerInstance.serve();
