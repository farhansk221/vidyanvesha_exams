import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

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

export const ExamSessionStudentService = {
    async getAll(): Promise<ExamSessionStudent[]> {
        const response = await api.get<ExamSessionStudent[]>(API_CONTS.EXAM_SESSION_STUDENT.LIST);
        return response.data;
    },

    async getById(id: number): Promise<ExamSessionStudent> {
        const url = API_CONTS.EXAM_SESSION_STUDENT.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamSessionStudent>(url);
        return response.data;
    },

    async create(data: Omit<ExamSessionStudent, "id">): Promise<ExamSessionStudent> {
        const response = await api.post<ExamSessionStudent>(API_CONTS.EXAM_SESSION_STUDENT.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamSessionStudent, "id">): Promise<ExamSessionStudent> {
        const url = API_CONTS.EXAM_SESSION_STUDENT.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamSessionStudent>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_SESSION_STUDENT.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
