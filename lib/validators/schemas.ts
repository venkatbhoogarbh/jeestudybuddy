export type AuthMode = "sign-in" | "sign-up";

export type AuthState = {
  error: string | null;
  success: string | null;
};

export type QuizSubject = "Physics" | "Chemistry" | "Mathematics";
export type QuizDifficulty = "Easy" | "Medium" | "Hard";
export type QuizQuestionCount = 5 | 10;

export type GeneratedQuizQuestion = {
  id: number;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
};

export type GeneratedQuiz = {
  title: string;
  subject: QuizSubject;
  topic: string;
  difficulty: QuizDifficulty;
  questions: GeneratedQuizQuestion[];
};

export type PlannerBlockType = "Study" | "Break" | "Revision" | "Practice";
export type PlannerBlockSubject = QuizSubject | "Mixed";

export type PlannerBlock = {
  type: PlannerBlockType;
  subject: PlannerBlockSubject;
  topic: string;
  durationMinutes: number;
  notes: string;
};

export type PlannerSession = {
  day: string;
  blocks: PlannerBlock[];
};

export type GeneratedStudyPlan = {
  title: string;
  examDate: string;
  dailyStudyHours: number;
  sessions: PlannerSession[];
};

export type RevisionTopicPriority = "Weak" | "Needs Practice" | "Strong / Quick Revision";
export type RevisionAction = "Review concept" | "Solve practice questions" | "Take a quiz";

export type RevisionTopic = {
  id: string;
  subject: QuizSubject;
  topic: string;
  priority: RevisionTopicPriority;
  action: RevisionAction;
  status: "pending" | "revised";
};

export type GeneratedRevisionPlan = {
  title: string;
  focusTopics: string[];
  sessions: Array<{
    step: number;
    title: string;
    action: string;
    durationMinutes: number;
    topic: string;
    subject: QuizSubject | "Mixed";
  }>;
};

export function isQuizSubject(value: string): value is QuizSubject {
  return value === "Physics" || value === "Chemistry" || value === "Mathematics";
}

export function isQuizDifficulty(value: string): value is QuizDifficulty {
  return value === "Easy" || value === "Medium" || value === "Hard";
}

export function isQuizQuestionCount(value: number): value is QuizQuestionCount {
  return value === 5 || value === 10;
}

export function parseGeneratedQuiz(rawValue: unknown): GeneratedQuiz {
  if (!rawValue || typeof rawValue !== "object") {
    throw new Error("Quiz response was not an object.");
  }

  const quiz = rawValue as Partial<GeneratedQuiz> & { questions?: unknown };

  if (
    typeof quiz.title !== "string" ||
    !isQuizSubject(String(quiz.subject ?? "")) ||
    typeof quiz.topic !== "string" ||
    !isQuizDifficulty(String(quiz.difficulty ?? "")) ||
    !Array.isArray(quiz.questions)
  ) {
    throw new Error("Quiz response did not match the expected structure.");
  }

  if (quiz.questions.length === 0) {
    throw new Error("Quiz must contain at least one question.");
  }

  const questions = quiz.questions.map((question, index) => {
    if (!question || typeof question !== "object") {
      throw new Error(`Question ${index + 1} is invalid.`);
    }

    const item = question as Partial<GeneratedQuizQuestion> & { options?: unknown };

    if (
      typeof item.id !== "number" ||
      typeof item.question !== "string" ||
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      item.options.some((option) => typeof option !== "string" || !option.trim()) ||
      typeof item.answerIndex !== "number" ||
      !Number.isInteger(item.answerIndex) ||
      item.answerIndex < 0 ||
      item.answerIndex > 3 ||
      typeof item.explanation !== "string"
    ) {
      throw new Error(`Question ${index + 1} does not match the expected format.`);
    }

    return {
      id: item.id,
      question: item.question.trim(),
      options: item.options as [string, string, string, string],
      answerIndex: item.answerIndex,
      explanation: item.explanation.trim(),
    };
  });

  return {
    title: quiz.title.trim(),
    subject: quiz.subject as QuizSubject,
    topic: quiz.topic.trim(),
    difficulty: quiz.difficulty as QuizDifficulty,
    questions,
  };
}

export function parseGeneratedStudyPlan(rawValue: unknown): GeneratedStudyPlan {
  if (!rawValue || typeof rawValue !== "object") {
    throw new Error("Study plan response was not an object.");
  }

  const plan = rawValue as Partial<GeneratedStudyPlan> & { sessions?: unknown };

  if (
    typeof plan.title !== "string" ||
    typeof plan.examDate !== "string" ||
    typeof plan.dailyStudyHours !== "number" ||
    !Array.isArray(plan.sessions) ||
    plan.sessions.length === 0
  ) {
    throw new Error("Study plan response did not match the expected structure.");
  }

  const sessions = plan.sessions.map((session, index) => {
    if (!session || typeof session !== "object") {
      throw new Error(`Session ${index + 1} is invalid.`);
    }

    const sessionItem = session as Partial<PlannerSession> & { blocks?: unknown };

    if (typeof sessionItem.day !== "string" || !Array.isArray(sessionItem.blocks) || sessionItem.blocks.length === 0) {
      throw new Error(`Session ${index + 1} does not match the expected structure.`);
    }

    const blocks = sessionItem.blocks.map((block, blockIndex) => {
      if (!block || typeof block !== "object") {
        throw new Error(`Block ${blockIndex + 1} in session ${index + 1} is invalid.`);
      }

      const blockItem = block as Partial<PlannerBlock>;

      const validSubjects = ["Physics", "Chemistry", "Mathematics", "Mixed"] as const;
      const validTypes = ["Study", "Break", "Revision", "Practice"] as const;

      if (
        !blockItem.type ||
        !validTypes.includes(blockItem.type) ||
        !blockItem.subject ||
        !validSubjects.includes(blockItem.subject) ||
        typeof blockItem.topic !== "string" ||
        typeof blockItem.durationMinutes !== "number" ||
        !Number.isInteger(blockItem.durationMinutes) ||
        blockItem.durationMinutes <= 0 ||
        typeof blockItem.notes !== "string"
      ) {
        throw new Error(`Block ${blockIndex + 1} in session ${index + 1} does not match the expected format.`);
      }

      return {
        type: blockItem.type,
        subject: blockItem.subject,
        topic: blockItem.topic.trim(),
        durationMinutes: blockItem.durationMinutes,
        notes: blockItem.notes.trim(),
      };
    });

    return {
      day: sessionItem.day.trim(),
      blocks,
    };
  });

  return {
    title: plan.title.trim(),
    examDate: plan.examDate.trim(),
    dailyStudyHours: plan.dailyStudyHours,
    sessions,
  };
}

export function parseGeneratedRevisionPlan(rawValue: unknown): GeneratedRevisionPlan {
  if (!rawValue || typeof rawValue !== "object") {
    throw new Error("Revision plan response was not an object.");
  }

  const plan = rawValue as Partial<GeneratedRevisionPlan> & { focusTopics?: unknown; sessions?: unknown };

  if (
    typeof plan.title !== "string" ||
    !Array.isArray(plan.focusTopics) ||
    plan.focusTopics.some((topic) => typeof topic !== "string") ||
    !Array.isArray(plan.sessions) ||
    plan.sessions.length === 0
  ) {
    throw new Error("Revision plan response did not match the expected structure.");
  }

  const sessions = plan.sessions.map((session, index) => {
    if (!session || typeof session !== "object") {
      throw new Error(`Revision session ${index + 1} is invalid.`);
    }

    const item = session as Partial<GeneratedRevisionPlan["sessions"][number]>;
    const validSubjects = ["Physics", "Chemistry", "Mathematics", "Mixed"] as const;

    if (
      typeof item.step !== "number" ||
      !Number.isInteger(item.step) ||
      typeof item.title !== "string" ||
      typeof item.action !== "string" ||
      typeof item.durationMinutes !== "number" ||
      !Number.isInteger(item.durationMinutes) ||
      item.durationMinutes <= 0 ||
      typeof item.topic !== "string" ||
      !item.subject ||
      !validSubjects.includes(item.subject)
    ) {
      throw new Error(`Revision session ${index + 1} does not match the expected format.`);
    }

    return {
      step: item.step,
      title: item.title.trim(),
      action: item.action.trim(),
      durationMinutes: item.durationMinutes,
      topic: item.topic.trim(),
      subject: item.subject,
    };
  });

  return {
    title: plan.title.trim(),
    focusTopics: plan.focusTopics.map((topic) => topic.trim()).filter(Boolean),
    sessions,
  };
}
