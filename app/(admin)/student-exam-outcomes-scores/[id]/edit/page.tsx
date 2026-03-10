"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import type { StudentExamOutcomeScore } from "@/services/StudentExamOutcomeScoreService";

const mockData: Omit<StudentExamOutcomeScore, "id"> = {
    exam_question_outcome: 1,
    student: 10001,
    score: 2.4,
    out_of: 3.0,
};

export default function EditStudentExamOutcomeScorePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<StudentExamOutcomeScore, "id">>(mockData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("Updated data for id", id, ":", formData);
            toast.success("Student outcome score updated successfully!");
            router.push("/student-exam-outcomes-scores");
        } catch {
            toast.error("Failed to update student outcome score.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/student-exam-outcomes-scores">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Student Outcome Score</h1>
                    <p className="text-muted-foreground">Update student outcome score (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Score Details</CardTitle>
                        <CardDescription>Update the exam question outcome, student, score, and maximum</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam_question_outcome">Exam Question Outcome ID *</Label>
                            <Input
                                id="exam_question_outcome"
                                type="number"
                                placeholder="e.g. 1"
                                value={formData.exam_question_outcome ?? ""}
                                onChange={(e) => handleInputChange("exam_question_outcome", e.target.value ? Number(e.target.value) : null)}
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
                        <Link href="/student-exam-outcomes-scores">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Outcome Score"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
