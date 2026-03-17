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
import {
    ExamQuestionMarksAnonymousService,
    type ExamQuestionMarksAnonymous,
} from "@/services/ExamQuestionMarksAnonymousService";
import { ExamQuestionService, type ExamQuestion } from "@/services/ExamQuestionService";

const defaultFormData: Omit<ExamQuestionMarksAnonymous, "id"> = {
    exam_question: null,
    student_exam_code: "",
    marks_scored: null,
    seat_no: "",
};

export default function CreateAnonymousMarksPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<ExamQuestionMarksAnonymous, "id">>(defaultFormData);
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoadingData(true);
                const qdata = await ExamQuestionService.getAll();
                setQuestions(qdata || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load the Data");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleInputChange = (field: keyof typeof formData, value: string | number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ExamQuestionMarksAnonymousService.create(formData as any);
            toast.success("Record created successfully!");
            router.push("/exam_question_marks_anonymous");
        } catch (error) {
            console.error("Create error", error);
            toast.error("Failed to create record.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam_question_marks_anonymous">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Anonymous Mark</h1>
                    <p className="text-muted-foreground">Fill in the details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Marks Details</CardTitle>
                        <CardDescription>Select question and enter student codes</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam_question">Exam Question *</Label>
                            <Select
                                value={formData.exam_question?.toString()}
                                onValueChange={(val) => handleInputChange("exam_question", val ? Number(val) : null)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select question" />
                                </SelectTrigger>
                                <SelectContent>
                                    {questions.map((q) => (
                                        <SelectItem key={q.id} value={q.id?.toString() || ""}>
                                            {q.question_label || `Q${q.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student_exam_code">Student Exam Code *</Label>
                            <Input
                                id="student_exam_code"
                                placeholder="e.g. EXAM-CODE-001"
                                value={formData.student_exam_code}
                                onChange={(e) => handleInputChange("student_exam_code", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="marks_scored">Marks Scored *</Label>
                            <Input
                                id="marks_scored"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 8.5"
                                value={formData.marks_scored ?? ""}
                                onChange={(e) => handleInputChange("marks_scored", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seat_no">Seat No *</Label>
                            <Input
                                id="seat_no"
                                placeholder="e.g. S001"
                                value={formData.seat_no}
                                onChange={(e) => handleInputChange("seat_no", e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exam_question_marks_anonymous">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
