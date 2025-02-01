import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "./lib/scheduler";
import assessmentQuestionRouter from "./routes/assessment-question.router";
import assessmentRouter from "./routes/assessment.router";
import companyLocationRouter from "./routes/company-location.router";
import invoiceRouter from "./routes/invoice.router";
import jobApplicationRouter from "./routes/job-applicaton.router";
import jobRouter from "./routes/job.router";
import paymentRouter from "./routes/payment.router";
import questionOptionRouter from "./routes/question-option.router";
import sampleRouter from "./routes/sample.router";
import subscriptionCategoryRouter from "./routes/subscription-category.router";
import subscriptionRouter from "./routes/subscription.router";
import xenditRouter from "./routes/xendit-webhook.router";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/samples", sampleRouter);
app.use("/company-locations", companyLocationRouter);
app.use("/jobs", jobRouter);
app.use("/job-applications", jobApplicationRouter);
app.use("/assessments", assessmentRouter);
app.use("/invoices", invoiceRouter);
app.use("/questions", assessmentQuestionRouter);
app.use("/options", questionOptionRouter);
app.use("/payments", paymentRouter);
app.use("/subscription-categories", subscriptionCategoryRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/xendit-webhook", xenditRouter);

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

export default app;
