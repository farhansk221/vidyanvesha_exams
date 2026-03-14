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

export const ExamQuestionMarksAnonymousService = {
    async getAll(): Promise<PaginatedResponse<ExamQuestionMarksAnonymous>> {
        const response = await api.get<PaginatedResponse<ExamQuestionMarksAnonymous>>(API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.LIST);
        return response.data;
    },

    async getById(id: number): Promise<ExamQuestionMarksAnonymous> {
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamQuestionMarksAnonymous>(url);
        return response.data;
    },

    async create(data: Omit<ExamQuestionMarksAnonymous, "id">): Promise<ExamQuestionMarksAnonymous> {
        const response = await api.post<ExamQuestionMarksAnonymous>(API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamQuestionMarksAnonymous, "id">): Promise<ExamQuestionMarksAnonymous> {
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamQuestionMarksAnonymous>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
