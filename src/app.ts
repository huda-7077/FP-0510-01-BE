import cors from "cors";
import express from "express";
import "./lib/scheduler";
import { errorMiddleware } from "./middleware/error.middleware";
import assessmentQuestionRouter from "./routes/assessment-question.router";
import questionOptionRouter from "./routes/question-option.router";
import userAssessmentUser from "./routes/user-assessment.router";
import companyLocationRouter from "./routes/company-location.router";
import assessmentRouter from "./routes/assessment.router";
import authRouter from "./routes/auth.router";
import invoiceRouter from "./routes/invoice.router";
import jobApplicationRouter from "./routes/job-applicaton.router";
import jobRouter from "./routes/job.router";
import paymentRouter from "./routes/payment.router";
import sampleRouter from "./routes/sample.router";
import subscriptionCategoryRouter from "./routes/subscription-category.router";
import subscriptionRouter from "./routes/subscription.router";
import userRouter from "./routes/user.router";
import xenditRouter from "./routes/xendit-webhook.router";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to Supajob API");
});

//routes
app.use("/samples", sampleRouter);
app.use("/users", userRouter);
app.use("/company-locations", companyLocationRouter);
app.use("/jobs", jobRouter);
app.use("/job-applications", jobApplicationRouter);
app.use("/assessments", assessmentRouter);
app.use("/invoices", invoiceRouter);
app.use("/questions", assessmentQuestionRouter);
app.use("/options", questionOptionRouter);
app.use("/user-assessments", userAssessmentUser);
app.use("/payments", paymentRouter);
app.use("/subscription-categories", subscriptionCategoryRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/xendit-webhook", xenditRouter);
app.use("/auth", authRouter);

// middleware error
app.use(errorMiddleware);

export default app;
