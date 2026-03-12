"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
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

const defaultFormData: Omit<StudentExamQuestionOutcomeScore, "id"> = {
    exam_question_outcome: null,
    student: null,
    score: null,
    out_of: null,
};

export default function CreateStudentExamQuestionOutcomeScorePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<StudentExamQuestionOutcomeScore, "id">>(defaultFormData);
    const [outcomes, setOutcomes] = useState<ExamQuestionOutcome[]>([]);
    const [isLoadingOutcomes, setIsLoadingOutcomes] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOutcomes = async () => {
            try {
                const response = await ExamQuestionOutcomeService.getAll();
                // Check if response is paginated or direct array
                setOutcomes(Array.isArray(response) ? response : response.results || []);
            } catch (error) {
                console.error("Failed to fetch outcomes:", error);
                toast.error("Failed to load exam question outcomes.");
            } finally {
                setIsLoadingOutcomes(false);
            }
        };
        fetchOutcomes();
    }, []);

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
            await StudentExamQuestionOutcomeScoreService.create(formData);
            toast.success("Outcome score created successfully!");
            router.push("/student-exam-question-outcome-scores");
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to create outcome score. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/student-exam-question-outcome-scores">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Outcome Score</h1>
                    <p className="text-muted-foreground">Record a student&apos;s score for an exam question outcome</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Score Details</CardTitle>
                        <CardDescription>Enter the outcome, student, score, and maximum score</CardDescription>
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
                                    Creating...
                                </>
                            ) : "Create Outcome Score"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
