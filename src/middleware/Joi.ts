import Joi, { ObjectSchema } from 'joi';

import { NextFunction, Request, Response } from 'express';

import { IAuthor } from '../models/Author';
import { BOOK_LANGUAGES, BOOK_TAGS, IBook } from '../models/Book';

// Funcion que se encarga de validar los datos que llegan en una petición
// Recibe un esquema de Joi y comprueba que el body cumple sus condiciones
export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Comprobamos que los datos del body cumplen el esquema
            await schema.validateAsync(req.body);

            // Si la validacion es correcta continuamos con la siguiente funcion
            next();
        } catch (error) {
            // Si los datos no son validos pasamos el error al siguiente middleware
            next(error);
        }
    };
};

// Un id de MongoDB tiene 24 caracteres hexadecimales
// Esta expresion nos sirve para comprobar que tiene el formato correcto
const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

// Funcion que comprueba el id que llega en los parametros de la URL
// Si no tiene el formato de un id de MongoDB devolvemos un error 400
export const ValidateId = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Cogemos el parametro de la URL usando el nombre que hemos recibido
        const id = req.params[paramName];

        // Comprobamos que existe y que tiene el formato correcto
        if (typeof id !== 'string' || !OBJECT_ID.test(id)) {
            // Si no es valido devolvemos un error de peticion incorrecta
            return res.status(400).json({ message: `${paramName} no es un id válido` });
        }

        // Si el id es correcto continuamos con la siguiente funcion
        next();
    };
};

// Aqui tenemos todos los esquemas de validacion que utilizamos en la aplicacion
export const Schemas = {
    // Validaciones relacionadas con los autores
    author: {
        // Esquema que se utiliza cuando queremos crear un autor
        create: Joi.object<IAuthor>({
            name: Joi.string().required().example('Ursula K. Le Guin'),
            email: Joi.string().email().required().example('leguin@example.com'),
            password: Joi.string().min(8).required().example('seminari5'),
            birthDate: Joi.date(),
            nationality: Joi.string(),
            biography: Joi.string().max(1000),
            website: Joi.string().uri(),
            photoUrl: Joi.string().uri(),
            active: Joi.boolean(),
            role: Joi.string().valid('author', 'admin')
        }),

        // Esquema que se utiliza para actualizar un autor
        update: Joi.object<IAuthor>({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            birthDate: Joi.date(),
            nationality: Joi.string(),
            biography: Joi.string().max(1000),
            website: Joi.string().uri(),
            photoUrl: Joi.string().uri(),
            active: Joi.boolean(),
            role: Joi.string().valid('author', 'admin')
        })
    },

    // Validaciones relacionadas con los libros
    book: {
        // Esquema que se utiliza cuando queremos crear un libro
        create: Joi.object<IBook>({
            title: Joi.string().required().example('A Wizard of Earthsea'),
            authors: Joi.array().items(Joi.string().regex(OBJECT_ID)).min(1).required().example(['6ab2d1ad9ada2730451295a7']),
            isbn: Joi.string().required().example('9788400000008'),
            edition: Joi.number().min(1),
            publisher: Joi.string(),
            publishedYear: Joi.number().min(1450).max(2100),
            pages: Joi.number().min(1),
            language: Joi.string().valid(...BOOK_LANGUAGES),
            tags: Joi.array().items(Joi.string().valid(...BOOK_TAGS)),
            price: Joi.number().min(0)
        }),

        // Esquema que se utiliza para actualizar un libro
        update: Joi.object<IBook>({
            title: Joi.string().required(),
            authors: Joi.array().items(Joi.string().regex(OBJECT_ID)).min(1).required(),
            isbn: Joi.string().required(),
            edition: Joi.number().min(1),
            publisher: Joi.string(),
            publishedYear: Joi.number().min(1450).max(2100),
            pages: Joi.number().min(1),
            language: Joi.string().valid(...BOOK_LANGUAGES),
            tags: Joi.array().items(Joi.string().valid(...BOOK_TAGS)),
            price: Joi.number().min(0)
        }),

        // ================= AÑADIDO PARA EL EJERCICIO DE TAGS =================
        // Valida que el body traiga { "tag": "..." } con uno de los tags válidos
        addTag: Joi.object({
            tag: Joi.string()
                .valid(...BOOK_TAGS)
                .required()
        }),

        // Valida que el body traiga { "tags": ["..."] } con elementos válidos
        setTags: Joi.object({
            tags: Joi.array()
                .items(Joi.string().valid(...BOOK_TAGS))
                .required()
        })
        // =====================================================================
    }
};
