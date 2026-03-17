import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface StudentExamOutcomeScore {
    id?: number;
    exam_question_outcome: number | null;
    student: number | null;
    score: number | null;
    out_of: number | null;
}

export const StudentExamOutcomeScoreService = {
    async getAll(): Promise<StudentExamOutcomeScore[]> {
        const response = await api.get<any>(API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.LIST);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<StudentExamOutcomeScore> {
        const url = API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.DETAILS.replace(":id", String(id));
        const response = await api.get<StudentExamOutcomeScore>(url);
        return response.data;
    },

    async create(data: Omit<StudentExamOutcomeScore, "id">): Promise<StudentExamOutcomeScore> {
        const response = await api.post<StudentExamOutcomeScore>(API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<StudentExamOutcomeScore, "id">): Promise<StudentExamOutcomeScore> {
        const url = API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.UPDATE.replace(":id", String(id));
        const response = await api.put<StudentExamOutcomeScore>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.STUDENT_EXAM_OUTCOME_SCORE.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
