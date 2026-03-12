import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const StudentExamQuestionMarkService = {
    async getAll(): Promise<PaginatedResponse<StudentExamQuestionMark>> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.STUDENT_EXAM_QUESTION_MARKS.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch student exam question marks");
        return response.json();
    },

    async getById(id: number): Promise<StudentExamQuestionMark> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_QUESTION_MARKS.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch student exam question mark");
        return response.json();
    },

    async create(data: Omit<StudentExamQuestionMark, "id">): Promise<StudentExamQuestionMark> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.STUDENT_EXAM_QUESTION_MARKS.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create student exam question mark");
        return response.json();
    },

    async update(id: number, data: Omit<StudentExamQuestionMark, "id">): Promise<StudentExamQuestionMark> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_QUESTION_MARKS.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update student exam question mark");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.STUDENT_EXAM_QUESTION_MARKS.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete student exam question mark");
    },
};
