import * as path from 'https://deno.land/std@0.136.0/path/mod.ts';
import { renderToString } from 'https://esm.sh/react-dom/server';
import {
  InvalidModuleExported,
  TemplateNotFound,
} from '../../interfaces/errors.ts';

async function renderJSXTemplate(
  fileName: string,
  params?: Record<string, unknown>,
) {
  const fileNameWithExtension = `${fileName}.jsx`;

  try {
    const jsxFile = await import(
      path.join('../../templates/', fileNameWithExtension)
    );

    if (!jsxFile?.default) {
      throw new InvalidModuleExported(fileNameWithExtension);
    }

    const jsxComponent = jsxFile.default;
    return renderToString(jsxComponent(params));
  } catch (error) {
    if (error instanceof TypeError) {
      throw new TemplateNotFound(fileNameWithExtension);
    }

    throw error
  }
}

export default renderJSXTemplate;
