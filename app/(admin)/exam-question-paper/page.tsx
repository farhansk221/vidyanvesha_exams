"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Eye, Pencil, Trash, Filter, X, FileText, MoreVertical } from "lucide-react";
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
import { ExamQuestionPaperService, type ExamQuestionPaper } from "@/services/ExamQuestionpaperService";
import { ExamService, type Exam } from "@/services/ExamServices";
import { QuestionPaperService, type QuestionPaper } from "@/services/QuestionPaperService";
import { ExamSessionService } from "@/services/ExamSessionServices";

function ExamQuestionPaperContent() {
    const [mappings, setMappings] = useState<ExamQuestionPaper[]>([]);
    const [examsMap, setExamsMap] = useState<Record<number, Exam>>({});
    const [questionPapersMap, setQuestionPapersMap] = useState<Record<number, string>>({});
    const [sessionsMap, setSessionsMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionIdFilter = searchParams.get("sessionId");
    const examIdFilter = searchParams.get("examId");

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [mappingsData, examsData, qpData, sessionsData] = await Promise.all([
                ExamQuestionPaperService.getAll(),
                ExamService.getAll().catch(() => []),
                QuestionPaperService.getAll().catch(() => []),
                ExamSessionService.getAll().catch(() => [])
            ]);

            setMappings(mappingsData || []);

            const eMap: Record<number, Exam> = {};
            (examsData || []).forEach((e: Exam) => {
                if (e.id) eMap[e.id] = e;
            });
            setExamsMap(eMap);

            const qMap: Record<number, string> = {};
            const qpList = qpData || [];
            qpList.forEach((q: QuestionPaper) => {
                if (q.id) qMap[q.id] = q.qp_name || `QP ${q.id}`;
            });
            setQuestionPapersMap(qMap);

            const sMap: Record<number, string> = {};
            (sessionsData || []).forEach((s: any) => {
                if (s.id) sMap[s.id] = s.exam_session_name || `Session ${s.id}`;
            });
            setSessionsMap(sMap);

        } catch (err) {
            console.error("Failed to fetch exam question papers:", err);
            setError("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this mapping?")) return;
        try {
            await ExamQuestionPaperService.delete(id);
            toast.success("Mapping deleted successfully");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete mapping");
        }
    };

    const filteredMappings = mappings.filter(m => {
        if (examIdFilter) {
            return m.exam === Number(examIdFilter);
        }
        if (sessionIdFilter) {
            const exam = m.exam ? examsMap[m.exam] : null;
            return exam?.exam_session === Number(sessionIdFilter);
        }
        return true;
    });

    const clearFilters = () => {
        router.push("/exam-question-paper");
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Exam Question Papers</h1>
                <p className="text-muted-foreground">Manage exam and question paper mappings</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search mappings..." className="pl-9" />
                </div>
                <Link href="/exam-question-paper/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Mapping
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
                            <TableHead>EXAM</TableHead>
                            <TableHead>QUESTION PAPER</TableHead>
                            <TableHead>SELECTED FOR EXAM</TableHead>
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
                        ) : filteredMappings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No mappings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMappings.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell>{m.id}</TableCell>
                                    <TableCell>
                                        {m.exam ? `Exam ${m.exam}` : "N/A"}
                                        {m.exam && examsMap[m.exam] && ` (${examsMap[m.exam].exam_date || ""})`}
                                    </TableCell>
                                    <TableCell>
                                        {m.question_paper ? questionPapersMap[m.question_paper] || `QP ${m.question_paper}` : "N/A"}
                                    </TableCell>
                                    <TableCell>{m.paper_selected_for_exam ? "Yes" : "No"}</TableCell>
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
                                                <Link href={`/exam-question-paper/${m.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Preview</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam-question-paper/${m.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => m.id && handleDelete(m.id)}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    <span>Delete</span>
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

export default function ExamQuestionPaperPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <ExamQuestionPaperContent />
        </Suspense>
    );
}