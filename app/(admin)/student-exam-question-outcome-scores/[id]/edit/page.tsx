"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    StudentExamQuestionOutcomeScoreService,
    StudentExamQuestionOutcomeScore,
} from "@/services/StudentExamQuestionOutcomeScoreService";
import {
    ExamQuestionOutcomeService,
    ExamQuestionOutcome,
} from "@/services/ExamQuestionOutcome";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EditStudentExamQuestionOutcomeScorePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [formData, setFormData] = useState<Omit<StudentExamQuestionOutcomeScore, "id">>({
        exam_question_outcome: null,
        student: null,
        score: null,
        out_of: null,
    });
    
    const [outcomes, setOutcomes] = useState<ExamQuestionOutcome[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOutcomes, setIsLoadingOutcomes] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOutcomes = async () => {
            try {
                const response = await ExamQuestionOutcomeService.getAll();
                setOutcomes(response || []);
            } catch (err) {
                console.error("Failed to fetch outcomes:", err);
            } finally {
                setIsLoadingOutcomes(false);
            }
        };

        const fetchData = async () => {
            if (isNaN(id)) {
                setError("Invalid ID provided.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await StudentExamQuestionOutcomeScoreService.getById(id);
                setFormData({
                    exam_question_outcome: data.exam_question_outcome,
                    student: data.student,
                    score: data.score,
                    out_of: data.out_of,
                });
            } catch (err) {
                console.error("Failed to fetch score data:", err);
                setError("Failed to load the data. It might not exist or the API is down.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOutcomes();
        fetchData();
    }, [id]);

    const handleInputChange = (field: keyof typeof formData, value: number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.exam_question_outcome) {
            toast.error("Please select an exam question outcome");
            return;
        }

        setIsSubmitting(true);
        try {
            await StudentExamQuestionOutcomeScoreService.update(id, formData);
            toast.success("Outcome score updated successfully!");
            router.push("/student-exam-question-outcome-scores");
        } catch (err) {
            console.error("Update error:", err);
            toast.error("Failed to update outcome score.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/student-exam-question-outcome-scores">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Outcome Score</h1>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Link href="/student-exam-question-outcome-scores">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/student-exam-question-outcome-scores">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Outcome Score</h1>
                    <p className="text-muted-foreground">Update outcome score (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Score Details</CardTitle>
                        <CardDescription>Update the outcome, student, score, and maximum score</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam_question_outcome">Exam Question Outcome *</Label>
                            <Select
                                value={formData.exam_question_outcome?.toString() || ""}
                                onValueChange={(value) => handleInputChange("exam_question_outcome", Number(value))}
                                disabled={isLoadingOutcomes}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={isLoadingOutcomes ? "Loading outcomes..." : "Select outcome"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {outcomes.length === 0 ? (
                                        <SelectItem value="none" disabled>No outcomes available</SelectItem>
                                    ) : (
                                        outcomes.map((outcome) => (
                                            <SelectItem key={outcome.id} value={outcome.id?.toString() || ""}>
                                                ID: {outcome.id} (Weightage: {outcome.weightage})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student">Student ID *</Label>
                            <Input
                                id="student"
                                type="number"
                                placeholder="e.g. 10001"
                                value={formData.student ?? ""}
                                onChange={(e) => handleInputChange("student", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="score">Score *</Label>
                            <Input
                                id="score"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 2.4"
                                value={formData.score ?? ""}
                                onChange={(e) => handleInputChange("score", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="out_of">Out Of *</Label>
                            <Input
                                id="out_of"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 3.0"
                                value={formData.out_of ?? ""}
                                onChange={(e) => handleInputChange("out_of", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/student-exam-question-outcome-scores">
                            <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting || isLoadingOutcomes}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : "Update Outcome Score"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
