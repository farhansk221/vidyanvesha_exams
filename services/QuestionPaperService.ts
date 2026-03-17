import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface QuestionPaper {
    id?: number;
    qp_name: string;
    qp_code: string;
    qp_desc: string;
    qp_pattern: string;
    qp_total_marks: number | null;
    qp_passing_marks: number | null;
    is_final: boolean;
    qp_pdf: string | null;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const QuestionPaperService = {
    async getAll(): Promise<QuestionPaper[]> {
        const response = await api.get<any>(API_CONTS.QUESTION_PAPERS.LIST);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<QuestionPaper> {
        const url = API_CONTS.QUESTION_PAPERS.DETAILS.replace(":id", String(id));
        const response = await api.get<QuestionPaper>(url);
        return response.data;
    },

    async create(data: Omit<QuestionPaper, "id">): Promise<QuestionPaper> {
        const response = await api.post<QuestionPaper>(API_CONTS.QUESTION_PAPERS.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<QuestionPaper, "id">): Promise<QuestionPaper> {
        const url = API_CONTS.QUESTION_PAPERS.UPDATE.replace(":id", String(id));
        const response = await api.put<QuestionPaper>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.QUESTION_PAPERS.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
