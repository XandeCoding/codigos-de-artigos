import renderHTMLTemplate from "./utils/renderHTMLTemplate.ts";

function HTMLTemplateHandler(
    templateName: string
): () => Promise<Response> {
  return async () => {
    return new Response(
      await renderHTMLTemplate(templateName),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      },
    );
  };
}

export default HTMLTemplateHandler;
