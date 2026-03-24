import express from "express";
import cors from "cors";
import searchRouter from "./routes/search.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log(`WeSki API server running on http://localhost:${PORT}`);
});
