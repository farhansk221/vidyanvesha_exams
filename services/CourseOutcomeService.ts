import { firebaseService } from "@/lib/firebaseService";

export interface CourseOutcome {
    id?: number;
    course: number | null;
    outcome_code: string;
    outcome_description: string;
    [key: string]: any;
}

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CORE || "http://localhost:8001";

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await firebaseService.getUserAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const CourseOutcomeService = {
    async getAll(): Promise<CourseOutcome[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${CORE_BASE_URL}/course-outcomes/`, { headers });
        if (!response.ok) throw new Error("Failed to fetch course outcomes");
        const data = await response.json();
        return Array.isArray(data) ? data : data.results || [];
    },

    async getById(id: number): Promise<CourseOutcome> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${CORE_BASE_URL}/course-outcomes/${id}/`, { headers });
        if (!response.ok) throw new Error("Failed to fetch course outcome");
        return response.json();
    },
};
