"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ExamService, type Exam, type Program, type ProgramRevision, type Course } from "@/services/ExamServices";
import { ExamSessionService, type ExamSession } from "@/services/ExamSessionServices";

const mockExam: Omit<Exam, "id"> = {
    exam_session: null,
    stud_class: 101,
    prog: 10,
    prog_rev: 3,
    institute_rev: 1,
    institute_prog: 5,
    course_sem: 6,
    course: 2001,
    direct_or_indirect: "Direct",
    exam_category: 2,
    total_marks: 100,
    passing_marks: 40,
    exam_duration: 120,
    question_wise: true,
    pattern: "Theory",
    question_paper_needed: true,
    no_of_question_paper_needed: 1,
    freeze_question_paper_flag: false,
    exam_questions_freeze: false,
    exam_questions_freeze_dt: null,
    exam_date: "2026-05-10",
    exam_question_paper_code: "QP-CS-2026-001",
    exam_start_time: "10:00",
    student_approval_needed: false,
    freeze_student_list_flag: false,
    teaching_staff_assigned: 501,
    external_staff_assigned: null,
    external_staff_manual: null,
    grace_marks_flag: false,
    grace_marks: 0,
    penalty_applicable: false,
    keep_marks_anonymous: false,
    freeze_marks: false,
};

export default function EditExamPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<Exam, "id">>(mockExam);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [sessions, setSessions] = useState<ExamSession[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [revisions, setRevisions] = useState<ProgramRevision[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const [examData, sessionsData, programsData, revisionsData, coursesData] = await Promise.all([
                    ExamService.getById(Number(id)),
                    ExamSessionService.getAll().catch(() => ({ results: [] })),
                    ExamService.getPrograms().catch(() => []),
                    ExamService.getProgramRevisions().catch(() => []),
                    ExamService.getCourses().catch(() => [])
                ]);
                const { id: _, ...rest } = examData;
                setFormData(rest as Omit<Exam, "id">);
                setSessions(sessionsData.results || []);
                setPrograms(programsData);
                setRevisions(revisionsData);
                setCourses(coursesData);
            } catch (err) {
                console.error("Failed to load edit data", err);
                toast.error("Failed to load exam details for editing");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const handleInputChange = (field: keyof typeof formData, value: string | number | boolean | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ExamService.update(Number(id), formData);
            toast.success("Exam updated successfully!");
            router.push("/exams");
        } catch {
            toast.error("Failed to update exam.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-muted-foreground animate-pulse">Loading exam details...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Exam</h1>
                    <p className="text-muted-foreground">Update the details of exam (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Session & Program Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Session &amp; Program Info</CardTitle>
                        <CardDescription>Update session, program, and course links</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam_session">Exam Session ID *</Label>
                            <Select
                                value={formData.exam_session ? String(formData.exam_session) : ""}
                                onValueChange={(val) => handleInputChange("exam_session", Number(val))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an exam session" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sessions.map((session) => (
                                        <SelectItem key={session.id} value={String(session.id)}>
                                            {session.exam_session_name || `Session ${session.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stud_class">Student Class ID</Label>
                            <Input
                                id="stud_class"
                                type="number"
                                placeholder="e.g. 101"
                                value={formData.stud_class ?? ""}
                                onChange={(e) => handleInputChange("stud_class", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prog">Program</Label>
                            <Select
                                value={formData.prog ? String(formData.prog) : ""}
                                onValueChange={(val) => handleInputChange("prog", Number(val))}
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
                        <div className="space-y-2">
                            <Label htmlFor="prog_rev">Program Revision</Label>
                            <Select
                                value={formData.prog_rev ? String(formData.prog_rev) : ""}
                                onValueChange={(val) => handleInputChange("prog_rev", Number(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a revision" />
                                </SelectTrigger>
                                <SelectContent>
                                    {revisions.map((rev) => (
                                        <SelectItem key={rev.id} value={String(rev.id)}>
                                            {rev.prog_rev_name || `Revision ${rev.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="institute_rev">Institute Revision</Label>
                            <Input
                                id="institute_rev"
                                type="number"
                                placeholder="e.g. 1"
                                value={formData.institute_rev ?? ""}
                                onChange={(e) => handleInputChange("institute_rev", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="institute_prog">Institute Program ID</Label>
                            <Input
                                id="institute_prog"
                                type="number"
                                placeholder="e.g. 5"
                                value={formData.institute_prog ?? ""}
                                onChange={(e) => handleInputChange("institute_prog", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course_sem">Course Semester</Label>
                            <Input
                                id="course_sem"
                                type="number"
                                placeholder="e.g. 6"
                                value={formData.course_sem ?? ""}
                                onChange={(e) => handleInputChange("course_sem", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course">Course</Label>
                            <Select
                                value={formData.course ? String(formData.course) : ""}
                                onValueChange={(val) => handleInputChange("course", Number(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={String(course.id)}>
                                            {course.course_name || `Course ${course.id}`} ({course.course_code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Exam Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Details</CardTitle>
                        <CardDescription>Update exam type, marks, and schedule</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="direct_or_indirect">Direct or Indirect</Label>
                            <Input
                                id="direct_or_indirect"
                                placeholder="e.g. Direct"
                                value={formData.direct_or_indirect}
                                onChange={(e) => handleInputChange("direct_or_indirect", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_category">Exam Category ID</Label>
                            <Input
                                id="exam_category"
                                type="number"
                                placeholder="e.g. 2"
                                value={formData.exam_category ?? ""}
                                onChange={(e) => handleInputChange("exam_category", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="total_marks">Total Marks *</Label>
                            <Input
                                id="total_marks"
                                type="number"
                                placeholder="e.g. 100"
                                value={formData.total_marks ?? ""}
                                onChange={(e) => handleInputChange("total_marks", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passing_marks">Passing Marks *</Label>
                            <Input
                                id="passing_marks"
                                type="number"
                                placeholder="e.g. 40"
                                value={formData.passing_marks ?? ""}
                                onChange={(e) => handleInputChange("passing_marks", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_duration">Exam Duration (minutes)</Label>
                            <Input
                                id="exam_duration"
                                type="number"
                                placeholder="e.g. 120"
                                value={formData.exam_duration ?? ""}
                                onChange={(e) => handleInputChange("exam_duration", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pattern">Pattern</Label>
                            <Input
                                id="pattern"
                                placeholder="e.g. Theory"
                                value={formData.pattern}
                                onChange={(e) => handleInputChange("pattern", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_date">Exam Date *</Label>
                            <Input
                                id="exam_date"
                                type="date"
                                value={formData.exam_date}
                                onChange={(e) => handleInputChange("exam_date", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_start_time">Exam Start Time</Label>
                            <Input
                                id="exam_start_time"
                                type="time"
                                value={formData.exam_start_time}
                                onChange={(e) => handleInputChange("exam_start_time", e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="question_wise">Question Wise</Label>
                                <p className="text-sm text-muted-foreground">Evaluate question by question?</p>
                            </div>
                            <Switch
                                id="question_wise"
                                checked={formData.question_wise}
                                onCheckedChange={(checked) => handleInputChange("question_wise", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Question Paper Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Question Paper Settings</CardTitle>
                        <CardDescription>Update question paper requirements and freezing</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="question_paper_needed">Question Paper Needed</Label>
                                <p className="text-sm text-muted-foreground">Does this exam require a question paper?</p>
                            </div>
                            <Switch
                                id="question_paper_needed"
                                checked={formData.question_paper_needed}
                                onCheckedChange={(checked) => handleInputChange("question_paper_needed", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="no_of_question_paper_needed">No. of Question Papers</Label>
                            <Input
                                id="no_of_question_paper_needed"
                                type="number"
                                placeholder="e.g. 1"
                                value={formData.no_of_question_paper_needed ?? ""}
                                onChange={(e) => handleInputChange("no_of_question_paper_needed", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_question_paper_code">Question Paper Code</Label>
                            <Input
                                id="exam_question_paper_code"
                                placeholder="e.g. QP-CS-2026-001"
                                value={formData.exam_question_paper_code}
                                onChange={(e) => handleInputChange("exam_question_paper_code", e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="freeze_question_paper_flag">Freeze Question Paper</Label>
                                <p className="text-sm text-muted-foreground">Lock the question paper from changes?</p>
                            </div>
                            <Switch
                                id="freeze_question_paper_flag"
                                checked={formData.freeze_question_paper_flag}
                                onCheckedChange={(checked) => handleInputChange("freeze_question_paper_flag", checked)}
                            />
                        </div>

                        <Separator className="md:col-span-2" />

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="exam_questions_freeze">Freeze Exam Questions</Label>
                                <p className="text-sm text-muted-foreground">Lock exam questions from further edits?</p>
                            </div>
                            <Switch
                                id="exam_questions_freeze"
                                checked={formData.exam_questions_freeze}
                                onCheckedChange={(checked) => handleInputChange("exam_questions_freeze", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_questions_freeze_dt">Questions Freeze Date</Label>
                            <Input
                                id="exam_questions_freeze_dt"
                                type="date"
                                value={formData.exam_questions_freeze_dt ?? ""}
                                onChange={(e) => handleInputChange("exam_questions_freeze_dt", e.target.value || null)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Staff & Students */}
                <Card>
                    <CardHeader>
                        <CardTitle>Staff &amp; Students</CardTitle>
                        <CardDescription>Update staff assignments and student settings</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="teaching_staff_assigned">Teaching Staff ID</Label>
                            <Input
                                id="teaching_staff_assigned"
                                type="number"
                                placeholder="e.g. 501"
                                value={formData.teaching_staff_assigned ?? ""}
                                onChange={(e) => handleInputChange("teaching_staff_assigned", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="external_staff_assigned">External Staff ID</Label>
                            <Input
                                id="external_staff_assigned"
                                type="number"
                                placeholder="External staff ID"
                                value={formData.external_staff_assigned ?? ""}
                                onChange={(e) => handleInputChange("external_staff_assigned", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="external_staff_manual">External Staff (Manual Entry)</Label>
                            <Input
                                id="external_staff_manual"
                                placeholder="Enter external staff name manually"
                                value={formData.external_staff_manual ?? ""}
                                onChange={(e) => handleInputChange("external_staff_manual", e.target.value || null)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="student_approval_needed">Student Approval Needed</Label>
                                <p className="text-sm text-muted-foreground">Require approval for student list?</p>
                            </div>
                            <Switch
                                id="student_approval_needed"
                                checked={formData.student_approval_needed}
                                onCheckedChange={(checked) => handleInputChange("student_approval_needed", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="freeze_student_list_flag">Freeze Student List</Label>
                                <p className="text-sm text-muted-foreground">Lock the student list from changes?</p>
                            </div>
                            <Switch
                                id="freeze_student_list_flag"
                                checked={formData.freeze_student_list_flag}
                                onCheckedChange={(checked) => handleInputChange("freeze_student_list_flag", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Marks & Penalties */}
                <Card>
                    <CardHeader>
                        <CardTitle>Marks &amp; Penalties</CardTitle>
                        <CardDescription>Update grace marks, penalties, and mark settings</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="grace_marks_flag">Grace Marks</Label>
                                <p className="text-sm text-muted-foreground">Allow grace marks for this exam?</p>
                            </div>
                            <Switch
                                id="grace_marks_flag"
                                checked={formData.grace_marks_flag}
                                onCheckedChange={(checked) => handleInputChange("grace_marks_flag", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grace_marks">Grace Marks Value</Label>
                            <Input
                                id="grace_marks"
                                type="number"
                                placeholder="e.g. 0"
                                value={formData.grace_marks}
                                onChange={(e) => handleInputChange("grace_marks", Number(e.target.value))}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="penalty_applicable">Penalty Applicable</Label>
                                <p className="text-sm text-muted-foreground">Are penalties applicable?</p>
                            </div>
                            <Switch
                                id="penalty_applicable"
                                checked={formData.penalty_applicable}
                                onCheckedChange={(checked) => handleInputChange("penalty_applicable", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="keep_marks_anonymous">Keep Marks Anonymous</Label>
                                <p className="text-sm text-muted-foreground">Keep marks anonymous during evaluation?</p>
                            </div>
                            <Switch
                                id="keep_marks_anonymous"
                                checked={formData.keep_marks_anonymous}
                                onCheckedChange={(checked) => handleInputChange("keep_marks_anonymous", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="freeze_marks">Freeze Marks</Label>
                                <p className="text-sm text-muted-foreground">Lock marks from further changes?</p>
                            </div>
                            <Switch
                                id="freeze_marks"
                                checked={formData.freeze_marks}
                                onCheckedChange={(checked) => handleInputChange("freeze_marks", checked)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exams">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Exam"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
