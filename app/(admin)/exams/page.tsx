"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Loader2, Trash, Pencil, X, Filter, HelpCircle, FileText, Users } from "lucide-react";
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
import { ExamService, type Exam } from "@/services/ExamServices";
import { ExamSessionService } from "@/services/ExamSessionServices";

function ExamsList() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [sessionsMap, setSessionsMap] = useState<Record<number, string>>({});
    const [programsMap, setProgramsMap] = useState<Record<number, string>>({});
    const [coursesMap, setCoursesMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionIdFilter = searchParams.get("sessionId");

    const filteredExams = sessionIdFilter 
        ? exams.filter(exam => exam.exam_session === Number(sessionIdFilter))
        : exams;

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [examsData, sessionsData, programsData, coursesData] = await Promise.all([
                ExamService.getAll(),
                ExamSessionService.getAll().catch(() => ({ results: [] })),
                ExamService.getPrograms().catch(() => []),
                ExamService.getCourses().catch(() => [])
            ]);

            setExams(examsData.results || []);

            const sMap: Record<number, string> = {};
            // Using results because ExamSessionService.getAll() returns PaginatedResponse
            (sessionsData.results || []).forEach((s) => {
                sMap[s.id as number] = s.exam_session_name || `Session ${s.id}`;
            });
            setSessionsMap(sMap);

            const pMap: Record<number, string> = {};
            programsData.forEach((p) => {
                pMap[p.id] = p.prog_name || `Program ${p.id}`;
            });
            setProgramsMap(pMap);

            const cMap: Record<number, string> = {};
            coursesData.forEach((c) => {
                cMap[c.id] = c.course_name || `Course ${c.id}`;
            });
            setCoursesMap(cMap);

        } catch (err) {
            console.error("Fetch Data Error:", err);
            setError("Failed to load exams list");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        try {
            await ExamService.delete(id);
            toast.success("Exam deleted successfully");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete exam");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
                <p className="text-muted-foreground">Manage exams and their details</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search exams..." className="pl-9" />
                </div>
                <Link href="/exams/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Exam
                    </Button>
                </Link>
            </div>

            {sessionIdFilter && (
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md border border-blue-200 text-blue-700">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">
                        Showing exams for session: {sessionsMap[Number(sessionIdFilter)] || `ID ${sessionIdFilter}`}
                    </span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push('/exams')}
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
                            <TableHead>Exam ID</TableHead>
                            <TableHead>Exam Session</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Assessment Type</TableHead>
                            <TableHead>Exam Category</TableHead>
                            <TableHead>Total Marks</TableHead>
                            <TableHead>Passing Marks</TableHead>
                            <TableHead>Exam Duration</TableHead>
                            <TableHead>Exam Date</TableHead>
                            <TableHead>Exam Start Time</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={12} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={12} className="h-24 text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : exams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                                    No exams found. Click &quot;Create Exam&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredExams.map((exam) => (
                                <TableRow key={exam.id}>
                                    <TableCell>{exam.id}</TableCell>
                                    <TableCell>{exam.exam_session ? sessionsMap[exam.exam_session] || `Session ${exam.exam_session}` : "N/A"}</TableCell>
                                    <TableCell>{exam.stud_class || "N/A"}</TableCell>
                                    <TableCell>{exam.course ? coursesMap[exam.course] || `Course ${exam.course}` : "N/A"}</TableCell>
                                    <TableCell>{exam.direct_or_indirect || "N/A"}</TableCell>
                                    <TableCell>{exam.exam_category || "N/A"}</TableCell>
                                    <TableCell>{exam.total_marks || "N/A"}</TableCell>
                                    <TableCell>{exam.passing_marks || "N/A"}</TableCell>
                                    <TableCell>{exam.exam_duration || "None"}</TableCell>
                                    <TableCell>{exam.exam_date || "N/A"}</TableCell>
                                    <TableCell>{exam.exam_start_time || "N/A"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/exams/${exam.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/exams/${exam.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/exam-question-paper?examId=${exam.id}&sessionId=${exam.exam_session}`}>
                                                <Button variant="outline" size="sm" title="View Question Papers">
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/exam-session-student?examId=${exam.id}&sessionId=${exam.exam_session}`}>
                                                <Button variant="outline" size="sm" title="View Students">
                                                    <Users className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="sm"
                                                onClick={() => exam.id && handleDelete(exam.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
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

export default function ExamsPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <ExamsList />
        </Suspense>
    );
}
