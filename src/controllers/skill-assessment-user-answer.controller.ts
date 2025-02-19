import { NextFunction, Request, Response } from "express";
import { submitSkillAssessmentUserAnswerService } from "../services/skill-assessment-user-answer/submit-skill-assessment-user-answer.service";
import { getSkillAssessmentUserScoreService } from "../services/skill-assessment-user-answer/get-skill-assessment-user-score.service";

export const getSkillAssessmentUserScoreController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = res.locals.user.id;
    const slug = req.params.slug;
    const result = await getSkillAssessmentUserScoreService(parseInt(id), slug);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const submitSkillAssessmentUserAnswerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = res.locals.user.id;
    const { questionId, selectedOptionId } = req.body;
    const result = await submitSkillAssessmentUserAnswerService(
      parseInt(id),
      parseInt(questionId),
      parseInt(selectedOptionId)
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// export const updateSkillAssessmentQuestionController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     const result = await updateSkillAssessmentQuestionService({
//       id: parseInt(id),
//       ...req.body,
//     });
//     res.status(200).send(result);
//   } catch (error) {
//     next(error);
//   }
// };
