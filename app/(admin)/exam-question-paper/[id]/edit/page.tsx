"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { ExamQuestionPaper } from "@/services/ExamQuestionpaperService";

const mockData: Omit<ExamQuestionPaper, "id"> = {
    exam: 1,
    question_paper: 1,
    paper_selected_for_exam: true,
};

export default function EditExamQuestionPaperPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<ExamQuestionPaper, "id">>(mockData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: number | boolean | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("Updated data for id", id, ":", formData);
            toast.success("Exam question paper updated successfully!");
            router.push("/exam-question-paper");
        } catch {
            toast.error("Failed to update exam question paper.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <Label htmlFor="exam">Exam ID *</Label>
                            <Input
                                id="exam"
                                type="number"
                                placeholder="e.g. 1"
                                value={formData.exam ?? ""}
                                onChange={(e) => handleInputChange("exam", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
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
