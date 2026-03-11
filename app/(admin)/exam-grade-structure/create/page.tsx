"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ExamGradeStructureService, type ExamGradeStructure, type Program } from "@/services/ExamGradeStructureService";

const defaultFormData: Omit<ExamGradeStructure, "id"> = {
    min_marks: null,
    max_marks: null,
    grade: "",
    grade_point: null,
    passing_grade_flag: false,
    failing_grade_flag: false,
    description: "",
    program: null,
};

export default function CreateExamGradeStructurePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<ExamGradeStructure, "id">>(defaultFormData);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await ExamGradeStructureService.getPrograms();
                setPrograms(data);
            } catch (error) {
                console.error("Failed to fetch programs:", error);
                toast.error("Failed to load programs for dropdown");
            }
        };
        fetchPrograms();
    }, []);

    const handleInputChange = (field: keyof typeof formData, value: string | number | boolean | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ExamGradeStructureService.create(formData);
            toast.success("Grade structure created successfully!");
            router.push("/exam-grade-structure");
        } catch {
            toast.error("Failed to create grade structure.");
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
                    <h1 className="text-2xl font-bold tracking-tight">Create Grade Structure</h1>
                    <p className="text-muted-foreground">Define a new grade range for the exam grading system</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Details</CardTitle>
                        <CardDescription>Set the marks range, grade, grade point, and description</CardDescription>
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
                            <Label htmlFor="program">Program</Label>
                            <Select
                                value={formData.program ? String(formData.program) : ""}
                                onValueChange={(val) => handleInputChange("program", Number(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((prog) => (
                                        <SelectItem key={prog.id} value={String(prog.id)}>
                                            {prog.prog_name || `Program ${prog.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Grade Flags</CardTitle>
                        <CardDescription>Configure passing and failing grade indicators</CardDescription>
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
                            {isSubmitting ? "Creating..." : "Create Grade Structure"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
