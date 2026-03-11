import { API_CONTS } from "@/lib/api";
import { firebaseService } from "@/lib/firebaseService";

export interface ExamGradeStructure {
    id?: number;
    min_marks: number | null;
    max_marks: number | null;
    grade: string;
    grade_point: number | null;
    passing_grade_flag: boolean;
    failing_grade_flag: boolean;
    description: string;
    program: number | null;
}

export interface Program {
    id: number;
    prog_name: string;
    prog_duration: string;
    prog_desc: string;
    prog_inst_prog: number | null;
    prog_inst_type: number | null;
    prog_department: number | null;
    prog_hall_ticket_abbr: string | null;
    base_program: boolean;
    institute: number | null;
    university: number | null;
    [key: string]: any;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    console.log(token)
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const ExamGradeStructureService = {
    async getAll(): Promise<ExamGradeStructure[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_GRADE_STRUCTURE.LIST}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam grade structures");
        return response.json();
    },

    async getById(id: number): Promise<ExamGradeStructure> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_GRADE_STRUCTURE.DETAILS.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch exam grade structure");
        return response.json();
    },

    async create(data: Omit<ExamGradeStructure, "id">): Promise<ExamGradeStructure> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}${API_CONTS.EXAM_GRADE_STRUCTURE.CREATE}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create exam grade structure");
        return response.json();
    },

    async update(id: number, data: Omit<ExamGradeStructure, "id">): Promise<ExamGradeStructure> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_GRADE_STRUCTURE.UPDATE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update exam grade structure");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const headers = await getAuthHeaders();
        const url = API_CONTS.EXAM_GRADE_STRUCTURE.DELETE.replace(":id", String(id));
        const response = await fetch(`${BASE_URL}${url}`, { method: "DELETE", headers });
        if (!response.ok) throw new Error("Failed to delete exam grade structure");
    },
    
    async getPrograms(): Promise<Program[]> {
        const headers = await getAuthHeaders();
        const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CORE || "http://localhost:8001";
        const response = await fetch(`${CORE_BASE_URL}/programs/`, { headers });
        if (!response.ok) throw new Error("Failed to fetch programs");
        const data = await response.json();
        return data.results ? data.results : data;
    }
};
