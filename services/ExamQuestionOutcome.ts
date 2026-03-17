import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ExamQuestionOutcome {
    id?: number;
    exam_question: number | null;
    outcome: number | null;
    weightage: number | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api";

export const ExamQuestionOutcomeService = {
    async getAll(): Promise<ExamQuestionOutcome[]> {
        const response = await api.get<any>(`${BASE_URL}${API_CONTS.EXAM_QUESTION_OUTCOMES.LIST}`);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<ExamQuestionOutcome> {
        const url = API_CONTS.EXAM_QUESTION_OUTCOMES.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamQuestionOutcome>(`${BASE_URL}${url}`);
        return response.data;
    },

    async create(data: Omit<ExamQuestionOutcome, "id">): Promise<ExamQuestionOutcome> {
        const response = await api.post<ExamQuestionOutcome>(`${BASE_URL}${API_CONTS.EXAM_QUESTION_OUTCOMES.CREATE}`, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamQuestionOutcome, "id">): Promise<ExamQuestionOutcome> {
        const url = API_CONTS.EXAM_QUESTION_OUTCOMES.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamQuestionOutcome>(`${BASE_URL}${url}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_QUESTION_OUTCOMES.DELETE.replace(":id", String(id));
        await api.delete(`${BASE_URL}${url}`);
    },
};
