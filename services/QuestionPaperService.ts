import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const QuestionPaperService = {
    async getAll(): Promise<PaginatedResponse<QuestionPaper>> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.QUESTION_PAPERS.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch question papers");
        return response.json();
    },

    async getById(id: number): Promise<QuestionPaper> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.QUESTION_PAPERS.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch question paper");
        return response.json();
    },

    async create(data: Omit<QuestionPaper, "id">): Promise<QuestionPaper> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.QUESTION_PAPERS.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create question paper");
        return response.json();
    },

    async update(id: number, data: Omit<QuestionPaper, "id">): Promise<QuestionPaper> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.QUESTION_PAPERS.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update question paper");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.QUESTION_PAPERS.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete question paper");
    },
};
