import api from "@/config/axios";

export interface Student {
    id: number;
    stud_first_name?: string;
    stud_last_name?: string;
    enrollment_no?: string;
    [key: string]: any;
}

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CORE || "http://localhost:8001";

export const StudentService = {
    async getAll(): Promise<Student[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/students/`);
        const data = response.data;
        return data.results ? data.results : data;
    },

    async getById(id: number): Promise<Student> {
        const response = await api.get<Student>(`${CORE_BASE_URL}/students/${id}/`);
        return response.data;
    }
};
