"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExamOutcomeService, type ExamOutcome } from "@/services/ExamOutcomeService";
import { ExamService } from "@/services/ExamServices";
import { CourseOutcomeService } from "@/services/CourseOutcomeService";

export default function ViewExamOutcomePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [outcome, setOutcome] = useState<ExamOutcome | null>(null);
    const [examDetails, setExamDetails] = useState<string | null>(null);
    const [courseOutcomeCode, setCourseOutcomeCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await ExamOutcomeService.getById(Number(id));
                setOutcome(data);

                // Fetch details for exam and course outcome
                const [examData, courseOutcomeData] = await Promise.all([
                    data.exam ? ExamService.getById(data.exam).catch(() => null) : Promise.resolve(null),
                    data.course_outcome ? CourseOutcomeService.getById(data.course_outcome).catch(() => null) : Promise.resolve(null)
                ]);

                if (examData) {
                    setExamDetails(`Exam ID: ${examData.id} (${examData.exam_date || "N/A"})`);
                }
                if (courseOutcomeData) {
                    setCourseOutcomeCode(courseOutcomeData.outcome_code || `CO ${courseOutcomeData.id}`);
                }

            } catch (error) {
                console.error("Failed to fetch exam outcome details:", error);
                setError("Failed to load the Data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!outcome?.id) return;
        if (!window.confirm("Are you sure you want to delete this exam outcome?")) return;
        try {
            await ExamOutcomeService.delete(outcome.id);
            toast.success("Exam outcome deleted successfully");
            router.push("/exam-outcomes");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete exam outcome");
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
            <div className="p-6 text-center text-red-500 font-medium h-[400px] flex items-center justify-center">
                {error}
            </div>
        );
    }

    if (!outcome) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Exam outcome record not found.</p>
                <Link href="/exam-outcomes">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/exam-outcomes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Exam Outcome Details</h1>
                        <p className="text-muted-foreground">
                            ID: {outcome.id} | Outcome: {courseOutcomeCode || "N/A"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <Link href={`/exam-outcomes/${id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Outcome
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Outcome Information</CardTitle>
                        <CardDescription>Weightage and Target Level</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Exam" value={examDetails || `ID: ${outcome.exam}`} />
                        <DetailItem label="Course Outcome" value={courseOutcomeCode || `ID: ${outcome.course_outcome}`} />
                        <DetailItem label="Weightage" value={outcome.weightage?.toString() || "0"} />
                        <DetailItem label="Target Percentage" value={outcome.target_percentage?.toString() || "0"} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Attainment Metrics</CardTitle>
                        <CardDescription>Analysis of student performance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Percentage Above Cutoff" value={`${outcome.percentage_of_students_above_cutoff || 0}%`} />
                        <DetailItem label="Gap Percentage" value={`${outcome.gap_percentage || 0}%`} />
                        <DetailItem label="Attainment Level Achieved" value={outcome.attainment_level_achieved?.toString() || "0"} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="py-2">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <p className="mt-1 text-base font-medium">{value}</p>
            <Separator className="mt-2" />
        </div>
    );
}