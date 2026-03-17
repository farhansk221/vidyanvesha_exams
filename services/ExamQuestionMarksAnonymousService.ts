import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ExamQuestionMarksAnonymous {
    id?: number;
    exam_question: number | null;
    student_exam_code: string;
    marks_scored: number | null;
    seat_no: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api";

export const ExamQuestionMarksAnonymousService = {
    async getAll(): Promise<ExamQuestionMarksAnonymous[]> {
        const response = await api.get<any>(`${BASE_URL}${API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.LIST}`);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<ExamQuestionMarksAnonymous> {
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamQuestionMarksAnonymous>(`${BASE_URL}${url}`);
        return response.data;
    },

    async create(data: Omit<ExamQuestionMarksAnonymous, "id">): Promise<ExamQuestionMarksAnonymous> {
        const response = await api.post<ExamQuestionMarksAnonymous>(`${BASE_URL}${API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.CREATE}`, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamQuestionMarksAnonymous, "id">): Promise<ExamQuestionMarksAnonymous> {
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamQuestionMarksAnonymous>(`${BASE_URL}${url}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.DELETE.replace(":id", String(id));
        await api.delete(`${BASE_URL}${url}`);
    },
};
