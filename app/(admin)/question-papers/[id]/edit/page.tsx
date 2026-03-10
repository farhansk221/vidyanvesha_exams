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
import type { QuestionPaper } from "@/services/QuestionPaperService";

const mockData: Omit<QuestionPaper, "id"> = {
    qp_name: "Data Structures End Sem 2026",
    qp_code: "QP-DS-2026-001",
    qp_desc: "End semester question paper",
    qp_pattern: "Theory",
    qp_total_marks: 100,
    qp_passing_marks: 40,
    is_final: true,
    qp_pdf: null,
};

export default function EditQuestionPaperPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<QuestionPaper, "id">>(mockData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: string | number | boolean | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("Updated data for id", id, ":", formData);
            toast.success("Question paper updated successfully!");
            router.push("/question-papers");
        } catch {
            toast.error("Failed to update question paper.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/question-papers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Question Paper</h1>
                    <p className="text-muted-foreground">Update question paper (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Question Paper Details</CardTitle>
                        <CardDescription>Update the name, code, pattern, and marks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="qp_name">Name *</Label>
                            <Input
                                id="qp_name"
                                placeholder="e.g. Data Structures End Sem 2026"
                                value={formData.qp_name}
                                onChange={(e) => handleInputChange("qp_name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qp_code">Code *</Label>
                            <Input
                                id="qp_code"
                                placeholder="e.g. QP-DS-2026-001"
                                value={formData.qp_code}
                                onChange={(e) => handleInputChange("qp_code", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="qp_desc">Description</Label>
                            <Input
                                id="qp_desc"
                                placeholder="e.g. End semester question paper"
                                value={formData.qp_desc}
                                onChange={(e) => handleInputChange("qp_desc", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qp_pattern">Pattern</Label>
                            <Input
                                id="qp_pattern"
                                placeholder="e.g. Theory"
                                value={formData.qp_pattern}
                                onChange={(e) => handleInputChange("qp_pattern", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qp_total_marks">Total Marks *</Label>
                            <Input
                                id="qp_total_marks"
                                type="number"
                                placeholder="e.g. 100"
                                value={formData.qp_total_marks ?? ""}
                                onChange={(e) => handleInputChange("qp_total_marks", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qp_passing_marks">Passing Marks *</Label>
                            <Input
                                id="qp_passing_marks"
                                type="number"
                                placeholder="e.g. 40"
                                value={formData.qp_passing_marks ?? ""}
                                onChange={(e) => handleInputChange("qp_passing_marks", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qp_pdf">PDF URL</Label>
                            <Input
                                id="qp_pdf"
                                placeholder="PDF file URL (optional)"
                                value={formData.qp_pdf ?? ""}
                                onChange={(e) => handleInputChange("qp_pdf", e.target.value || null)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="is_final">Is Final</Label>
                                <p className="text-sm text-muted-foreground">Mark this question paper as final?</p>
                            </div>
                            <Switch
                                id="is_final"
                                checked={formData.is_final}
                                onCheckedChange={(checked) => handleInputChange("is_final", checked)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/question-papers">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Question Paper"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
