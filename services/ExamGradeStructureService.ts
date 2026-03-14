import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

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

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CORE || "http://localhost:8001";

export const ExamGradeStructureService = {
    async getAll(): Promise<ExamGradeStructure[]> {
        const response = await api.get<ExamGradeStructure[]>(API_CONTS.EXAM_GRADE_STRUCTURE.LIST);
        return response.data;
    },

    async getById(id: number): Promise<ExamGradeStructure> {
        const url = API_CONTS.EXAM_GRADE_STRUCTURE.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamGradeStructure>(url);
        return response.data;
    },

    async create(data: Omit<ExamGradeStructure, "id">): Promise<ExamGradeStructure> {
        const response = await api.post<ExamGradeStructure>(API_CONTS.EXAM_GRADE_STRUCTURE.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamGradeStructure, "id">): Promise<ExamGradeStructure> {
        const url = API_CONTS.EXAM_GRADE_STRUCTURE.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamGradeStructure>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_GRADE_STRUCTURE.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
    
    async getPrograms(): Promise<Program[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/programs/`);
        const data = response.data;
        return data.results ? data.results : data;
    }
};
