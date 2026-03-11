"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

const mockExamQuestion: Omit<ExamQuestion, "id"> = {
    exam: 1,
    question: 9001,
    question_label: "Q1",
    question_sequence: 1,
    max_marks: 10,
    marking_synoptic: "Define and explain with example",
    students_attempted_count: 0,
    students_above_cutoff_count: 0,
    percentage_of_students_above_cutoff: 0,
};

export default function EditExamQuestionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<ExamQuestion, "id">>(mockExamQuestion);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [sessionsMap, setSessionsMap] = useState<Record<number, string>>({});
    const [programsMap, setProgramsMap] = useState<Record<number, string>>({});
    const [coursesMap, setCoursesMap] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoadingData(true);
                const [eqDetails, qData, eData, sData, pData, cData] = await Promise.all([
                    ExamQuestionService.getById(Number(id)),
                    ExamQuestionService.getQuestions().catch(() => []),
                    ExamService.getAll().catch(() => ({ results: [] })),
                    ExamSessionService.getAll().catch(() => ({ results: [] })),
                    ExamService.getPrograms().catch(() => []),
                    ExamService.getCourses().catch(() => [])
                ]);

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _, ...restEqDetails } = eqDetails as any;
                setFormData(restEqDetails);

                setQuestions(qData);
                setExams(eData.results || []);

                const sMap: Record<number, string> = {};
                (sData.results || []).forEach((s) => { sMap[s.id as number] = s.exam_session_name || `Session ${s.id}`; });
                setSessionsMap(sMap);

                const pMap: Record<number, string> = {};
                pData.forEach((p) => { pMap[p.id] = p.prog_name || `Program ${p.id}`; });
                setProgramsMap(pMap);

                const cMap: Record<number, string> = {};
                cData.forEach((c) => { cMap[c.id] = c.course_name || `Course ${c.id}`; });
                setCoursesMap(cMap);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load question details or options");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) {
            fetchAllData();
        }
    }, [id]);

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
            await ExamQuestionService.update(Number(id), formData);
            toast.success("Exam question updated successfully!");
            router.push("/exam-questions");
        } catch {
            toast.error("Failed to update exam question.");
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
                    <h1 className="text-2xl font-bold tracking-tight">Edit Exam Question</h1>
                    <p className="text-muted-foreground">Update the details of exam question (ID: {id})</p>
                </div>
            </div>

            {isLoadingData ? (
                <div className="flex justify-center p-8">
                    <p className="text-muted-foreground">Loading details...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Question Details</CardTitle>
                        <CardDescription>Update the question link and properties</CardDescription>
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
                        <CardDescription>Student attempt and cutoff statistics</CardDescription>
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
                            {isSubmitting ? "Updating..." : "Update Exam Question"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
            )}
        </div>
    );
}
