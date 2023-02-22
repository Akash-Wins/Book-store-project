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
   * creating new user and saving in Database
   */
  async createBook(bookInput: IBook): Promise<IBook> {
    const book = new Book(bookInput);
    let savedBook
    try {
        savedBook = await book.save();
    } catch (error) {
      return error;
    }
    return savedBook;
  }

  /**
   * Get viewMoreGrants list
   */
   public async getAll(): Promise<IBook> {
    let book;
    try {
        book = await Book.find().lean();
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
}
