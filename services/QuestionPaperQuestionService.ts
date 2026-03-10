import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface QuestionPaperQuestion {
    id?: number;
    question_paper: number | null;
    question: number | null;
    question_label: string;
    question_sequence: number | null;
    max_marks: number | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const QuestionPaperQuestionService = {
    async getAll(): Promise<QuestionPaperQuestion[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.QUESTION_PAPER_QUESTIONS.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch question paper questions");
        return response.json();
    },

    async getById(id: number): Promise<QuestionPaperQuestion> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.QUESTION_PAPER_QUESTIONS.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch question paper question");
        return response.json();
    },

    async create(data: Omit<QuestionPaperQuestion, "id">): Promise<QuestionPaperQuestion> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.QUESTION_PAPER_QUESTIONS.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create question paper question");
        return response.json();
    },

    async update(id: number, data: Omit<QuestionPaperQuestion, "id">): Promise<QuestionPaperQuestion> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.QUESTION_PAPER_QUESTIONS.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update question paper question");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.QUESTION_PAPER_QUESTIONS.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete question paper question");
    },
};
