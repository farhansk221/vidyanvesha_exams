"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import {
    StudentExamQuestionOutcomeScoreService,
    StudentExamQuestionOutcomeScore,
} from "@/services/StudentExamQuestionOutcomeScoreService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function StudentExamQuestionOutcomeScoresPage() {
    const [scores, setScores] = useState<StudentExamQuestionOutcomeScore[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchScores = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await StudentExamQuestionOutcomeScoreService.getAll();
            setScores(Array.isArray(data) ? data : []);
        } catch (err) {
            // Using console.warn instead of console.error to avoid triggering common dev overlays
            console.warn("Fetch error:", err);
            setError("Failed to load data. The API might be down or unreachable.");
            toast.error("Failed to load outcome scores.");
            setScores([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this score?")) return;

        try {
            await StudentExamQuestionOutcomeScoreService.delete(id);
            toast.success("Score deleted successfully");
            fetchScores();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete score.");
        }
    };

    const filteredScores = (Array.isArray(scores) ? scores : []).filter((score) =>
        score.student?.toString().includes(searchQuery) ||
        score.exam_question_outcome?.toString().includes(searchQuery)
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Student Exam Question Outcome Scores</h1>
                    <p className="text-muted-foreground">Manage student scores for exam question outcomes</p>
                </div>
                <Link href="/student-exam-question-outcome-scores/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Outcome Score
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Student ID or Outcome ID..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>STUDENT</TableHead>
                            <TableHead>EXAM QUESTION OUTCOME</TableHead>
                            <TableHead>SCORE</TableHead>
                            <TableHead>OUT OF</TableHead>
                            <TableHead className="text-right">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading outcome scores...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredScores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    {searchQuery ? "No matching results found." : "No outcome scores found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredScores.map((score) => (
                                <TableRow key={score.id}>
                                    <TableCell>{score.id}</TableCell>
                                    <TableCell>{score.student}</TableCell>
                                    <TableCell>{score.exam_question_outcome}</TableCell>
                                    <TableCell className="font-medium">{score.score}</TableCell>
                                    <TableCell>{score.out_of}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/student-exam-question-outcome-scores/${score.id}/edit`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => score.id && handleDelete(score.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
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