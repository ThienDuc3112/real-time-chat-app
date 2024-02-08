import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();

app.use(cors());
app.use(express.json());

const server = createServer(app);
