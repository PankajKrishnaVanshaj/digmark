import { User } from "./user.Types";

export interface Book {
  _id: string;
  title: string;
  author: User;
  reviews: {
    reviewer: User;
    rating: number;
    comment: string;
    createdAt?: Date;
  }[];
  description: string;
  coverImage: string;
  bookPdf: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
