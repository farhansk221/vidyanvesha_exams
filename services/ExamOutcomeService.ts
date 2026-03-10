import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface ExamOutcome {
    id?: number;
    exam_question_outcome: number | null;
    student: number | null;
    score: number | null;
    out_of: number | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const ExamOutcomeService = {
    async getAll(): Promise<ExamOutcome[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_OUTCOMES.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam outcomes");
        return response.json();
    },

    async getById(id: number): Promise<ExamOutcome> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_OUTCOMES.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam outcome");
        return response.json();
    },

    async create(data: Omit<ExamOutcome, "id">): Promise<ExamOutcome> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_OUTCOMES.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create exam outcome");
        return response.json();
    },

    async update(id: number, data: Omit<ExamOutcome, "id">): Promise<ExamOutcome> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_OUTCOMES.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update exam outcome");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_OUTCOMES.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete exam outcome");
    },
};
