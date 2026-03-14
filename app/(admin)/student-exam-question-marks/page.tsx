"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash, MoreVertical, Eye } from "lucide-react";
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
                                                <Link href={`/student-exam-question-marks/${m.id}/edit`}>
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