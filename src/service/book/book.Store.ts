import IBook from "../../utils/interface/IBook";
import { Document, Schema, Model, model } from "mongoose";
import BookMongo from "../../models/book.model";

export interface IBookModel extends IBook, Document {
  _id: string;
}
export const BookSchema = new Schema(BookMongo);
export const Book: Model<IBookModel> = model<IBookModel>("Book", BookSchema);

export default class BookStore {
  public static OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
      super("An error occured while processing the request.");
    }
  };

  /**
   * creating new book and saving in Database
   */
  async createBook(bookInput: IBook): Promise<IBook> {
    const book = new Book(bookInput);
    let savedBook;
    try {
      savedBook = await book.save();
    } catch (error) {
      return error;
    }
    return savedBook;
  }

  /**
   * Get book list
   */
  public async getAll(shopId: string): Promise<IBook> {
    let book;
    try {
      book = await Book.find({ shopId }).lean();
    } catch (e) {
      return Promise.reject(new BookStore.OPERATION_UNSUCCESSFUL());
    }
    return book;
  }

  /**
   * Get book list
   */
  public async getAllBook(sellerId: string): Promise<IBook> {
    let book;
    try {
      book = await Book.find({ sellerId }).lean();
    } catch (e) {
      return Promise.reject(new BookStore.OPERATION_UNSUCCESSFUL());
    }
    return book;
  }

  /**
   *Get by attributes in object form
   */
  public async getByAttributes(attributes: object): Promise<IBook> {
    try {
      return await Book.findOne(attributes).lean();
    } catch (e) {
      return Promise.reject(new BookStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * updating book
   */
  public async update(_id: string, attributes: object): Promise<IBook> {
    try {
      const updateBook = await Book.findByIdAndUpdate(
        { _id },
        { $set: attributes },
        { upsert: true, new: true }
      ).lean();
      return updateBook;
    } catch (e) {
      return Promise.reject(new BookStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * updating many books
   */
  public async updateAllBooks(
    sellerId: string,
    attributes: object
  ): Promise<any> {
    try {
      const updateBooks = await Book.updateMany(
        { sellerId },
        { $set: attributes },
        { upsert: true, new: true }
      ).lean();
      return updateBooks;
    } catch (e) {
      return Promise.reject(new BookStore.OPERATION_UNSUCCESSFUL());
    }
  }
}
