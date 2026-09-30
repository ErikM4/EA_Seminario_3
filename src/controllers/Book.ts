import { NextFunction, Request, Response } from 'express';
import BookService from '../services/BookService';

// Función para crear un libro nuevo
const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookService.createBook(req.body);
        res.status(201).json({ book });
    } catch (error) {
        next(error);
    }
};

// Función para buscar un libro concreto usando su ID
const readBook = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
        const book = await BookService.getBookById(bookId);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Función para obtener todos los libros
const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookService.getAllBooks();
        res.status(200).json({ books });
    } catch (error) {
        next(error);
    }
};

// Función para modificar los datos de un libro
const updateBook = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
        const book = await BookService.updateBook(bookId, req.body);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Función para eliminar un libro
const deleteBook = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
        const book = await BookService.deleteBook(bookId);

        if (book) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};

// ================= AÑADIDO PARA EL EJERCICIO DE TAGS =================

// Añade un tag al libro
const addTag = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    const { tag } = req.body;

    try {
        const book = await BookService.addTag(bookId, tag);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Reemplaza todos los tags del libro
const replaceTags = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    const { tags } = req.body;

    try {
        const book = await BookService.replaceTags(bookId, tags);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Elimina un tag específico del libro
const removeTag = async (req: Request<{ bookId: string; tag: string }>, res: Response, next: NextFunction) => {
    const { bookId, tag } = req.params;

    try {
        const book = await BookService.removeTag(bookId, tag);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};
// =====================================================================

// Exportamos todas las funciones para poder utilizarlas en las rutas
export default {
    createBook,
    readBook,
    readAll,
    updateBook,
    deleteBook,

    // ================= AÑADIDO =================
    addTag,
    replaceTags,
    removeTag
    // ===========================================
};
