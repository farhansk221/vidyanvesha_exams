import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ExamQuestionMarksAnonymous {
    id?: number;
    exam_question: number | null;
    student_exam_code: string;
    marks_scored: number | null;
    seat_no: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const ExamQuestionMarksAnonymousService = {
    async getAll(): Promise<PaginatedResponse<ExamQuestionMarksAnonymous>> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch anonymous exam question marks");
        return response.json();
    },

    async getById(id: number): Promise<ExamQuestionMarksAnonymous> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch anonymous exam question mark");
        return response.json();
    },

    async create(data: Omit<ExamQuestionMarksAnonymous, "id">): Promise<ExamQuestionMarksAnonymous> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create anonymous exam question mark");
        return response.json();
    },

    async update(id: number, data: Omit<ExamQuestionMarksAnonymous, "id">): Promise<ExamQuestionMarksAnonymous> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update anonymous exam question mark");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_QUESTION_MARKS_ANONYMOUS.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete anonymous exam question mark");
    },
};
