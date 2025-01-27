import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import sampleRouter from "./routes/sample.router";
import jobRouter from "./routes/job.router";
import assessmentRouter from "./routes/assessment.router";
import assessmentQuestionRouter from "./routes/assessment-question.router";
import questionOptionRouter from "./routes/question-option.router";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/samples", sampleRouter);
app.use("/jobs", jobRouter);
app.use("/assessments", assessmentRouter);
app.use("/questions", assessmentQuestionRouter);
app.use("/options", questionOptionRouter);

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

export default app;
