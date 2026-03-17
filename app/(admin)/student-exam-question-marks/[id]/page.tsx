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
import { StudentExamQuestionMarkService, type StudentExamQuestionMark } from "@/services/StudentExamQuestionMarkService";
import { ExamQuestionService } from "@/services/ExamQuestionService";
import { StudentService } from "@/services/StudentService";

export default function ViewStudentExamQuestionMarkPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [mark, setMark] = useState<StudentExamQuestionMark | null>(null);
    const [studentName, setStudentName] = useState<string | null>(null);
    const [questionText, setQuestionText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await StudentExamQuestionMarkService.getById(Number(id));
                setMark(data);

                // Fetch details for student and question
                const [studentData, questionData] = await Promise.all([
                    data.student ? StudentService.getById(data.student).catch(() => null) : Promise.resolve(null),
                    data.exam_question ? ExamQuestionService.getById(data.exam_question).catch(() => null) : Promise.resolve(null)
                ]);

                if (studentData) {
                    const name = [studentData.stud_first_name, studentData.stud_last_name].filter(Boolean).join(" ");
                    setStudentName(name || `Student ${studentData.id}`);
                }
                if (questionData) {
                    setQuestionText(questionData.question_label || `Question ${questionData.id}`);
                }

            } catch (error) {
                console.error("Failed to fetch mark details:", error);
                setError("Failed to load the Data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!mark?.id) return;
        if (!window.confirm("Are you sure you want to delete these marks?")) return;
        try {
            await StudentExamQuestionMarkService.delete(mark.id);
            toast.success("Marks deleted successfully");
            router.push("/student-exam-question-marks");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete marks");
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

    if (!mark) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Marks record not found.</p>
                <Link href="/student-exam-question-marks">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/student-exam-question-marks">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Student Marks Details</h1>
                        <p className="text-muted-foreground">
                            ID: {mark.id} | Student: {studentName || "N/A"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <Link href={`/student-exam-question-marks/${id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Marks
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Score Information</CardTitle>
                        <CardDescription>Details of marks obtained</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Marks Scored" value={mark.marks_scored?.toString() || "0"} />
                        <DetailItem label="Student" value={studentName || `ID: ${mark.student}`} />
                        <DetailItem label="Exam Question" value={questionText || `ID: ${mark.exam_question}`} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>Record metadata</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Record ID" value={mark.id?.toString()} />
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