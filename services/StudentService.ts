import { firebaseService } from "@/lib/firebaseService";

export interface Student {
    id: number;
    stud_first_name?: string;
    stud_last_name?: string;
    enrollment_no?: string;
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

export const StudentService = {
    async getAll(): Promise<Student[]> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${CORE_BASE_URL}/students/`, { headers });
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        return data.results ? data.results : data;
    },

    async getById(id: number): Promise<Student> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${CORE_BASE_URL}/students/${id}/`, { headers });
        if (!response.ok) throw new Error("Failed to fetch student");
        return response.json();
    }
};
