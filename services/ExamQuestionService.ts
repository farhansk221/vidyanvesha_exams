import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface ExamQuestion {
    id?: number;
    exam: number | null;
    question: number | null;
    question_label: string;
    question_sequence: number | null;
    max_marks: number | null;
    marking_synoptic: string;
    students_attempted_count: number;
    students_above_cutoff_count: number;
    percentage_of_students_above_cutoff: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const ExamQuestionService = {
    async getAll(): Promise<ExamQuestion[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_QUESTIONS.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam questions");
        return response.json();
    },

    async getById(id: number): Promise<ExamQuestion> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTIONS.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam question");
        return response.json();
    },

    async create(data: Omit<ExamQuestion, "id">): Promise<ExamQuestion> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_QUESTIONS.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create exam question");
        return response.json();
    },

    async update(id: number, data: Omit<ExamQuestion, "id">): Promise<ExamQuestion> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTIONS.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update exam question");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTIONS.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete exam question");
    },
};
