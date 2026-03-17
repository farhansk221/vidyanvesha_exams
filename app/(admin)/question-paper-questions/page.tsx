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
import { QuestionPaperQuestionService, type QuestionPaperQuestion } from "@/services/QuestionPaperQuestionService";
import { QuestionPaperService } from "@/services/QuestionPaperService";
import { ExamQuestionService } from "@/services/ExamQuestionService";

export default function QuestionPaperQuestionsPage() {
    const [items, setItems] = useState<QuestionPaperQuestion[]>([]);
    const [papersMap, setPapersMap] = useState<Record<number, string>>({});
    const [questionsMap, setQuestionsMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [qpqData, papersData, questionsData] = await Promise.all([
                QuestionPaperQuestionService.getAll(),
                QuestionPaperService.getAll().catch(() => []),
                ExamQuestionService.getAll().catch(() => [])
            ]);

            setItems(Array.isArray(qpqData) ? qpqData : []);

            const pMap: Record<number, string> = {};
            (papersData || []).forEach((p: any) => {
                pMap[p.id] = p.qp_name || `Paper ${p.id}`;
            });
            setPapersMap(pMap);

            const qMap: Record<number, string> = {};
            (questionsData || []).forEach((q: any) => {
                qMap[q.id] = q.question_label || `Question ${q.id}`;
            });
            setQuestionsMap(qMap);
        } catch (err) {
            console.error(err);
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
            await QuestionPaperQuestionService.delete(id);
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
                <h1 className="text-2xl font-bold tracking-tight">Question Paper Questions</h1>
                <p className="text-muted-foreground">Manage questions mapping within question papers</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search question paper questions..." className="pl-9" />
                </div>
                <Button asChild>
                    <Link href="/question-paper-questions/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Question Mapping
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>QUESTION PAPER</TableHead>
                            <TableHead>QUESTION</TableHead>
                            <TableHead>SEQUENCE</TableHead>
                            <TableHead>MAX MARKS</TableHead>
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
                                <TableCell colSpan={6} className="h-24 text-center text-red-500 font-medium">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : !Array.isArray(items) || items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No mappings found. Click &quot;Create Question Mapping&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.question_paper ? papersMap[item.question_paper] || `Paper ${item.question_paper}` : "N/A"}</TableCell>
                                    <TableCell>{item.question ? questionsMap[item.question] || `Question ${item.question}` : "N/A"}</TableCell>
                                    <TableCell>{item.question_sequence ?? "N/A"}</TableCell>
                                    <TableCell>{item.max_marks ?? "N/A"}</TableCell>
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
                                                <DropdownMenuItem className="cursor-pointer" asChild>
                                                    <Link href={`/question-paper-questions/${item.id}/edit`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => item.id && handleDelete(item.id)}
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