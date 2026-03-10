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
import type { ExamSessionStudent } from "@/services/ExamSessionStudentService";

const mockData: Omit<ExamSessionStudent, "id"> = {
    exam_session: 1,
    student: 10001,
    program: 10,
    semester: 6,
    approval_status: "Getting Started",
    exam_fees_asked_to_pay: 1500,
    exam_fees_paid: 0,
    exam_form_submitted: false,
    seat_no: null,
    hold_result: false,
    student_council_benefit: false,
    condonation_applied: false,
    condonation_course: null,
    condonation_exam_category: null,
    condonation_marks: 0,
};

export default function EditExamSessionStudentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<ExamSessionStudent, "id">>(mockData);
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
            toast.success("Exam session student updated successfully!");
            router.push("/exam-session-student");
        } catch {
            toast.error("Failed to update exam session student.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <p className="text-muted-foreground">Update exam session student (ID: {id})</p>
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
                            <Label htmlFor="exam_session">Exam Session ID *</Label>
                            <Input
                                id="exam_session"
                                type="number"
                                placeholder="e.g. 1"
                                value={formData.exam_session ?? ""}
                                onChange={(e) => handleInputChange("exam_session", e.target.value ? Number(e.target.value) : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student">Student ID *</Label>
                            <Input
                                id="student"
                                type="number"
                                placeholder="e.g. 10001"
                                value={formData.student ?? ""}
                                onChange={(e) => handleInputChange("student", e.target.value ? Number(e.target.value) : null)}
                                required
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
