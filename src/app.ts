import cors from "cors";
import express from "express";
import "./lib/scheduler";
import { errorMiddleware } from "./middleware/error.middleware";
import accountRouter from "./routes/account.router";
import assessmentQuestionRouter from "./routes/assessment-question.router";
import assessmentRouter from "./routes/assessment.router";
import authRouter from "./routes/auth.router";
import certificateRouter from "./routes/certificate.router";
import companyLocationRouter from "./routes/company-location.router";
import companyRouter from "./routes/company.router";
import invoiceRouter from "./routes/invoice.router";
import interviewRouter from "./routes/interview.router";
import jobApplicationRouter from "./routes/job-applicaton.router";
import jobRouter from "./routes/job.router";
import locationRouter from "./routes/location.router";
import paymentRouter from "./routes/payment.router";
import questionOptionRouter from "./routes/question-option.router";
import sampleRouter from "./routes/sample.router";
import skillAssessmentUserAnswerRouter from "./routes/skill-assessment-user-answer.router";
import skillAssessmentQuestionRouter from "./routes/skill-assessment-question.router";
import skillAssessmentRouter from "./routes/skill-assessment.router";
import subscriptionCategoryRouter from "./routes/subscription-category.router";
import subscriptionRouter from "./routes/subscription.router";
import userAssessmentUser from "./routes/user-assessment.router";
import userRouter from "./routes/user.router";
import workExperienceRouter from "./routes/work-experience.router";
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
app.use("/interviews", interviewRouter);
app.use("/questions", assessmentQuestionRouter);
app.use("/options", questionOptionRouter);
app.use("/user-assessments", userAssessmentUser);
app.use("/payments", paymentRouter);
app.use("/subscription-categories", subscriptionCategoryRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/xendit-webhook", xenditRouter);
app.use("/auth", authRouter);
app.use("/skill-assessments", skillAssessmentRouter);
app.use("/skill-assessment-questions", skillAssessmentQuestionRouter);
app.use("/skill-assessment-user-answers", skillAssessmentUserAnswerRouter);
app.use("/certificates", certificateRouter);
app.use("/accounts", accountRouter);
app.use("/locations", locationRouter);
app.use("/work-experiences", workExperienceRouter);
app.use("/companies", companyRouter);

// middleware error
app.use(errorMiddleware);

export default app;
