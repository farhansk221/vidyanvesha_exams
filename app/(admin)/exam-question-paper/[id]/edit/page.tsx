"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { ExamQuestionPaperService, type ExamQuestionPaper } from "@/services/ExamQuestionpaperService";
import { ExamService, type Exam } from "@/services/ExamServices";
import { QuestionPaperService, type QuestionPaper } from "@/services/QuestionPaperService";

export default function EditExamQuestionPaperPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<ExamQuestionPaper, "id"> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [exams, setExams] = useState<Exam[]>([]);
    const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                const [existingData, examsData, qpData] = await Promise.all([
                    ExamQuestionPaperService.getById(Number(id)),
                    ExamService.getAll().catch(() => ({ results: [] })),
                    QuestionPaperService.getAll().catch(() => [])
                ]);
                
                setFormData({
                    exam: existingData.exam,
                    question_paper: existingData.question_paper,
                    paper_selected_for_exam: existingData.paper_selected_for_exam
                });
                setExams(examsData.results || []);
                setQuestionPapers(Array.isArray(qpData) ? qpData : (qpData as any).results || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const handleInputChange = (field: keyof Omit<ExamQuestionPaper, "id">, value: number | boolean | null) => {
        setFormData((prev) => prev ? { ...prev, [field]: value } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !formData.exam || !formData.question_paper) {
            toast.error("Please fill in all required fields");
            return;
        }
        setIsSubmitting(true);
        try {
            await ExamQuestionPaperService.update(Number(id), formData);
            toast.success("Exam question paper updated successfully!");
            router.push("/exam-question-paper");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update exam question paper.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !formData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam-question-paper">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Exam Question Paper</h1>
                    <p className="text-muted-foreground">Update exam question paper (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Question Paper Details</CardTitle>
                        <CardDescription>Update the exam and question paper link</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam">Exam *</Label>
                            <Select
                                value={formData.exam?.toString() || ""}
                                onValueChange={(value) => handleInputChange("exam", Number(value))}
                            >
                                <SelectTrigger id="exam">
                                    <SelectValue placeholder="Select Exam" />
                                </SelectTrigger>
                                <SelectContent>
                                    {exams.map((exam) => (
                                        <SelectItem key={exam.id} value={exam.id?.toString() || ""}>
                                            {`Exam ${exam.id} (${exam.exam_date || "No date"})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question_paper">Question Paper *</Label>
                            <Select
                                value={formData.question_paper?.toString() || ""}
                                onValueChange={(value) => handleInputChange("question_paper", Number(value))}
                            >
                                <SelectTrigger id="question_paper">
                                    <SelectValue placeholder="Select Question Paper" />
                                </SelectTrigger>
                                <SelectContent>
                                    {questionPapers.map((qp) => (
                                        <SelectItem key={qp.id} value={qp.id?.toString() || ""}>
                                            {qp.qp_name || `QP ${qp.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="paper_selected_for_exam">Paper Selected for Exam</Label>
                                <p className="text-sm text-muted-foreground">Is this paper selected for the exam?</p>
                            </div>
                            <Switch
                                id="paper_selected_for_exam"
                                checked={formData.paper_selected_for_exam}
                                onCheckedChange={(checked) => handleInputChange("paper_selected_for_exam", checked)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exam-question-paper">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Exam Question Paper"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
