"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Trash, Pencil, View, Eye, X, Filter } from "lucide-react";
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
import { ExamQuestionService, type ExamQuestion, type Question } from "@/services/ExamQuestionService";
import { ExamService, type Exam } from "@/services/ExamServices";
import { ExamSessionService } from "@/services/ExamSessionServices";

function ExamQuestionsContent() {
    const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
    const [questionsMap, setQuestionsMap] = useState<Record<number, Question>>({});
    const [examsMap, setExamsMap] = useState<Record<number, Exam>>({});
    const [sessionsMap, setSessionsMap] = useState<Record<number, string>>({});
    const [programsMap, setProgramsMap] = useState<Record<number, string>>({});
    const [coursesMap, setCoursesMap] = useState<Record<number, string>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const examIdFilter = searchParams.get("examId");
    const sessionIdFilter = searchParams.get("sessionId");

    const filteredExamQuestions = examQuestions.filter(eq => {
        const matchExam = examIdFilter ? eq.exam === Number(examIdFilter) : true;
        const matchSession = sessionIdFilter ? (examsMap[eq.exam as number]?.exam_session === Number(sessionIdFilter)) : true;
        return matchExam && matchSession;
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [eqData, qData, examsData, sessionsData, programsData, coursesData] = await Promise.all([
                ExamQuestionService.getAll(),
                ExamQuestionService.getQuestions().catch(() => []),
                ExamService.getAll().catch(() => ({ results: [] })),
                ExamSessionService.getAll().catch(() => ({ results: [] })),
                ExamService.getPrograms().catch(() => []),
                ExamService.getCourses().catch(() => [])
            ]);

            setExamQuestions(eqData.results || []);

            const qMap: Record<number, Question> = {};
            qData.forEach((q) => { qMap[q.id] = q; });
            setQuestionsMap(qMap);

            const eMap: Record<number, Exam> = {};
            (examsData.results || []).forEach((e) => { eMap[e.id as number] = e; });
            setExamsMap(eMap);

            const sMap: Record<number, string> = {};
            (sessionsData.results || []).forEach((s) => { sMap[s.id as number] = s.exam_session_name || `Session ${s.id}`; });
            setSessionsMap(sMap);

            const pMap: Record<number, string> = {};
            programsData.forEach((p) => { pMap[p.id] = p.prog_name || `Program ${p.id}`; });
            setProgramsMap(pMap);

            const cMap: Record<number, string> = {};
            coursesData.forEach((c) => { cMap[c.id] = c.course_name || `Course ${c.id}`; });
            setCoursesMap(cMap);

        } catch (err) {
            console.error("Fetch Data Error:", err);
            setError("Failed to load exam questions list");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this exam question?")) return;
        try {
            await ExamQuestionService.delete(id);
            toast.success("Exam question deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete exam question");
        }
    };
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Exam Questions</h1>
                <p className="text-muted-foreground">Manage exam questions and their configurations</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search exam questions..." className="pl-9" />
                </div>
                <Link href="/exam-questions/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Exam Question
                    </Button>
                </Link>
            </div>

            {(examIdFilter || sessionIdFilter) && (
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md border border-blue-200 text-blue-700">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">
                        Showing questions for: 
                        {sessionIdFilter && ` Session: ${sessionsMap[Number(sessionIdFilter)] || `ID ${sessionIdFilter}`}`}
                        {examIdFilter && ` | Exam: ${examIdFilter}`}
                    </span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push('/exam-questions')}
                        className="ml-auto h-7 px-2 hover:bg-blue-100 text-blue-700"
                    >
                        <X className="mr-1 h-3 w-3" />
                        Clear Filters
                    </Button>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Question ID</TableHead>
                            <TableHead>Exam</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Max Marks</TableHead>
                            <TableHead>Actions</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : examQuestions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No exam questions found. Click &quot;Create Exam Question&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredExamQuestions.map((eq) => {
                                const renderExamValue = (examId: number | null) => {
                                    if (!examId) return "N/A";
                                    const exam = examsMap[examId];
                                    if (!exam) return `Exam ${examId}`;

                                    const progName = exam.prog ? programsMap[exam.prog] || `Prog ${exam.prog}` : "";
                                    const sessionName = exam.exam_session ? sessionsMap[exam.exam_session] || `Session ${exam.exam_session}` : "";
                                    const className = exam.stud_class || "";
                                    const courseName = exam.course ? coursesMap[exam.course] || `Course ${exam.course}` : "";
                                    const assessType = exam.direct_or_indirect || "";
                                    const categoryName = exam.exam_category || "";
                                    const durationName = exam.exam_duration || "None";

                                    return [progName, sessionName, className, courseName, assessType, categoryName, durationName].filter(Boolean).join(" - ");
                                };

                                const renderQuestionValue = (qId: number | null) => {
                                    if (!qId) return "N/A";
                                    const qData = questionsMap[qId];
                                    if (!qData) return `Question ${qId}`;

                                    const qDesc = qData.question_desc || "";
                                    const cName = qData.course_name || "";
                                    const qType = qData.question_type_name || "";
                                    const blLevel = qData.bl_level || "";
                                    return [qDesc, cName, qType, blLevel].filter(Boolean).join(" - ");
                                };

                                return (
                                    <TableRow key={eq.id}>
                                        <TableCell>{eq.id}</TableCell>
                                        <TableCell>
                                            <div className="font-medium max-w-[300px] text-sm text-balance">
                                                {renderExamValue(eq.exam)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[300px] text-sm text-balance">
                                                {renderQuestionValue(eq.question)}
                                            </div>
                                        </TableCell>
                                        <TableCell>{eq.question_label || "N/A"}</TableCell>
                                        <TableCell>{eq.max_marks || "N/A"}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Link href={`/exam-questions/${eq.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`exam-questions/${eq.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link href={`/exam-questions/${eq.id}/delete`}>
                                                <Button variant="ghost" size="sm">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function ExamQuestionsPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <ExamQuestionsContent />
        </Suspense>
    );
}