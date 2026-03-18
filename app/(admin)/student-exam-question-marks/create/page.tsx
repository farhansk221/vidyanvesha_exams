"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { StudentExamQuestionMarkService, type StudentExamQuestionMark } from "@/services/StudentExamQuestionMarkService";
import { ExamQuestionService, type ExamQuestion } from "@/services/ExamQuestionService";
import { StudentService, type Student } from "@/services/StudentService";

const defaultFormData: Omit<StudentExamQuestionMark, "id"> = {
    exam_question: null,
    student: null,
    marks_scored: null,
};

export default function CreateStudentExamQuestionMarkPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<StudentExamQuestionMark, "id">>(defaultFormData);
    const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                setIsLoadingData(true);
                const [questionsData, studentsData] = await Promise.all([
                    ExamQuestionService.getAll(),
                    StudentService.getAll()
                ]);
                setExamQuestions(questionsData || []);
                setStudents(studentsData || []);

            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to load the Data");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchDropdownData();
    }, []);

    const handleInputChange = (field: keyof typeof formData, value: number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await StudentExamQuestionMarkService.create(formData);
            toast.success("Student marks created successfully!");
            router.push("/student-exam-question-marks");
        } catch {
            toast.error("Failed to create student marks.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/student-exam-question-marks">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Student Marks</h1>
                    <p className="text-muted-foreground">Record marks scored by a student for an exam question</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Marks Details</CardTitle>
                        <CardDescription>Enter the exam question, student, and marks scored</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam_question">Exam Question *</Label>
                            <Select
                                value={formData.exam_question?.toString()}
                                onValueChange={(val) => handleInputChange("exam_question", Number(val))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Question" />
                                </SelectTrigger>
                                <SelectContent>
                                    {examQuestions.map((q) => (
                                        <SelectItem key={q.id} value={q.id?.toString() || ""}>
                                            {q.question_label || `Question ${q.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student">Student *</Label>
                            <Select
                                value={formData.student?.toString()}
                                onValueChange={(val) => handleInputChange("student", Number(val))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem key={s.id} value={s.id?.toString() || ""}>
                                            {[s.stud_first_name, s.stud_last_name].filter(Boolean).join(" ") || `Student ${s.id}`} ({s.enrollment_no || "No Enroll"})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="marks_scored">Marks Scored *</Label>
                            <Input
                                id="marks_scored"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 9.0"
                                value={formData.marks_scored ?? ""}
                                onChange={(e) => handleInputChange("marks_scored", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/student-exam-question-marks">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Student Marks"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
