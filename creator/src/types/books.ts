export interface Book {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  clicks?: number;
  coverImage: string;
}
