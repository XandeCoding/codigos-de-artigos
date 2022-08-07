import { AsyncHandler } from "@tinyhttp/app";
import { IBook } from "../interfaces";

export const bookList: AsyncHandler = async (req, res) => {
    const books: IBook[] = [
        { id: 1, name: 'livro Teste'}
    ]

    res.send(books)
}

export const bookAdd: AsyncHandler = async (req, res) => {
    const body = req.body
    console.log('body', body)

    res.send(body)
}