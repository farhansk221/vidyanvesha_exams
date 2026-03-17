import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ExamTotalMarksAnonymous {
    id?: number;
    exam: number | null;
    student_exam_code: string;
    marks_scored: number | null;
    seat_no: string;
}

export const ExamTotalMarksAnonymousService = {
    async getAll(): Promise<ExamTotalMarksAnonymous[]> {
        const response = await api.get<any>(API_CONTS.EXAM_TOTAL_MARKS_ANONYMOUS.LIST);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<ExamTotalMarksAnonymous> {
        const url = API_CONTS.EXAM_TOTAL_MARKS_ANONYMOUS.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamTotalMarksAnonymous>(url);
        return response.data;
    },

    async create(data: Omit<ExamTotalMarksAnonymous, "id">): Promise<ExamTotalMarksAnonymous> {
        const response = await api.post<ExamTotalMarksAnonymous>(API_CONTS.EXAM_TOTAL_MARKS_ANONYMOUS.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamTotalMarksAnonymous, "id">): Promise<ExamTotalMarksAnonymous> {
        const url = API_CONTS.EXAM_TOTAL_MARKS_ANONYMOUS.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamTotalMarksAnonymous>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_TOTAL_MARKS_ANONYMOUS.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
