import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import { db } from "./config/firebase.js";
import dummyPaymentRoutes from "./routes/dummyPaymentRoutes.js";


// dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());




app.get("/", (req, res) => res.send("API OK"));
app.use("/api/payment", paymentRoutes);
app.use("/api/payment/dummy", dummyPaymentRoutes);
app.get("/test-firestore", async (req, res) => {
  try {
    const ref = db.collection("tests").doc("check1");
    await ref.set({
      status: "working",
      timestamp: new Date()
    });

    res.json({ success: true, message: "Firestore write success" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get("/test-env", (req, res) => {
  res.send("ENV Value: " + process.env.TEST_VALUE);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
