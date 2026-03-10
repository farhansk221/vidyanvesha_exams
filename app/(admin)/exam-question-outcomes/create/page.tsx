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
import type { ExamQuestionOutcome } from "@/services/ExamQuestionOutcome";

const defaultFormData: Omit<ExamQuestionOutcome, "id"> = {
    exam_question: null,
    outcome: null,
    weightage: null,
};

export default function CreateExamQuestionOutcomePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<ExamQuestionOutcome, "id">>(defaultFormData);
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
            toast.success("Exam question outcome created successfully!");
            router.push("/exam-question-outcomes");
        } catch {
            toast.error("Failed to create exam question outcome.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam-question-outcomes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Exam Question Outcome</h1>
                    <p className="text-muted-foreground">Map an outcome to an exam question with a weightage</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Outcome Details</CardTitle>
                        <CardDescription>Enter the exam question, outcome, and weightage</CardDescription>
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
                            <Label htmlFor="outcome">Outcome ID *</Label>
                            <Input
                                id="outcome"
                                type="number"
                                placeholder="e.g. 3001"
                                value={formData.outcome ?? ""}
                                onChange={(e) => handleInputChange("outcome", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="weightage">Weightage *</Label>
                            <Input
                                id="weightage"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 0.25"
                                value={formData.weightage ?? ""}
                                onChange={(e) => handleInputChange("weightage", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exam-question-outcomes">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Exam Question Outcome"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
