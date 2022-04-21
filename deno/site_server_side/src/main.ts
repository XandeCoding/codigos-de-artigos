import HTTPServer from './core/HTTPServer.ts';
import jsxTemplateHandler from './handlers/jsxTemplateHandler.ts';

const HTTPServerInstance = new HTTPServer({
  '/': jsxTemplateHandler('index', { phrase: 'Hello World' }),
  '/teste': jsxTemplateHandler('index', { phrase: 'Testando' }),
});

HTTPServerInstance.serve();
