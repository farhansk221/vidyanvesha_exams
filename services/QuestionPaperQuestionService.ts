import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface QuestionPaperQuestion {
    id?: number;
    question_paper: number | null;
    question: number | null;
    question_label: string;
    question_sequence: number | null;
    max_marks: number | null;
}

export const QuestionPaperQuestionService = {
    async getAll(): Promise<QuestionPaperQuestion[]> {
        const response = await api.get<QuestionPaperQuestion[]>(API_CONTS.QUESTION_PAPER_QUESTIONS.LIST);
        return response.data;
    },

    async getById(id: number): Promise<QuestionPaperQuestion> {
        const url = API_CONTS.QUESTION_PAPER_QUESTIONS.DETAILS.replace(":id", String(id));
        const response = await api.get<QuestionPaperQuestion>(url);
        return response.data;
    },

    async create(data: Omit<QuestionPaperQuestion, "id">): Promise<QuestionPaperQuestion> {
        const response = await api.post<QuestionPaperQuestion>(API_CONTS.QUESTION_PAPER_QUESTIONS.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<QuestionPaperQuestion, "id">): Promise<QuestionPaperQuestion> {
        const url = API_CONTS.QUESTION_PAPER_QUESTIONS.UPDATE.replace(":id", String(id));
        const response = await api.put<QuestionPaperQuestion>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.QUESTION_PAPER_QUESTIONS.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
