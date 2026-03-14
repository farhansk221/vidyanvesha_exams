import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface ExamQuestionPaper {
    id?: number;
    exam: number | null;
    question_paper: number | null;
    paper_selected_for_exam: boolean;
}

export const ExamQuestionPaperService = {
    async getAll(): Promise<ExamQuestionPaper[]> {
        const response = await api.get<ExamQuestionPaper[]>(API_CONTS.EXAM_QUESTION_PAPER.LIST);
        return response.data;
    },

    async getById(id: number): Promise<ExamQuestionPaper> {
        const url = API_CONTS.EXAM_QUESTION_PAPER.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamQuestionPaper>(url);
        return response.data;
    },

    async create(data: Omit<ExamQuestionPaper, "id">): Promise<ExamQuestionPaper> {
        const response = await api.post<ExamQuestionPaper>(API_CONTS.EXAM_QUESTION_PAPER.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamQuestionPaper, "id">): Promise<ExamQuestionPaper> {
        const url = API_CONTS.EXAM_QUESTION_PAPER.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamQuestionPaper>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_QUESTION_PAPER.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
