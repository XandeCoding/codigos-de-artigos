import { App } from '@tinyhttp/app'
import { bookAdd } from './handlers/book/bookHandlerData'

import bookRouter from './routes/bookRouter'

const app = new App()

app.post('/book', bookAdd)
app.listen(3000, () => console.log('Started on http://localhost:3000'))
