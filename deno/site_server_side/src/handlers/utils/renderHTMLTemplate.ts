import { join } from "https://deno.land/std@0.136.0/path/mod.ts";
import { TemplateNotFound } from "../../interfaces/errors.ts";

async function renderHTMLTemplate(fileName: string) {
  const fileNameWithExtension = `${fileName}.html`;

  try {
    const htmlFile = await Deno.readTextFile(
      join("src/templates/", fileNameWithExtension),
    );

    if (!htmlFile) {
      throw new TemplateNotFound(fileNameWithExtension);
    }

    return htmlFile;
  } catch (error) {
    console.error("Error rendering HTML template: ", error);
    throw error;
  }
}

export default renderHTMLTemplate;
