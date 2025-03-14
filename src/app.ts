import cors from "cors";
import express from "express";
import "./lib/scheduler";
import { errorMiddleware } from "./middleware/error.middleware";
import accountRouter from "./routes/account.router";
import assessmentRouter from "./routes/assessment.router";
import assessmentQuestionRouter from "./routes/assessment-question.router";
import assessmentAssessmentUserAttemptRouter from "./routes/pre-test-assessment-user-attempt.router";
import authRouter from "./routes/auth.router";
import badgeRouter from "./routes/badge.router";
import certificateRouter from "./routes/certificate.router";
import companyLocationRouter from "./routes/company-location.router";
import companyReviewRouter from "./routes/company-review.router";
import companyRouter from "./routes/company.router";
import industryRouter from "./routes/industry.router";
import interviewRouter from "./routes/interview.router";
import invoiceRouter from "./routes/invoice.router";
import jobApplicationRouter from "./routes/job-applicaton.router";
import jobRouter from "./routes/job.router";
import locationRouter from "./routes/location.router";
import overviewRouter from "./routes/overview.router";
import paymentRouter from "./routes/payment.router";
import searchRouter from "./routes/search.router";
import employeeRouter from "./routes/employee.router";
import skillAssessmentQuestionRouter from "./routes/skill-assessment-question.router";
import skillAssessmentUserAttemptRouter from "./routes/skill-assessment-user-attempt.router";
import skillAssessmentRouter from "./routes/skill-assessment.router";
import subscriptionCategoryRouter from "./routes/subscription-category.router";
import subscriptionRouter from "./routes/subscription.router";
import userRouter from "./routes/user.router";
import workExperienceRouter from "./routes/work-experience.router";
import xenditRouter from "./routes/xendit-webhook.router";
import savedJobRouter from "./routes/saved-job.router";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [/http:\/\/localhost/, "https://supajob.my.id"],
  })
);
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to Supajob API");
});

//routes
app.use("/users", userRouter);
app.use("/company-locations", companyLocationRouter);
app.use("/jobs", jobRouter);
app.use("/job-applications", jobApplicationRouter);
app.use("/invoices", invoiceRouter);
app.use("/interviews", interviewRouter);
app.use("/assessments", assessmentRouter);
app.use("/assessment-questions", assessmentQuestionRouter);
app.use("/assessment-user-attempts", assessmentAssessmentUserAttemptRouter);
app.use("/payments", paymentRouter);
app.use("/subscription-categories", subscriptionCategoryRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/xendit-webhook", xenditRouter);
app.use("/auth", authRouter);
app.use("/skill-assessments", skillAssessmentRouter);
app.use("/skill-assessment-questions", skillAssessmentQuestionRouter);
app.use("/skill-assessment-user-attempts", skillAssessmentUserAttemptRouter);
app.use("/certificates", certificateRouter);
app.use("/accounts", accountRouter);
app.use("/locations", locationRouter);
app.use("/work-experiences", workExperienceRouter);
app.use("/companies", companyRouter);
app.use("/badges", badgeRouter);
app.use("/industries", industryRouter);
app.use("/search", searchRouter);
app.use("/reviews", companyReviewRouter);
app.use("/employees", employeeRouter);
app.use("/overviews", overviewRouter);
app.use("/saved-jobs", savedJobRouter);

// middleware error
app.use(errorMiddleware);

export default app;
