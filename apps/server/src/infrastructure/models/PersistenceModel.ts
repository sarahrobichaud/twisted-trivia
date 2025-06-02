export interface QuizPersistenceModel {
    id: string;
    title: string;
    description: string;
    questions: QuestionPersistenceModel[];
}

export interface AnswerPersistenceModel {
    id: string;
    questionId: string;
    isCorrect: boolean;
    content: string;
}

export interface QuestionPersistenceModel {
    id: string;
    quizId: string;
    content: string;
    point: number;
    timeLimitSeconds: number;
    choices: AnswerPersistenceModel[];
}
