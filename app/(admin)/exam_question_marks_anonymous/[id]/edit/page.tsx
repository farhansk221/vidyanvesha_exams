"use client";

import { useState, useEffect } from "react";
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

export default function EditAnonymousMarksPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<ExamQuestionMarksAnonymous, "id">>(defaultFormData);
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [qdata, rec] = await Promise.all([
                    ExamQuestionService.getAll().catch(() => []),
                    ExamQuestionMarksAnonymousService.getById(Number(id)),
                ]);
                setQuestions(qdata || []);
                const { id: _ignored, ...rest } = rec;
                setFormData(rest);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load the Data");
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleInputChange = (field: keyof typeof formData, value: string | number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ExamQuestionMarksAnonymousService.update(Number(id), formData as any);
            toast.success("Record updated successfully!");
            router.push("/exam_question_marks_anonymous");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update record.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                    <h1 className="text-2xl font-bold tracking-tight">Edit Anonymous Mark</h1>
                    <p className="text-muted-foreground">ID: {id}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Marks Details</CardTitle>
                        <CardDescription>Update the values as needed</CardDescription>
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
                            {isSubmitting ? "Updating..." : "Update"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
