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
import type { QuestionPaperQuestion } from "@/services/QuestionPaperQuestionService";

const mockData: Omit<QuestionPaperQuestion, "id"> = {
    question_paper: 1,
    question: 9001,
    question_label: "Q1",
    question_sequence: 1,
    max_marks: 10,
};

export default function EditQuestionPaperQuestionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<QuestionPaperQuestion, "id">>(mockData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: string | number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("Updated data for id", id, ":", formData);
            toast.success("Question paper question updated successfully!");
            router.push("/question-paper-questions");
        } catch {
            toast.error("Failed to update question paper question.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/question-paper-questions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Question</h1>
                    <p className="text-muted-foreground">Update question paper question (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Question Details</CardTitle>
                        <CardDescription>Update the question paper link, sequence, and marks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="question_paper">Question Paper ID *</Label>
                            <Input
                                id="question_paper"
                                type="number"
                                placeholder="e.g. 1"
                                value={formData.question_paper ?? ""}
                                onChange={(e) => handleInputChange("question_paper", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question">Question ID *</Label>
                            <Input
                                id="question"
                                type="number"
                                placeholder="e.g. 9001"
                                value={formData.question ?? ""}
                                onChange={(e) => handleInputChange("question", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
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
                            {isSubmitting ? "Updating..." : "Update Question"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
