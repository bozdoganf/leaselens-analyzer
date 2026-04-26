import express from "express"; // express NodeJS
import cors from "cors"; // controls whether a browser frontend 
// from one address can call a backend at another address

import dotenv from "dotenv"; // loads secret/config values from a .env file
// think things like reading the api key

import { analyzeLeaseRouter } from "./routes/analyzeLease";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // middleware means the code that runs before your route handler
app.use(express.json()); // sort of adds the input params

//app.use("/api/analyze-lease", analyzeLeaseRouter);


app.get("/api/health", (_req, res) => { // when someone sends GET /api/health, run this function
  res.json({ ok: true }); // _req is incoming request, res is outgoing
});

app.use("/api/analyze-lease", analyzeLeaseRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});


//Express is a minimalist and flexible web application 
// framework for Node.js that simplifies building web servers and APIs