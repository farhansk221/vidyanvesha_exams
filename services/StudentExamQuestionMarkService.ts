import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface StudentExamQuestionMark {
    id?: number;
    exam_question: number | null;
    student: number | null;
    marks_scored: number | null;
}

export const StudentExamQuestionMarkService = {
    async getAll(): Promise<PaginatedResponse<StudentExamQuestionMark>> {
        const response = await api.get<PaginatedResponse<StudentExamQuestionMark>>(API_CONTS.STUDENT_EXAM_QUESTION_MARKS.LIST);
        return response.data;
    },

    async getById(id: number): Promise<StudentExamQuestionMark> {
        const url = API_CONTS.STUDENT_EXAM_QUESTION_MARKS.DETAILS.replace(":id", String(id));
        const response = await api.get<StudentExamQuestionMark>(url);
        return response.data;
    },

    async create(data: Omit<StudentExamQuestionMark, "id">): Promise<StudentExamQuestionMark> {
        const response = await api.post<StudentExamQuestionMark>(API_CONTS.STUDENT_EXAM_QUESTION_MARKS.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<StudentExamQuestionMark, "id">): Promise<StudentExamQuestionMark> {
        const url = API_CONTS.STUDENT_EXAM_QUESTION_MARKS.UPDATE.replace(":id", String(id));
        const response = await api.put<StudentExamQuestionMark>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.STUDENT_EXAM_QUESTION_MARKS.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
