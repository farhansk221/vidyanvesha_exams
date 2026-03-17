"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
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
import { ExamOutcomeService, ExamOutcome } from "@/services/ExamOutcomeService";
import { ExamService, Exam } from "@/services/ExamServices";
import { CourseOutcomeService, CourseOutcome } from "@/services/CourseOutcomeService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EditExamOutcomePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [formData, setFormData] = useState<Omit<ExamOutcome, "id">>({
        exam: null,
        course_outcome: null,
        weightage: null,
        percentage_of_students_above_cutoff: null,
        target_percentage: null,
        gap_percentage: null,
        attainment_level_achieved: null,
    });
    
    const [exams, setExams] = useState<Exam[]>([]);
    const [courseOutcomes, setCourseOutcomes] = useState<CourseOutcome[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [examsRes, outcomesRes] = await Promise.all([
                    ExamService.getAll(),
                    CourseOutcomeService.getAll()
                ]);
                setExams(examsRes || []);
                setCourseOutcomes(outcomesRes || []);
            } catch (err) {
                console.error("Failed to fetch dropdown data:", err);
            } finally {
                setIsLoadingData(false);
            }
        };

        const fetchData = async () => {
            if (isNaN(id)) {
                setError("Invalid ID provided.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await ExamOutcomeService.getById(id);
                setFormData({
                    exam: data.exam,
                    course_outcome: data.course_outcome,
                    weightage: data.weightage,
                    percentage_of_students_above_cutoff: data.percentage_of_students_above_cutoff,
                    target_percentage: data.target_percentage,
                    gap_percentage: data.gap_percentage,
                    attainment_level_achieved: data.attainment_level_achieved,
                });
            } catch (err) {
                console.error("Failed to fetch exam outcome data:", err);
                setError("Failed to load the data. It might not exist or the API is down.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDropdownData();
        fetchData();
    }, [id]);

    const handleInputChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.exam || !formData.course_outcome) {
            toast.error("Please select both an Exam and a Course Outcome");
            return;
        }

        setIsSubmitting(true);
        try {
            await ExamOutcomeService.update(id, formData);
            toast.success("Exam outcome updated successfully!");
            router.push("/exam-outcomes");
        } catch (err) {
            console.error("Update error:", err);
            toast.error("Failed to update exam outcome.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/exam-outcomes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Exam Outcome</h1>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Link href="/exam-outcomes">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam-outcomes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Exam Outcome</h1>
                    <p className="text-muted-foreground">Update exam outcome (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Outcome Details</CardTitle>
                        <CardDescription>Update the mapping and performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam">Exam *</Label>
                            <Select
                                value={formData.exam?.toString() || ""}
                                onValueChange={(value) => handleInputChange("exam", Number(value))}
                                disabled={isLoadingData}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={isLoadingData ? "Loading exams..." : "Select exam"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {exams.length === 0 ? (
                                        <SelectItem value="none" disabled>No exams available</SelectItem>
                                    ) : (
                                        exams.map((exam) => (
                                            <SelectItem key={exam.id} value={exam.id?.toString() || ""}>
                                                ID: {exam.id} - {exam.exam_question_paper_code || "No Code"}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="course_outcome">Course Outcome *</Label>
                            <Select
                                value={formData.course_outcome?.toString() || ""}
                                onValueChange={(value) => handleInputChange("course_outcome", Number(value))}
                                disabled={isLoadingData}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={isLoadingData ? "Loading outcomes..." : "Select outcome"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseOutcomes.length === 0 ? (
                                        <SelectItem value="none" disabled>No outcomes available</SelectItem>
                                    ) : (
                                        courseOutcomes.map((co) => (
                                            <SelectItem key={co.id} value={co.id?.toString() || ""}>
                                                {co.outcome_code}: {co.outcome_description?.substring(0, 40)}...
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weightage">Weightage (0-1) *</Label>
                            <Input
                                id="weightage"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 0.4"
                                value={formData.weightage ?? ""}
                                onChange={(e) => handleInputChange("weightage", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="percentage_of_students_above_cutoff">% Students Above Cutoff</Label>
                            <Input
                                id="percentage_of_students_above_cutoff"
                                type="number"
                                step="0.1"
                                placeholder="e.g. 68.5"
                                value={formData.percentage_of_students_above_cutoff ?? ""}
                                onChange={(e) => handleInputChange("percentage_of_students_above_cutoff", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="target_percentage">Target %</Label>
                            <Input
                                id="target_percentage"
                                type="number"
                                step="0.1"
                                placeholder="e.g. 70.0"
                                value={formData.target_percentage ?? ""}
                                onChange={(e) => handleInputChange("target_percentage", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gap_percentage">Gap %</Label>
                            <Input
                                id="gap_percentage"
                                type="number"
                                step="0.1"
                                placeholder="e.g. 1.5"
                                value={formData.gap_percentage ?? ""}
                                onChange={(e) => handleInputChange("gap_percentage", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attainment_level_achieved">Attainment Level Achieved</Label>
                            <Input
                                id="attainment_level_achieved"
                                type="number"
                                step="0.1"
                                placeholder="e.g. 2.8"
                                value={formData.attainment_level_achieved ?? ""}
                                onChange={(e) => handleInputChange("attainment_level_achieved", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exam-outcomes">
                            <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting || isLoadingData}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : "Update Exam Outcome"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
