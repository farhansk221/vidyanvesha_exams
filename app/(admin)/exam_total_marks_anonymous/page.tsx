"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Eye, Pencil, Trash } from "lucide-react";
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
    ExamTotalMarksAnonymousService,
    type ExamTotalMarksAnonymous,
} from "@/services/ExamTotalMarksAnonymousService";
import { ExamService, type Exam } from "@/services/ExamServices";

export default function TotalMarksAnonymousPage() {
    const [items, setItems] = useState<ExamTotalMarksAnonymous[]>([]);
    const [examsMap, setExamsMap] = useState<Record<number, Exam>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [resp, examsResp] = await Promise.all([
                ExamTotalMarksAnonymousService.getAll(),
                ExamService.getAll().catch(() => ({ results: [] })),
            ]);
            setItems(resp.results || []);
            const map: Record<number, Exam> = {};
            (examsResp.results || []).forEach((e) => {
                if (e.id !== undefined) map[e.id] = e;
            });
            setExamsMap(map);
        } catch (err) {
            console.error("Failed to load total marks anonymous", err);
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
            await ExamTotalMarksAnonymousService.delete(id);
            toast.success("Record deleted successfully");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete record");
        }
    };

    const renderExamLabel = (examId: number | null) => {
        if (!examId) return "N/A";
        const ex = examsMap[examId];
        if (!ex) return `Exam ${examId}`;
        return `Exam ${ex.id} (session ${ex.exam_session || 'N/A'})`;
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Anonymous Total Marks</h1>
                <p className="text-muted-foreground">Manage anonymous total marks records</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search records..." className="pl-9" />
                </div>
                <Link href="/exam_total_marks_anonymous/create">
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
                            <TableHead>EXAM</TableHead>
                            <TableHead>STUDENT CODE</TableHead>
                            <TableHead>MARKS</TableHead>
                            <TableHead>SEAT NO</TableHead>
                            <TableHead>ACTIONS</TableHead>
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
                                    <TableCell>{renderExamLabel(rec.exam)}</TableCell>
                                    <TableCell>{rec.student_exam_code}</TableCell>
                                    <TableCell>{rec.marks_scored}</TableCell>
                                    <TableCell>{rec.seat_no}</TableCell>
                                    <TableCell>
                                        <Link href={`/exam_total_marks_anonymous/${rec.id}`}> 
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/exam_total_marks_anonymous/${rec.id}/edit`}> 
                                            <Button variant="outline" size="sm">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => rec.id && handleDelete(rec.id)}
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
