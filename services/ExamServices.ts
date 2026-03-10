import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface Exam {
    id?: number;
    exam_session: number | null;
    stud_class: number | null;
    prog: number | null;
    prog_rev: number | null;
    institute_rev: number | null;
    institute_prog: number | null;
    course_sem: number | null;
    course: number | null;
    direct_or_indirect: string;
    exam_category: number | null;
    total_marks: number | null;
    passing_marks: number | null;
    exam_duration: number | null;
    question_wise: boolean;
    pattern: string;
    question_paper_needed: boolean;
    no_of_question_paper_needed: number | null;
    freeze_question_paper_flag: boolean;
    exam_questions_freeze: boolean;
    exam_questions_freeze_dt: string | null;
    exam_date: string;
    exam_question_paper_code: string;
    exam_start_time: string;
    student_approval_needed: boolean;
    freeze_student_list_flag: boolean;
    teaching_staff_assigned: number | null;
    external_staff_assigned: number | null;
    external_staff_manual: string | null;
    grace_marks_flag: boolean;
    grace_marks: number;
    penalty_applicable: boolean;
    keep_marks_anonymous: boolean;
    freeze_marks: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const ExamService = {
    async getAll(): Promise<Exam[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAMS.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exams");
        return response.json();
    },

    async getById(id: number): Promise<Exam> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAMS.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam");
        return response.json();
    },

    async create(data: Omit<Exam, "id">): Promise<Exam> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAMS.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create exam");
        return response.json();
    },

    async update(id: number, data: Omit<Exam, "id">): Promise<Exam> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAMS.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update exam");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAMS.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete exam");
    },
};
