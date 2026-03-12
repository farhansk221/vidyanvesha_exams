import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface StudentExamQuestionOutcomeScore {
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

export const StudentExamQuestionOutcomeScoreService = {
    async getAll(): Promise<StudentExamQuestionOutcomeScore[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch student exam question outcome scores");
        const data = await response.json();
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<StudentExamQuestionOutcomeScore> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch student exam question outcome score");
        return response.json();
    },

    async create(data: Omit<StudentExamQuestionOutcomeScore, "id">): Promise<StudentExamQuestionOutcomeScore> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create student exam question outcome score");
        return response.json();
    },

    async update(id: number, data: Omit<StudentExamQuestionOutcomeScore, "id">): Promise<StudentExamQuestionOutcomeScore> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update student exam question outcome score");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete student exam question outcome score");
    },
};
