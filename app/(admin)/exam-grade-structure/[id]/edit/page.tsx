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
import type { ExamGradeStructure } from "@/services/ExamGradeStructureService";

const mockData: Omit<ExamGradeStructure, "id"> = {
    min_marks: 75,
    max_marks: 100,
    grade: "A",
    grade_point: 9.0,
    passing_grade_flag: true,
    failing_grade_flag: false,
    description: "Excellent",
    program: 10,
};

export default function EditExamGradeStructurePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<ExamGradeStructure, "id">>(mockData);
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
            toast.success("Grade structure updated successfully!");
            router.push("/exam-grade-structure");
        } catch {
            toast.error("Failed to update grade structure.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam-grade-structure">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Grade Structure</h1>
                    <p className="text-muted-foreground">Update grade structure (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Details</CardTitle>
                        <CardDescription>Update the marks range, grade, grade point, and description</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="min_marks">Min Marks *</Label>
                            <Input
                                id="min_marks"
                                type="number"
                                placeholder="e.g. 75"
                                value={formData.min_marks ?? ""}
                                onChange={(e) => handleInputChange("min_marks", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="max_marks">Max Marks *</Label>
                            <Input
                                id="max_marks"
                                type="number"
                                placeholder="e.g. 100"
                                value={formData.max_marks ?? ""}
                                onChange={(e) => handleInputChange("max_marks", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grade">Grade *</Label>
                            <Input
                                id="grade"
                                placeholder="e.g. A"
                                value={formData.grade}
                                onChange={(e) => handleInputChange("grade", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grade_point">Grade Point *</Label>
                            <Input
                                id="grade_point"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 9.0"
                                value={formData.grade_point ?? ""}
                                onChange={(e) => handleInputChange("grade_point", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="e.g. Excellent"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="program">Program ID</Label>
                            <Input
                                id="program"
                                type="number"
                                placeholder="e.g. 10"
                                value={formData.program ?? ""}
                                onChange={(e) => handleInputChange("program", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Grade Flags</CardTitle>
                        <CardDescription>Update passing and failing grade indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="passing_grade_flag">Passing Grade</Label>
                                <p className="text-sm text-muted-foreground">Is this a passing grade?</p>
                            </div>
                            <Switch
                                id="passing_grade_flag"
                                checked={formData.passing_grade_flag}
                                onCheckedChange={(checked) => handleInputChange("passing_grade_flag", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="failing_grade_flag">Failing Grade</Label>
                                <p className="text-sm text-muted-foreground">Is this a failing grade?</p>
                            </div>
                            <Switch
                                id="failing_grade_flag"
                                checked={formData.failing_grade_flag}
                                onCheckedChange={(checked) => handleInputChange("failing_grade_flag", checked)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exam-grade-structure">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Grade Structure"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
