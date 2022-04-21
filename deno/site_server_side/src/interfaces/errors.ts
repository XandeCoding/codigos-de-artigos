export class TemplateNotFound extends Error {
  constructor(fileName: string) {
    super(`Error searching for file: ${fileName}`);
  }
}

export class InvalidModuleExported extends Error {
  constructor(fileName: string) {
    super(`${fileName} module exported is invalid`);
  }
}
