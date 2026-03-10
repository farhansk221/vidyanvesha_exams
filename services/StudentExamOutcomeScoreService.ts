import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface StudentExamOutcomeScore {
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

export const StudentExamOutcomeScoreService = {
    async getAll(): Promise<StudentExamOutcomeScore[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch student exam outcome scores");
        return response.json();
    },

    async getById(id: number): Promise<StudentExamOutcomeScore> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch student exam outcome score");
        return response.json();
    },

    async create(data: Omit<StudentExamOutcomeScore, "id">): Promise<StudentExamOutcomeScore> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create student exam outcome score");
        return response.json();
    },

    async update(id: number, data: Omit<StudentExamOutcomeScore, "id">): Promise<StudentExamOutcomeScore> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update student exam outcome score");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete student exam outcome score");
    },
};
