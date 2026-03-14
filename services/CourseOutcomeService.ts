import api from "@/config/axios";

export interface CourseOutcome {
    id?: number;
    course: number | null;
    outcome_code: string;
    outcome_description: string;
    [key: string]: any;
}

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CORE || "http://localhost:8001";

export const CourseOutcomeService = {
    async getAll(): Promise<CourseOutcome[]> {
        const response = await api.get<any>(`${CORE_BASE_URL}/course-outcomes/`);
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<CourseOutcome> {
        const response = await api.get<CourseOutcome>(`${CORE_BASE_URL}/course-outcomes/${id}/`);
        return response.data;
    },
};
