import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/datab.js";


dotenv.config();
const port = process.env.PORT || 3000;


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });





