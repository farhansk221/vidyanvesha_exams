import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Question {
    id: number;
    question_desc?: string;
    course?: number;
    course_name?: string;
    bl_level?: number;
    bl_level_display?: string;
    question_type?: number;
    question_type_name?: string;
    [key: string]: any;
}

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

const sanitizeData = (data: any): any => {
    const allowedFields = [
        "exam", "question", "question_label", "question_sequence", 
        "max_marks", "marking_synoptic", "students_attempted_count", 
        "students_above_cutoff_count", "percentage_of_students_above_cutoff"
    ];
    const cleaned: any = {};
    allowedFields.forEach(field => {
        if (field in data) {
            cleaned[field] = data[field];
        }
    });
    return cleaned;
};

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CORE || "http://localhost:8001/api";

export const ExamQuestionService = {
    async getAll(): Promise<ExamQuestion[]> {
        const response = await api.get<any>(API_CONTS.EXAM_QUESTIONS.LIST);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<ExamQuestion> {
        const url = API_CONTS.EXAM_QUESTIONS.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamQuestion>(url);
        return response.data;
    },

    async create(data: Omit<ExamQuestion, "id">): Promise<ExamQuestion> {
        const cleanedData = sanitizeData(data);
        const response = await api.post<ExamQuestion>(API_CONTS.EXAM_QUESTIONS.CREATE, cleanedData);
        return response.data;
    },

    async update(id: number, data: Omit<ExamQuestion, "id">): Promise<ExamQuestion> {
        const cleanedData = sanitizeData(data);
        const url = API_CONTS.EXAM_QUESTIONS.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamQuestion>(url, cleanedData);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_QUESTIONS.DELETE.replace(":id", String(id));
        await api.delete(url);
    },

    async getQuestions(): Promise<Question[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/questions/`);
        const data = response.data;
        return data.results ? data.results : data;
    }
};
