"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
import type { StudentExamQuestionMark } from "@/services/StudentExamQuestionMarkService";

const defaultFormData: Omit<StudentExamQuestionMark, "id"> = {
    exam_question: null,
    student: null,
    marks_scored: null,
};

export default function CreateStudentExamQuestionMarkPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<StudentExamQuestionMark, "id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("Submitted data:", formData);
            toast.success("Student marks created successfully!");
            router.push("/student-exam-question-marks");
        } catch {
            toast.error("Failed to create student marks.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/student-exam-question-marks">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Student Marks</h1>
                    <p className="text-muted-foreground">Record marks scored by a student for an exam question</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Marks Details</CardTitle>
                        <CardDescription>Enter the exam question, student, and marks scored</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam_question">Exam Question ID *</Label>
                            <Input
                                id="exam_question"
                                type="number"
                                placeholder="e.g. 1"
                                value={formData.exam_question ?? ""}
                                onChange={(e) => handleInputChange("exam_question", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
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
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="marks_scored">Marks Scored *</Label>
                            <Input
                                id="marks_scored"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 9.0"
                                value={formData.marks_scored ?? ""}
                                onChange={(e) => handleInputChange("marks_scored", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/student-exam-question-marks">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Student Marks"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
