import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface ExamSession {
    id?: number;
    exam_session_name: string;
    exam_session_held_in: string;
    exam_session_start_date: string;
    exam_session_end_date: string;
    exam_session_regular: boolean;
    exam_session_collect_exam_fees: boolean;
    exam_session_exam_form_released?: boolean;
    exam_session_exam_form_released_dt?: string | null;
    exam_session_exam_form_submission_dt?: string | null;
    academic_session_id?: number | null;
    automatic_exam_generated?: boolean;
    exam_seat_no_generated?: boolean;
    exam_seat_no_generated_dt?: string | null;
    exam_seat_no_has_to_be_borrowed?: boolean;
    exam_seat_no_to_be_borrowed_from_id?: number | null;
    hallticket_year_or_other_notation?: string;
    hallticket_generated?: boolean;
    hallticket_generated_dt?: string | null;
    hallticket_released?: boolean;
    hallticket_released_dt?: string | null;
    grade_penalty?: boolean;
    grade_penalty_level?: number | null;
    freeze_marks?: boolean;
    freeze_marks_dt?: string | null;
    exam_year_difference_allowed?: number | null;
    release_student_results?: boolean;
    institute_id?: number | null;
    university_id?: number | null;
    created_by?: number | null;
    updated_by?: number | null;
    created_dt?: string;
    updated_dt?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface AcademicSession {
    id: number;
    session_name?: string;
    academic_session_name?: string;
    name?: string;
    [key: string]: any;
}

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CORE || "http://localhost:8001";

export const ExamSessionService = {
    async getAll(): Promise<PaginatedResponse<ExamSession>> {
        const response = await api.get<PaginatedResponse<ExamSession>>(API_CONTS.EXAM_SESSIONS.LIST);
        return response.data;
    },

    async getById(id: number): Promise<ExamSession> {
        const url = API_CONTS.EXAM_SESSIONS.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamSession>(url);
        return response.data;
    },

    async create(data: Omit<ExamSession, "id">): Promise<ExamSession> {
        const response = await api.post<ExamSession>(API_CONTS.EXAM_SESSIONS.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamSession, "id">): Promise<ExamSession> {
        const url = API_CONTS.EXAM_SESSIONS.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamSession>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_SESSIONS.DELETE.replace(":id", String(id));
        await api.delete(url);
    },

    async getAcademicSessions(): Promise<AcademicSession[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/academic-sessions/`);
        const data = response.data;
        return data.results ? data.results : data;
    }
};
