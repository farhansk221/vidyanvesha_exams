import { API_CONTS } from "@/lib/api";
import api from "@/config/axios";

export interface StudentExamQuestionOutcomeScore {
    id?: number;
    exam_question_outcome: number | null;
    student: number | null;
    score: number | null;
    out_of: number | null;
}

export const StudentExamQuestionOutcomeScoreService = {
    async getAll(): Promise<StudentExamQuestionOutcomeScore[]> {
        const response = await api.get<any>(API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.LIST);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<StudentExamQuestionOutcomeScore> {
        const url = API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.DETAILS.replace(":id", String(id));
        const response = await api.get<StudentExamQuestionOutcomeScore>(url);
        return response.data;
    },

    async create(data: Omit<StudentExamQuestionOutcomeScore, "id">): Promise<StudentExamQuestionOutcomeScore> {
        const response = await api.post<StudentExamQuestionOutcomeScore>(API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.CREATE, data);
        return response.data;
    },

    async update(id: number, data: Omit<StudentExamQuestionOutcomeScore, "id">): Promise<StudentExamQuestionOutcomeScore> {
        const url = API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.UPDATE.replace(":id", String(id));
        const response = await api.put<StudentExamQuestionOutcomeScore>(url, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        const url = API_CONTS.STUDENT_EXAM_QUESTION_OUTCOMES_SCORE.DELETE.replace(":id", String(id));
        await api.delete(url);
    },
};
