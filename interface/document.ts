import { NoteInterface } from "./note";

export interface DocumentInterface {
  _id: string;
  title: string;
  url: string;
  user: string;
  reviewers: string[];
  notes: NoteInterface[];
  createdAt?: Date;
  updatedAt?: Date;
}
