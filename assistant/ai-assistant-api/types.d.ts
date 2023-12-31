type YpInterviewQuestionType = "simple" | "reflectOnBackgroundData";

interface YpInterviewAnswer {
  answerParts: string[];
  answerData: object;
}

interface YpInterview {
  id: string;
  interviweeName: string;
  intervieweeEmail: string;
  intervieweeBackround: string;
  intervieweeCompany?: string;
  intervieweeRole?: string;
  intervieweeLocation?: string;
  date: string;
  interviewBotId: string;
  answers: YpInterviewAnswer[];
}

interface YpInterviewQuestion {
  systemPrompt?: string;
  questionType: YpInterviewQuestionType;
  question: string;
  questionData?: object;
}

interface YpInterviewBot {
  id: string;
  systemPrompt: string;
  questions: YpInterviewQuestion[];
}
