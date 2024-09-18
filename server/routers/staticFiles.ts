import path from "path";
import express, { Express } from "express";

const serveStaticFiles = (app: Express): void => {
  const bookPdfsPath = path.join(__dirname, "../../uploads/bookPdfs");
  const coverImagesPath = path.join(__dirname, "../../uploads/coverImages");

  app.use(express.static(bookPdfsPath));
  app.use(express.static(coverImagesPath));
};

export default serveStaticFiles;
