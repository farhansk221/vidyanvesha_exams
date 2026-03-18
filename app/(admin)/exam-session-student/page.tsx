"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Eye, Pencil, Trash, Filter, X, Users, MoreVertical } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExamSessionStudentService, type ExamSessionStudent } from "@/services/ExamSessionStudentService";
import { StudentService, type Student } from "@/services/StudentService";
import { ExamService, type Exam } from "@/services/ExamServices";
import { ExamSessionService } from "@/services/ExamSessionServices";

function ExamSessionStudentContent() {
    const [sessionStudents, setSessionStudents] = useState<ExamSessionStudent[]>([]);
    const [studentsMap, setStudentsMap] = useState<Record<number, string>>({});
    const [sessionsMap, setSessionsMap] = useState<Record<number, string>>({});
    const [examsMap, setExamsMap] = useState<Record<number, Exam>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionIdFilter = searchParams.get("sessionId");
    const examIdFilter = searchParams.get("examId");

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [sessionStudentsData, studentsData, sessionsData, examsData] = await Promise.all([
                ExamSessionStudentService.getAll(),
                StudentService.getAll().catch(() => []),
                ExamSessionService.getAll().catch(() => []),
                ExamService.getAll().catch(() => [])
            ]);

            setSessionStudents(Array.isArray(sessionStudentsData) ? sessionStudentsData : (sessionStudentsData as any)?.results || []);

            const studMap: Record<number, string> = {};
            studentsData.forEach((s: Student) => {
                studMap[s.id] = `${s.stud_first_name || ""} ${s.stud_last_name || ""}`.trim() || `Student ${s.id}`;
            });
            setStudentsMap(studMap);

            const sessMap: Record<number, string> = {};
            (sessionsData || []).forEach((s: any) => {
                sessMap[s.id] = s.exam_session_name || `Session ${s.id}`;
            });
            setSessionsMap(sessMap);

            const eMap: Record<number, Exam> = {};
            (examsData || []).forEach((e: Exam) => {
                if (e.id) eMap[e.id] = e;
            });
            setExamsMap(eMap);

        } catch (err) {
            console.error("Failed to fetch session students:", err);
            setError("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to remove this student from the session?")) return;
        try {
            await ExamSessionStudentService.delete(id);
            toast.success("Student removed successfully");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove student");
        }
    };

    const filteredStudents = sessionStudents.filter(ss => {
        if (examIdFilter) {
            // If filtering by exam, we need to check if the student's session matches the exam's session
            // and potentially other criteria if there's a more direct link.
            // For now, filtering by sessionId since exams are linked to sessions.
            const exam = examsMap[Number(examIdFilter)];
            return ss.exam_session === exam?.exam_session;
        }
        if (sessionIdFilter) {
            return ss.exam_session === Number(sessionIdFilter);
        }
        return true;
    });

    const clearFilters = () => {
        router.push("/exam-session-student");
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Exam Session Students</h1>
                <p className="text-muted-foreground">Manage students enrolled in exam sessions</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search session students..." className="pl-9" />
                </div>
                <Link href="/exam-session-student/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Session Student
                    </Button>
                </Link>
            </div>

            {(sessionIdFilter || examIdFilter) && (
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md border border-blue-200 text-blue-700">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">
                        Showing results for:
                        {examIdFilter && ` Exam ID ${examIdFilter}`}
                        {sessionIdFilter && ` Session: ${sessionsMap[Number(sessionIdFilter)] || `ID ${sessionIdFilter}`}`}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="ml-auto h-7 px-2 hover:bg-blue-100 text-blue-700"
                    >
                        <X className="mr-1 h-3 w-3" />
                        Clear Filter
                    </Button>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>STUDENT NAME</TableHead>
                            <TableHead>EXAM SESSION</TableHead>
                            <TableHead>ENROLLMENT STATUS</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No session students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((ss) => (
                                <TableRow key={ss.id}>
                                    <TableCell>{ss.id}</TableCell>
                                    <TableCell>{ss.student ? studentsMap[ss.student] || `Student ${ss.student}` : "N/A"}</TableCell>
                                    <TableCell>{ss.exam_session ? sessionsMap[ss.exam_session] || `Session ${ss.exam_session}` : "N/A"}</TableCell>
                                    <TableCell>{ss.approval_status}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[200px]">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <Link href={`/exam-session-student/${ss.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Preview</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam-session-student/${ss.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => ss.id && handleDelete(ss.id)}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    <span>Remove</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function ExamSessionStudentPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <ExamSessionStudentContent />
        </Suspense>
    );
}
