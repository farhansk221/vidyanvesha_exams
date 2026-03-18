"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { QuestionPaperQuestionService, type QuestionPaperQuestion } from "@/services/QuestionPaperQuestionService";
import { QuestionPaperService, type QuestionPaper } from "@/services/QuestionPaperService";
import { ExamQuestionService, type ExamQuestion } from "@/services/ExamQuestionService";

export default function EditQuestionPaperQuestionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<QuestionPaperQuestion, "id"> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
    const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [item, papers, questions] = await Promise.all([
                    QuestionPaperQuestionService.getById(Number(id)),
                    QuestionPaperService.getAll().catch(() => []),
                    ExamQuestionService.getAll().catch(() => [])
                ]);
                
                // Omit 'id' from the item to match formData type
                const { id: _, ...data } = item as any;
                setFormData(data);
                setQuestionPapers(papers);
                setExamQuestions(questions);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load data");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (field: keyof Omit<QuestionPaperQuestion, "id">, value: any) => {
        setFormData((prev) => prev ? ({ ...prev, [field]: value }) : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        if (!formData.question_paper || !formData.question) {
            toast.error("Please select both a question paper and a question");
            return;
        }

        setIsSubmitting(true);
        try {
            await QuestionPaperQuestionService.update(Number(id), formData);
            toast.success("Question mapping updated successfully!");
            router.push("/question-paper-questions");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update question mapping.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!formData) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Mapping not found.</p>
                <Link href="/question-paper-questions">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/question-paper-questions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Question Mapping</h1>
                    <p className="text-muted-foreground">Update question paper question (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Mapping Details</CardTitle>
                        <CardDescription>Update the question paper link, sequence, and marks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="question_paper">Question Paper *</Label>
                            <Select
                                value={formData.question_paper?.toString() || ""}
                                onValueChange={(value) => handleInputChange("question_paper", Number(value))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Question Paper" />
                                </SelectTrigger>
                                <SelectContent>
                                    {questionPapers.map((paper) => (
                                        <SelectItem key={paper.id} value={paper.id!.toString()}>
                                            {paper.qp_name} ({paper.qp_code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question">Exam Question *</Label>
                            <Select
                                value={formData.question?.toString() || ""}
                                onValueChange={(value) => {
                                    const selectedQ = examQuestions.find(q => q.id === Number(value));
                                    handleInputChange("question", Number(value));
                                    if (selectedQ) {
                                        handleInputChange("question_label", selectedQ.question_label);
                                        handleInputChange("max_marks", selectedQ.max_marks);
                                    }
                                }}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Question" />
                                </SelectTrigger>
                                <SelectContent>
                                    {examQuestions.map((q) => (
                                        <SelectItem key={q.id} value={q.id!.toString()}>
                                            ID: {q.id} - {q.question_label} ({q.max_marks} Marks)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question_label">Question Label *</Label>
                            <Input
                                id="question_label"
                                placeholder="e.g. Q1"
                                value={formData.question_label}
                                onChange={(e) => handleInputChange("question_label", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question_sequence">Question Sequence</Label>
                            <Input
                                id="question_sequence"
                                type="number"
                                placeholder="e.g. 1"
                                value={formData.question_sequence ?? ""}
                                onChange={(e) => handleInputChange("question_sequence", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="max_marks">Max Marks *</Label>
                            <Input
                                id="max_marks"
                                type="number"
                                placeholder="e.g. 10"
                                value={formData.max_marks ?? ""}
                                onChange={(e) => handleInputChange("max_marks", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/question-paper-questions">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Mapping"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
