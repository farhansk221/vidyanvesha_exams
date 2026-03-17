import api from "@/config/axios";

export interface Student {
    id: number;
    stud_first_name?: string;
    stud_last_name?: string;
    enrollment_no?: string;
    [key: string]: any;
}

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const StudentService = {
    async getAll(): Promise<Student[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/student-exam-question-marks/`);
        const data = response.data;
        return data.results ? data.results : data;
    },

    async getById(id: number): Promise<Student> {
        const response = await api.get<Student>(`${CORE_BASE_URL}/student-exam-question-marks/${id}/`);
        return response.data;
    }
};
