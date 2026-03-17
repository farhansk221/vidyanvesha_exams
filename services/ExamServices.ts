import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Program {
    id: number;
    prog_name?: string;
    [key: string]: any;
}

export interface ProgramRevision {
    id: number;
    prog_rev_name?: string;
    [key: string]: any;
}

export interface Course {
    id: number;
    course_name?: string;
    course_code?: string;
    [key: string]: any;
}

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api";
const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CORE || "http://localhost:8001/api";

export const ExamService = {
    async getAll(): Promise<Exam[]> {
        const response = await api.get<any>(`${BASE_URL}${API_CONTS.EXAMS.LIST}`);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<Exam> {
        const url = API_CONTS.EXAMS.DETAILS.replace(":id", String(id));
        const response = await api.get<Exam>(`${BASE_URL}${url}`);
        return response.data;
    },

    async create(data: Omit<Exam, "id">): Promise<Exam> {
        const response = await api.post<Exam>(`${BASE_URL}${API_CONTS.EXAMS.CREATE}`, data);
        return response.data;
    },

    async update(id: number, data: Omit<Exam, "id">): Promise<Exam> {
        const url = API_CONTS.EXAMS.UPDATE.replace(":id", String(id));
        const response = await api.put<Exam>(`${BASE_URL}${url}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAMS.DELETE.replace(":id", String(id));
        await api.delete(`${BASE_URL}${url}`);
    },

    async getPrograms(): Promise<Program[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/programs/`);
        const data = response.data;
        return data.results ? data.results : data;
    },

    async getProgramRevisions(): Promise<ProgramRevision[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/program-revisions/`);
        const data = response.data;
        return data.results ? data.results : data;
    },

    async getCourses(): Promise<Course[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/courses/`);
        const data = response.data;
        return data.results ? data.results : data;
    }
};
