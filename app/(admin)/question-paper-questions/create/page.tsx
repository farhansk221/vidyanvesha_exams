"use client";

import { useEffect, useState } from "react";
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
import { QuestionPaperQuestionService, type QuestionPaperQuestion } from "@/services/QuestionPaperQuestionService";
import { QuestionPaperService, type QuestionPaper } from "@/services/QuestionPaperService";
import { ExamQuestionService, type ExamQuestion } from "@/services/ExamQuestionService";

const defaultFormData: Omit<QuestionPaperQuestion, "id"> = {
    question_paper: null,
    question: null,
    question_label: "",
    question_sequence: null,
    max_marks: null,
};

export default function CreateQuestionPaperQuestionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<QuestionPaperQuestion, "id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
    const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [papers, questions] = await Promise.all([
                    QuestionPaperService.getAll().catch(() => []),
                    ExamQuestionService.getAll().catch(() => [])
                ]);
                setQuestionPapers(papers);
                setExamQuestions(questions);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                toast.error("Failed to load dropdown options");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleInputChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.question_paper || !formData.question) {
            toast.error("Please select both a question paper and a question");
            return;
        }

        setIsSubmitting(true);
        try {
            await QuestionPaperQuestionService.create(formData);
            toast.success("Question mapping created successfully!");
            router.push("/question-paper-questions");
        } catch (error: any) {
            console.error("Error creating question mapping:", error);
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
                    errorData.non_field_errors.forEach((msg: string) => toast.error(msg));
                } else if (typeof errorData === 'object') {
                    Object.keys(errorData).forEach(key => {
                        const messages = errorData[key];
                        if (Array.isArray(messages)) {
                            messages.forEach((msg: string) => toast.error(`${key}: ${msg}`));
                        } else {
                            toast.error(`${key}: ${messages}`);
                        }
                    });
                } else {
                    toast.error("Failed to create question mapping.");
                }
            } else {
                toast.error("Failed to create question mapping.");
            }
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

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/question-paper-questions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Question Mapping</h1>
                    <p className="text-muted-foreground">Add a new question to a question paper</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Mapping Details</CardTitle>
                        <CardDescription>Link a question from the question bank to a specific question paper</CardDescription>
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
                            {isSubmitting ? "Creating..." : "Create Mapping"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
