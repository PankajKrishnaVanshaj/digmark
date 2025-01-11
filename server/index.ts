import express, { Request, Response } from 'express';
import cors from "cors";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { config } from "./config/EnvConfig";
import router from "./routers/index";
import { dbconnection } from "./config/db";
import serveStaticFiles from "./routers/staticFiles";
import passport from "passport";
import cookieParser from "cookie-parser";
import compression from "compression";


const app = express();

// Define CORS options
const corsOptions: cors.CorsOptions = {
  origin: [config.creatorDomain, config.clientDomain].filter(
    Boolean
  ) as string[],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // For JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded payloads
app.use(passport.initialize());
app.use(morgan("dev"));
 // Enable response compression
 app.use(
  compression({
    level: 6, // Compression level (1-9)
    threshold: 1024, // Compress responses larger than 1KB
    filter: (req: Request, res: Response) => {
      const contentType = res.get('Content-Type');
      if (contentType && contentType.includes('text')) {
        return true;
      }
      return compression.filter(req, res);
    },
  })
);

// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, "uploads/bookPdfs")));
// app.use(express.static(path.join(__dirname, "uploads/coverImages")));

// Serve static files
serveStaticFiles(app);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to PanKri DigMark" });
});

app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

const startServer = async () => {
  // Connect database
  await dbconnection();

  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
