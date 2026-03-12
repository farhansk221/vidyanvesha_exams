"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash } from "lucide-react";
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
import { StudentExamQuestionMarkService, type StudentExamQuestionMark } from "@/services/StudentExamQuestionMarkService";
import { ExamQuestionService } from "@/services/ExamQuestionService";

export default function StudentExamQuestionMarksPage() {
    const [marks, setMarks] = useState<StudentExamQuestionMark[]>([]);
    const [examQuestionsMap, setExamQuestionsMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [marksData, questionsData] = await Promise.all([
                StudentExamQuestionMarkService.getAll(),
                ExamQuestionService.getAll().catch(() => ({ results: [] }))
            ]);

            setMarks(marksData.results || []);

            const qMap: Record<number, string> = {};
            (questionsData.results || []).forEach((q: any) => {
                qMap[q.id] = q.question || `Question ${q.id}`;
            });
            setExamQuestionsMap(qMap);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load the Data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete these marks?")) return;
        try {
            await StudentExamQuestionMarkService.delete(id);
            toast.success("Deleted successfully");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Student Exam Question Marks</h1>
                <p className="text-muted-foreground">Manage student marks for exam questions</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search student marks..." className="pl-9" />
                </div>
                <Link href="/student-exam-question-marks/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Student Marks
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>STUDENT</TableHead>
                            <TableHead>EXAM QUESTION</TableHead>
                            <TableHead>MARKS OBTAINED</TableHead>
                            <TableHead>ACTIONS</TableHead>
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
                                <TableCell colSpan={5} className="h-24 text-center text-red-500 font-medium">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : marks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No student marks found. Click &quot;Create Student Marks&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            marks.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell>{m.id}</TableCell>
                                    <TableCell>{m.student}</TableCell>
                                    <TableCell>{m.exam_question ? examQuestionsMap[m.exam_question] || `ID ${m.exam_question}` : "N/A"}</TableCell>
                                    <TableCell>{m.marks_scored ?? "N/A"}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Link href={`/student-exam-question-marks/${m.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" 
                                            onClick={() => m.id && handleDelete(m.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
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