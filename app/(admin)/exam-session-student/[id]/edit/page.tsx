"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { ExamSessionStudentService, type ExamSessionStudent } from "@/services/ExamSessionStudentService";
import { ExamSessionService, type ExamSession } from "@/services/ExamSessionServices";
import { StudentService, type Student } from "@/services/StudentService";
import { ExamService } from "@/services/ExamServices";

export default function EditExamSessionStudentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<ExamSessionStudent, "id"> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [item, sessions, studentsData, programsData] = await Promise.all([
                    ExamSessionStudentService.getById(Number(id)),
                    ExamSessionService.getAll().catch(() => []),
                    StudentService.getAll().catch(() => []),
                    ExamService.getPrograms().catch(() => [])
                ]);

                // Omit 'id' from the item to match formData type
                const { id: _, ...data } = item as any;
                setFormData(data);
                setExamSessions(sessions);
                setStudents(studentsData);
                setPrograms(programsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load details");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (field: keyof Omit<ExamSessionStudent, "id">, value: any) => {
        setFormData((prev) => prev ? ({ ...prev, [field]: value }) : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        if (!formData.exam_session || !formData.student) {
            toast.error("Please select both an exam session and a student");
            return;
        }

        setIsSubmitting(true);
        try {
            await ExamSessionStudentService.update(Number(id), formData);
            toast.success("Student enrollment updated successfully!");
            router.push("/exam-session-student");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update enrollment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!formData) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Enrollment not found.</p>
                <Link href="/exam-session-student">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam-session-student">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Exam Session Student</h1>
                    <p className="text-muted-foreground">Update exam session enrollment (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student &amp; Session Info</CardTitle>
                        <CardDescription>Update student, session, program, and semester details</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam_session">Exam Session *</Label>
                            <Select
                                value={formData.exam_session?.toString() || ""}
                                onValueChange={(value) => handleInputChange("exam_session", Number(value))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Session" />
                                </SelectTrigger>
                                <SelectContent>
                                    {examSessions.map((s) => (
                                        <SelectItem key={s.id} value={s.id!.toString()}>
                                            {s.exam_session_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student">Student *</Label>
                            <Select
                                value={formData.student?.toString() || ""}
                                onValueChange={(value) => handleInputChange("student", Number(value))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem key={s.id} value={s.id!.toString()}>
                                            Student {s.student}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="program">Program</Label>
                            <Select
                                value={formData.program?.toString() || ""}
                                onValueChange={(value) => handleInputChange("program", Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((p) => (
                                        <SelectItem key={p.id} value={p.id!.toString()}>
                                            {p.prog_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Input
                                id="semester"
                                type="number"
                                placeholder="e.g. 6"
                                value={formData.semester ?? ""}
                                onChange={(e) => handleInputChange("semester", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="approval_status">Approval Status</Label>
                            <Input
                                id="approval_status"
                                placeholder="e.g. Getting Started"
                                value={formData.approval_status}
                                onChange={(e) => handleInputChange("approval_status", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seat_no">Seat No</Label>
                            <Input
                                id="seat_no"
                                placeholder="Seat number (optional)"
                                value={formData.seat_no ?? ""}
                                onChange={(e) => handleInputChange("seat_no", e.target.value || null)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Fees */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fees &amp; Form</CardTitle>
                        <CardDescription>Update exam fees and form submission status</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="exam_fees_asked_to_pay">Fees Asked to Pay</Label>
                            <Input
                                id="exam_fees_asked_to_pay"
                                type="number"
                                placeholder="e.g. 1500"
                                value={formData.exam_fees_asked_to_pay ?? ""}
                                onChange={(e) => handleInputChange("exam_fees_asked_to_pay", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_fees_paid">Fees Paid</Label>
                            <Input
                                id="exam_fees_paid"
                                type="number"
                                placeholder="e.g. 0"
                                value={formData.exam_fees_paid ?? ""}
                                onChange={(e) => handleInputChange("exam_fees_paid", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="exam_form_submitted">Exam Form Submitted</Label>
                                <p className="text-sm text-muted-foreground">Has the student submitted the exam form?</p>
                            </div>
                            <Switch
                                id="exam_form_submitted"
                                checked={formData.exam_form_submitted}
                                onCheckedChange={(checked) => handleInputChange("exam_form_submitted", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Flags & Condonation */}
                <Card>
                    <CardHeader>
                        <CardTitle>Flags &amp; Condonation</CardTitle>
                        <CardDescription>Update result hold, council benefit, and condonation settings</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="hold_result">Hold Result</Label>
                                <p className="text-sm text-muted-foreground">Hold the student&apos;s result?</p>
                            </div>
                            <Switch
                                id="hold_result"
                                checked={formData.hold_result}
                                onCheckedChange={(checked) => handleInputChange("hold_result", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="student_council_benefit">Student Council Benefit</Label>
                                <p className="text-sm text-muted-foreground">Does the student have council benefit?</p>
                            </div>
                            <Switch
                                id="student_council_benefit"
                                checked={formData.student_council_benefit}
                                onCheckedChange={(checked) => handleInputChange("student_council_benefit", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="condonation_applied">Condonation Applied</Label>
                                <p className="text-sm text-muted-foreground">Has condonation been applied?</p>
                            </div>
                            <Switch
                                id="condonation_applied"
                                checked={formData.condonation_applied}
                                onCheckedChange={(checked) => handleInputChange("condonation_applied", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="condonation_course">Condonation Course ID</Label>
                            <Input
                                id="condonation_course"
                                type="number"
                                placeholder="Course ID (optional)"
                                value={formData.condonation_course ?? ""}
                                onChange={(e) => handleInputChange("condonation_course", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="condonation_exam_category">Condonation Exam Category ID</Label>
                            <Input
                                id="condonation_exam_category"
                                type="number"
                                placeholder="Category ID (optional)"
                                value={formData.condonation_exam_category ?? ""}
                                onChange={(e) => handleInputChange("condonation_exam_category", e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="condonation_marks">Condonation Marks</Label>
                            <Input
                                id="condonation_marks"
                                type="number"
                                placeholder="e.g. 0"
                                value={formData.condonation_marks}
                                onChange={(e) => handleInputChange("condonation_marks", Number(e.target.value))}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exam-session-student">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Student"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
