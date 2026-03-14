"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Eye, Pencil, Trash, MoreVertical } from "lucide-react";
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
import {
    ExamQuestionMarksAnonymousService,
    type ExamQuestionMarksAnonymous,
    type PaginatedResponse,
} from "@/services/ExamQuestionMarksAnonymousService";
import { ExamQuestionService, type ExamQuestion } from "@/services/ExamQuestionService";

export default function AnonymousMarksPage() {
    const [items, setItems] = useState<ExamQuestionMarksAnonymous[]>([]);
    const [questionsMap, setQuestionsMap] = useState<Record<number, ExamQuestion>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [marksResp, questionsResp] = await Promise.all([
                ExamQuestionMarksAnonymousService.getAll(),
                ExamQuestionService.getAll().catch(() => ({ results: [] })),
            ]);
            setItems(marksResp.results || []);
            const qMap: Record<number, ExamQuestion> = {};
            (questionsResp.results || []).forEach((q) => {
                if (q.id !== undefined) qMap[q.id] = q;
            });
            setQuestionsMap(qMap);
        } catch (err) {
            console.error("Failed to load anonymous marks", err);
            setError("Failed to load");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await ExamQuestionMarksAnonymousService.delete(id);
            toast.success("Record deleted successfully");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete record");
        }
    };

    const renderQuestionLabel = (qid: number | null) => {
        if (!qid) return "N/A";
        const q = questionsMap[qid];
        if (!q) return `Question ${qid}`;
        return q.question_label || `Q${q.id}`;
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Anonymous Question Marks</h1>
                <p className="text-muted-foreground">Manage anonymous exam question marks</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search records..." className="pl-9" />
                </div>
                <Link href="/exam_question_marks_anonymous/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Record
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>QUESTION</TableHead>
                            <TableHead>STUDENT CODE</TableHead>
                            <TableHead>MARKS</TableHead>
                            <TableHead>SEAT NO</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No records found. Click "Create Record" to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((rec) => (
                                <TableRow key={rec.id}>
                                    <TableCell>{rec.id}</TableCell>
                                    <TableCell>{renderQuestionLabel(rec.exam_question)}</TableCell>
                                    <TableCell>{rec.student_exam_code}</TableCell>
                                    <TableCell>{rec.marks_scored}</TableCell>
                                    <TableCell>{rec.seat_no}</TableCell>
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
                                                <Link href={`/exam_question_marks_anonymous/${rec.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Preview</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam_question_marks_anonymous/${rec.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => rec.id && handleDelete(rec.id)}
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
