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
import { StudentExamOutcomeScoreService, type StudentExamOutcomeScore } from "@/services/StudentExamOutcomeScoreService";
import { StudentService } from "@/services/StudentService";
import { ExamQuestionOutcomeService } from "@/services/ExamQuestionOutcome";

export default function StudentExamOutcomesScoresPage() {
    const [scores, setScores] = useState<StudentExamOutcomeScore[]>([]);
    const [studentsMap, setStudentsMap] = useState<Record<number, string>>({});
    const [outcomesMap, setOutcomesMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [scoresData, studentsData, outcomesData] = await Promise.all([
                StudentExamOutcomeScoreService.getAll(),
                StudentService.getAll().catch(() => []),
                ExamQuestionOutcomeService.getAll().catch(() => [])
            ]);

            setScores(scoresData || []);

            const sMap: Record<number, string> = {};
            (studentsData || []).forEach((s: any) => {
                const name = [s.stud_first_name, s.stud_last_name].filter(Boolean).join(" ");
                sMap[s.id] = name || `Student ${s.id}`;
            });
            setStudentsMap(sMap);

            const oMap: Record<number, string> = {};
            (outcomesData || []).forEach((o: any) => {
                oMap[o.id] = o.outcome || `Outcome ${o.id}`;
            });
            setOutcomesMap(oMap);
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
        if (!window.confirm("Are you sure you want to delete this score?")) return;
        try {
            await StudentExamOutcomeScoreService.delete(id);
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
                <h1 className="text-2xl font-bold tracking-tight">Student Exam Outcomes Scores</h1>
                <p className="text-muted-foreground">Manage student scores for exam outcomes</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search student outcome scores..." className="pl-9" />
                </div>
                <Link href="/student-exam-outcomes-scores/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Outcome Score
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>STUDENT</TableHead>
                            <TableHead>EXAM OUTCOME</TableHead>
                            <TableHead>SCORE</TableHead>
                            <TableHead>OUT OF</TableHead>
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
                        ) : scores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No student outcome scores found. Click &quot;Create Outcome Score&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            scores.map((score) => (
                                <TableRow key={score.id}>
                                    <TableCell>{score.id}</TableCell>
                                    <TableCell>{score.student ? studentsMap[score.student] || `Student ${score.student}` : "N/A"}</TableCell>
                                    <TableCell>{score.exam_question_outcome ? outcomesMap[score.exam_question_outcome] || `Outcome ${score.exam_question_outcome}` : "N/A"}</TableCell>
                                    <TableCell className="font-medium">{score.score}</TableCell>
                                    <TableCell>{score.out_of}</TableCell>
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
                                                <Link href={`/student-exam-outcomes-scores/${score.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => score.id && handleDelete(score.id)}
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