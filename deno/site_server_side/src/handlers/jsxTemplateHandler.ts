import renderJSXTemplate from './utils/renderJSXTemplate.ts';

function jsxTemplateHandler(
  templateName: string,
  params?: Record<string, unknown>,
): () => Promise<Response> {
  return async () => {
    return new Response(
      await renderJSXTemplate(templateName, params),
      {
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      },
    );
  };
}

export default jsxTemplateHandler;
