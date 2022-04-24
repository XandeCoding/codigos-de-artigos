import { join } from "https://deno.land/std@0.136.0/path/mod.ts";
import { render } from "https://cdn.skypack.dev/pin/preact-render-to-string@v5.1.21-ATsqxwkCuj8sDBnzlZ6a/mode=imports/optimized/preact-render-to-string.js";
import {
  InvalidModuleExported,
  TemplateNotFound,
} from "../../interfaces/errors.ts";

async function renderJSXTemplate(
  fileName: string,
  params?: Record<string, unknown>,
) {
  const fileNameWithExtension = `${fileName}.jsx`;

  try {
    const jsxFile = await import(
      join("../../templates/", fileNameWithExtension)
    );

    if (!jsxFile?.default) {
      throw new InvalidModuleExported(fileNameWithExtension);
    }

    const jsxComponent = jsxFile.default;
    return render(jsxComponent(params));
  } catch (error) {
    console.error("Error rendering JSX template: ", error);
    if (error instanceof TypeError) {
      throw new TemplateNotFound(fileNameWithExtension);
    }

    throw error;
  }
}

export default renderJSXTemplate;
