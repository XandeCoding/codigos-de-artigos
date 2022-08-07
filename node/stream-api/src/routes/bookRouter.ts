import { App } from "@tinyhttp/app";
import { bookList, bookAdd } from "../handlers/book/bookHandlerData";

const bookRouter = new App()

bookRouter.get('/', bookList)
bookRouter.post('/', bookAdd)

export default bookRouter
