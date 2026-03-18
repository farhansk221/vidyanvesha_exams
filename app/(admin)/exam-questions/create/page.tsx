"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ExamQuestionService, type ExamQuestion, type Question } from "@/services/ExamQuestionService";
import { ExamService, type Exam } from "@/services/ExamServices";
import { ExamSessionService } from "@/services/ExamSessionServices";

const defaultFormData: Omit<ExamQuestion, "id"> = {
    exam: null,
    question: null,
    question_label: "",
    question_sequence: null,
    max_marks: null,
    marking_synoptic: "",
    students_attempted_count: 0,
    students_above_cutoff_count: 0,
    percentage_of_students_above_cutoff: 0,
};

export default function CreateExamQuestionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<ExamQuestion, "id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [sessionsMap, setSessionsMap] = useState<Record<number, string>>({});
    const [programsMap, setProgramsMap] = useState<Record<number, string>>({});
    const [coursesMap, setCoursesMap] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [qData, eData, sData, pData, cData] = await Promise.all([
                    ExamQuestionService.getQuestions().catch(() => []),
                    ExamService.getAll().catch(() => []),
                    ExamSessionService.getAll().catch(() => []),
                    ExamService.getPrograms().catch(() => []),
                    ExamService.getCourses().catch(() => [])
                ]);

                setQuestions(qData);
                setExams(eData || []);

                const sMap: Record<number, string> = {};
                (sData || []).forEach((s) => { sMap[s.id as number] = s.exam_session_name || `Session ${s.id}`; });
                setSessionsMap(sMap);

                const pMap: Record<number, string> = {};
                pData.forEach((p) => { pMap[p.id] = p.prog_name || `Program ${p.id}`; });
                setProgramsMap(pMap);

                const cMap: Record<number, string> = {};
                cData.forEach((c) => { cMap[c.id] = c.course_name || `Course ${c.id}`; });
                setCoursesMap(cMap);

            } catch (error) {
                console.error("Error fetching dropdowns:", error);
                toast.error("Failed to load options");
            }
        };

        fetchDropdownData();
    }, []);

    const handleSelectChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value === "none" ? null : Number(value) }));
    };

    const handleInputChange = (field: keyof typeof formData, value: string | number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ExamQuestionService.create(formData);
            toast.success("Exam question created successfully!");
            router.push("/exam-questions");
        } catch (error: any) {
            console.error("Error creating exam question:", error);
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
                    errorData.non_field_errors.forEach((msg: string) => toast.error(msg));
                } else if (typeof errorData === 'object') {
                    Object.keys(errorData).forEach(key => {
                        const messages = errorData[key];
                        if (Array.isArray(messages)) {
                            messages.forEach((msg: string) => toast.error(`${key}: ${msg}`));
                        } else {
                            toast.error(`${key}: ${messages}`);
                        }
                    });
                } else {
                    toast.error("Failed to create exam question.");
                }
            } else {
                toast.error("Failed to create exam question.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam-questions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Exam Question</h1>
                    <p className="text-muted-foreground">Fill in the details to add a new exam question</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Question Details</CardTitle>
                        <CardDescription>Link the question to an exam and configure its properties</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam">Exam *</Label>
                            <Select
                                value={formData.exam ? String(formData.exam) : undefined}
                                onValueChange={(val) => handleSelectChange("exam", val)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an Exam" />
                                </SelectTrigger>
                                <SelectContent>
                                    {exams.map((exam) => {
                                        const progName = exam.prog ? programsMap[exam.prog] || `Prog ${exam.prog}` : "";
                                        const sessionName = exam.exam_session ? sessionsMap[exam.exam_session] || `Session ${exam.exam_session}` : "";
                                        const className = exam.stud_class || "";
                                        const courseName = exam.course ? coursesMap[exam.course] || `Course ${exam.course}` : "";
                                        const assessType = exam.direct_or_indirect || "";
                                        const categoryName = exam.exam_category || "";
                                        const durationName = exam.exam_duration || "None";

                                        const label = [progName, sessionName, className, courseName, assessType, categoryName, durationName].filter(Boolean).join(" - ") || `Exam ${exam.id}`;

                                        return (
                                            <SelectItem key={exam.id} value={String(exam.id)}>
                                                {label}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question">Question ID *</Label>
                            <Input
                                id="question"
                                type="number"
                                placeholder="e.g. 101"
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
                        <div className="space-y-2">
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
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="marking_synoptic">Marking Synoptic</Label>
                            <Input
                                id="marking_synoptic"
                                placeholder="e.g. Define and explain with example"
                                value={formData.marking_synoptic}
                                onChange={(e) => handleInputChange("marking_synoptic", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription>Student attempt and cutoff statistics (auto-computed when backend is ready)</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="students_attempted_count">Students Attempted</Label>
                            <Input
                                id="students_attempted_count"
                                type="number"
                                placeholder="0"
                                value={formData.students_attempted_count}
                                onChange={(e) => handleInputChange("students_attempted_count", Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="students_above_cutoff_count">Students Above Cutoff</Label>
                            <Input
                                id="students_above_cutoff_count"
                                type="number"
                                placeholder="0"
                                value={formData.students_above_cutoff_count}
                                onChange={(e) => handleInputChange("students_above_cutoff_count", Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="percentage_of_students_above_cutoff">% Above Cutoff</Label>
                            <Input
                                id="percentage_of_students_above_cutoff"
                                type="number"
                                placeholder="0"
                                value={formData.percentage_of_students_above_cutoff}
                                onChange={(e) => handleInputChange("percentage_of_students_above_cutoff", Number(e.target.value))}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exam-questions">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Exam Question"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
