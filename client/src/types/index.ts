export type Book = {
  _id: string;
  title: string;
  category?: string;
  description: string;
  coverImage: string;
  bookPdf: string;
  author?: Author;
  rating?: string;
};

export type Author = {
  name: string;
};
