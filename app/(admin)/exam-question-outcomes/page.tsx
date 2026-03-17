"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash, Eye, MoreVertical } from "lucide-react";
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
import { ExamQuestionOutcomeService, type ExamQuestionOutcome } from "@/services/ExamQuestionOutcome";
import { ExamService } from "@/services/ExamServices";

export default function ExamQuestionOutcomesPage() {
    const [outcomes, setOutcomes] = useState<ExamQuestionOutcome[]>([]);
    const [examsMap, setExamsMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [outcomesData, examsData] = await Promise.all([
                ExamQuestionOutcomeService.getAll(),
                ExamService.getAll().catch(() => [])
            ]);

            setOutcomes(outcomesData || []);

            const eMap: Record<number, string> = {};
            (examsData || []).forEach((e: any) => {
                eMap[e.id] = e.exam_name || `Exam ${e.id}`;
            });
            setExamsMap(eMap);
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
        if (!window.confirm("Are you sure you want to delete this outcome mapping?")) return;
        try {
            await ExamQuestionOutcomeService.delete(id);
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
                <h1 className="text-2xl font-bold tracking-tight">Exam Question Outcomes</h1>
                <p className="text-muted-foreground">Manage outcomes mapped to exam questions</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search exam question outcomes..." className="pl-9" />
                </div>
                <Link href="/exam-question-outcomes/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Exam Question Outcome
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>EXAM QUESTION</TableHead>
                            <TableHead>OUTCOME</TableHead>
                            <TableHead>WEIGHTAGE</TableHead>
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
                        ) : outcomes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No exam question outcomes found. Click &quot;Create Exam Question Outcome&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            outcomes.map((outcome) => (
                                <TableRow key={outcome.id}>
                                    <TableCell>{outcome.id}</TableCell>
                                    <TableCell>{outcome.exam_question ? examsMap[outcome.exam_question] || `ID ${outcome.exam_question}` : "N/A"}</TableCell>
                                    <TableCell>{outcome.outcome ?? "N/A"}</TableCell>
                                    <TableCell>{outcome.weightage ?? "N/A"}</TableCell>
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
                                                <Link href={`/exam-question-outcomes/${outcome.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => outcome.id && handleDelete(outcome.id)}
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