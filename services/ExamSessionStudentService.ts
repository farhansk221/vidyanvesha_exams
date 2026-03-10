import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface ExamSessionStudent {
    id?: number;
    exam_session: number | null;
    student: number | null;
    program: number | null;
    semester: number | null;
    approval_status: string;
    exam_fees_asked_to_pay: number | null;
    exam_fees_paid: number | null;
    exam_form_submitted: boolean;
    seat_no: string | null;
    hold_result: boolean;
    student_council_benefit: boolean;
    condonation_applied: boolean;
    condonation_course: number | null;
    condonation_exam_category: number | null;
    condonation_marks: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const ExamSessionStudentService = {
    async getAll(): Promise<ExamSessionStudent[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_SESSION_STUDENT.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam session students");
        return response.json();
    },

    async getById(id: number): Promise<ExamSessionStudent> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_SESSION_STUDENT.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam session student");
        return response.json();
    },

    async create(data: Omit<ExamSessionStudent, "id">): Promise<ExamSessionStudent> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_SESSION_STUDENT.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create exam session student");
        return response.json();
    },

    async update(id: number, data: Omit<ExamSessionStudent, "id">): Promise<ExamSessionStudent> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_SESSION_STUDENT.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update exam session student");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_SESSION_STUDENT.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete exam session student");
    },
};
