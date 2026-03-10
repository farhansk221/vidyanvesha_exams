import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface ExamQuestionPaper {
    id?: number;
    exam: number | null;
    question_paper: number | null;
    paper_selected_for_exam: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const ExamQuestionPaperService = {
    async getAll(): Promise<ExamQuestionPaper[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_QUESTION_PAPER.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam question papers");
        return response.json();
    },

    async getById(id: number): Promise<ExamQuestionPaper> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTION_PAPER.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam question paper");
        return response.json();
    },

    async create(data: Omit<ExamQuestionPaper, "id">): Promise<ExamQuestionPaper> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_QUESTION_PAPER.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create exam question paper");
        return response.json();
    },

    async update(id: number, data: Omit<ExamQuestionPaper, "id">): Promise<ExamQuestionPaper> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTION_PAPER.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update exam question paper");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTION_PAPER.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete exam question paper");
    },
};
