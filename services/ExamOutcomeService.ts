import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface ExamOutcome {
    id?: number;
    exam: number | null;
    course_outcome: number | null;
    weightage: number | null;
    percentage_of_students_above_cutoff: number | null;
    target_percentage: number | null;
    gap_percentage: number | null;
    attainment_level_achieved: number | null;
}

export const ExamOutcomeService = {
    async getAll(): Promise<ExamOutcome[]> {
        const response = await api.get<any>(API_CONTS.EXAM_OUTCOMES.LIST);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<ExamOutcome> {
        const url = API_CONTS.EXAM_OUTCOMES.DETAILS.replace(":id", String(id));
        const response = await api.get<ExamOutcome>(url);
        return response.data;
    },

    async create(data: Omit<ExamOutcome, "id">): Promise<ExamOutcome> {
        const response = await api.post<ExamOutcome>(API_CONTS.EXAM_OUTCOMES.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<ExamOutcome, "id">): Promise<ExamOutcome> {
        const url = API_CONTS.EXAM_OUTCOMES.UPDATE.replace(":id", String(id));
        const response = await api.put<ExamOutcome>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.EXAM_OUTCOMES.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
