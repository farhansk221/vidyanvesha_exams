"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { ExamSessionService, type ExamSession, type AcademicSession } from "@/services/ExamSessionServices";

const defaultFormData: Omit<ExamSession, "id"> = {
    exam_session_name: "",
    exam_session_held_in: "",
    exam_session_start_date: "",
    exam_session_end_date: "",
    exam_session_regular: true,
    exam_session_collect_exam_fees: false,
    exam_session_exam_form_released: false,
    exam_session_exam_form_released_dt: null,
    exam_session_exam_form_submission_dt: null,
    academic_session_id: null,
    automatic_exam_generated: false,
    exam_seat_no_generated: false,
    exam_seat_no_generated_dt: null,
    exam_seat_no_has_to_be_borrowed: false,
    exam_seat_no_to_be_borrowed_from_id: null,
    hallticket_year_or_other_notation: "",
    hallticket_generated: false,
    hallticket_generated_dt: null,
    hallticket_released: false,
    hallticket_released_dt: null,
    grade_penalty: false,
    grade_penalty_level: null,
    freeze_marks: false,
    freeze_marks_dt: null,
    exam_year_difference_allowed: null,
    release_student_results: false,
};

export default function EditExamSessionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState<Omit<ExamSession, "id">>(defaultFormData);
    const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [sessionData, academicSessionsData] = await Promise.all([
                    ExamSessionService.getById(Number(id)),
                    ExamSessionService.getAcademicSessions().catch(() => []) 
                ]);
                
                const { id: _, ...session } = sessionData;
                setFormData(session);
                setAcademicSessions(academicSessionsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load exam session details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (field: keyof typeof formData, value: string | number | boolean | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ExamSessionService.update(Number(id), formData);
            toast.success("Exam session updated successfully!");
            router.push("/exam-sessions");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update exam session.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam-sessions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Exam Session</h1>
                    <p className="text-muted-foreground">Update the details of the exam session (ID: {id})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Update the core exam session details</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="exam_session_name">Session Name *</Label>
                            <Input
                                id="exam_session_name"
                                placeholder="e.g. End Semester May 2026"
                                value={formData.exam_session_name}
                                onChange={(e) => handleInputChange("exam_session_name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_session_held_in">Held In</Label>
                            <Input
                                id="exam_session_held_in"
                                placeholder="e.g. May-2026"
                                value={formData.exam_session_held_in}
                                onChange={(e) => handleInputChange("exam_session_held_in", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="academic_session_id">Academic Session ID</Label>
                            <Select
                                value={formData.academic_session_id ? String(formData.academic_session_id) : ""}
                                onValueChange={(val) => handleInputChange("academic_session_id", Number(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an academic session" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicSessions.map((session) => (
                                        <SelectItem key={session.id} value={String(session.id)}>
                                            {session.session_name || session.academic_session_name || session.name || `Session ${session.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_session_start_date">Start Date *</Label>
                            <Input
                                id="exam_session_start_date"
                                type="date"
                                value={formData.exam_session_start_date}
                                onChange={(e) => handleInputChange("exam_session_start_date", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_session_end_date">End Date *</Label>
                            <Input
                                id="exam_session_end_date"
                                type="date"
                                value={formData.exam_session_end_date}
                                onChange={(e) => handleInputChange("exam_session_end_date", e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="exam_session_regular">Regular Session</Label>
                                <p className="text-sm text-muted-foreground">Is this a regular exam session?</p>
                            </div>
                            <Switch
                                id="exam_session_regular"
                                checked={formData.exam_session_regular}
                                onCheckedChange={(checked) => handleInputChange("exam_session_regular", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="exam_session_collect_exam_fees">Collect Exam Fees</Label>
                                <p className="text-sm text-muted-foreground">Collect fees for this session?</p>
                            </div>
                            <Switch
                                id="exam_session_collect_exam_fees"
                                checked={formData.exam_session_collect_exam_fees}
                                onCheckedChange={(checked) => handleInputChange("exam_session_collect_exam_fees", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Exam Form Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Form Settings</CardTitle>
                        <CardDescription>Configure exam form release and submission dates</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="exam_session_exam_form_released">Exam Form Released</Label>
                                <p className="text-sm text-muted-foreground">Has the exam form been released?</p>
                            </div>
                            <Switch
                                id="exam_session_exam_form_released"
                                checked={formData.exam_session_exam_form_released}
                                onCheckedChange={(checked) => handleInputChange("exam_session_exam_form_released", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_session_exam_form_released_dt">Form Released Date</Label>
                            <Input
                                id="exam_session_exam_form_released_dt"
                                type="date"
                                value={formData.exam_session_exam_form_released_dt ?? ""}
                                onChange={(e) =>
                                    handleInputChange("exam_session_exam_form_released_dt", e.target.value || null)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_session_exam_form_submission_dt">Form Submission Date</Label>
                            <Input
                                id="exam_session_exam_form_submission_dt"
                                type="date"
                                value={formData.exam_session_exam_form_submission_dt ?? ""}
                                onChange={(e) =>
                                    handleInputChange("exam_session_exam_form_submission_dt", e.target.value || null)
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="automatic_exam_generated">Automatic Exam Generated</Label>
                                <p className="text-sm text-muted-foreground">Auto-generate exams for this session?</p>
                            </div>
                            <Switch
                                id="automatic_exam_generated"
                                checked={formData.automatic_exam_generated}
                                onCheckedChange={(checked) => handleInputChange("automatic_exam_generated", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Seat Number & Hall Ticket */}
                <Card>
                    <CardHeader>
                        <CardTitle>Seat Number &amp; Hall Ticket</CardTitle>
                        <CardDescription>Configure seat number generation and hall ticket settings</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="exam_seat_no_generated">Seat No Generated</Label>
                                <p className="text-sm text-muted-foreground">Have seat numbers been generated?</p>
                            </div>
                            <Switch
                                id="exam_seat_no_generated"
                                checked={formData.exam_seat_no_generated}
                                onCheckedChange={(checked) => handleInputChange("exam_seat_no_generated", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_seat_no_generated_dt">Seat No Generated Date</Label>
                            <Input
                                id="exam_seat_no_generated_dt"
                                type="date"
                                value={formData.exam_seat_no_generated_dt ?? ""}
                                onChange={(e) =>
                                    handleInputChange("exam_seat_no_generated_dt", e.target.value || null)
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="exam_seat_no_has_to_be_borrowed">Seat No Borrowed</Label>
                                <p className="text-sm text-muted-foreground">Borrow seat numbers from another session?</p>
                            </div>
                            <Switch
                                id="exam_seat_no_has_to_be_borrowed"
                                checked={formData.exam_seat_no_has_to_be_borrowed}
                                onCheckedChange={(checked) => handleInputChange("exam_seat_no_has_to_be_borrowed", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_seat_no_to_be_borrowed_from_id">Borrowed From Session ID</Label>
                            <Input
                                id="exam_seat_no_to_be_borrowed_from_id"
                                type="number"
                                placeholder="Session ID to borrow from"
                                value={formData.exam_seat_no_to_be_borrowed_from_id ?? ""}
                                onChange={(e) =>
                                    handleInputChange("exam_seat_no_to_be_borrowed_from_id", e.target.value ? Number(e.target.value) : null)
                                }
                            />
                        </div>

                        <Separator className="md:col-span-2" />

                        <div className="space-y-2">
                            <Label htmlFor="hallticket_year_or_other_notation">Hall Ticket Year / Notation</Label>
                            <Input
                                id="hallticket_year_or_other_notation"
                                placeholder="e.g. 2026"
                                value={formData.hallticket_year_or_other_notation}
                                onChange={(e) => handleInputChange("hallticket_year_or_other_notation", e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="hallticket_generated">Hall Ticket Generated</Label>
                                <p className="text-sm text-muted-foreground">Have hall tickets been generated?</p>
                            </div>
                            <Switch
                                id="hallticket_generated"
                                checked={formData.hallticket_generated}
                                onCheckedChange={(checked) => handleInputChange("hallticket_generated", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hallticket_generated_dt">Hall Ticket Generated Date</Label>
                            <Input
                                id="hallticket_generated_dt"
                                type="date"
                                value={formData.hallticket_generated_dt ?? ""}
                                onChange={(e) =>
                                    handleInputChange("hallticket_generated_dt", e.target.value || null)
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="hallticket_released">Hall Ticket Released</Label>
                                <p className="text-sm text-muted-foreground">Have hall tickets been released?</p>
                            </div>
                            <Switch
                                id="hallticket_released"
                                checked={formData.hallticket_released}
                                onCheckedChange={(checked) => handleInputChange("hallticket_released", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hallticket_released_dt">Hall Ticket Released Date</Label>
                            <Input
                                id="hallticket_released_dt"
                                type="date"
                                value={formData.hallticket_released_dt ?? ""}
                                onChange={(e) =>
                                    handleInputChange("hallticket_released_dt", e.target.value || null)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Grading & Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Grading &amp; Results</CardTitle>
                        <CardDescription>Configure grading penalties, mark freezing, and result release</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="grade_penalty">Grade Penalty</Label>
                                <p className="text-sm text-muted-foreground">Apply grade penalty for this session?</p>
                            </div>
                            <Switch
                                id="grade_penalty"
                                checked={formData.grade_penalty}
                                onCheckedChange={(checked) => handleInputChange("grade_penalty", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grade_penalty_level">Grade Penalty Level</Label>
                            <Input
                                id="grade_penalty_level"
                                type="number"
                                placeholder="Penalty level"
                                value={formData.grade_penalty_level ?? ""}
                                onChange={(e) =>
                                    handleInputChange("grade_penalty_level", e.target.value ? Number(e.target.value) : null)
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="freeze_marks">Freeze Marks</Label>
                                <p className="text-sm text-muted-foreground">Freeze marks for this session?</p>
                            </div>
                            <Switch
                                id="freeze_marks"
                                checked={formData.freeze_marks}
                                onCheckedChange={(checked) => handleInputChange("freeze_marks", checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="freeze_marks_dt">Freeze Marks Date</Label>
                            <Input
                                id="freeze_marks_dt"
                                type="date"
                                value={formData.freeze_marks_dt ?? ""}
                                onChange={(e) =>
                                    handleInputChange("freeze_marks_dt", e.target.value || null)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exam_year_difference_allowed">Exam Year Difference Allowed</Label>
                            <Input
                                id="exam_year_difference_allowed"
                                type="number"
                                placeholder="e.g. 2"
                                value={formData.exam_year_difference_allowed ?? ""}
                                onChange={(e) =>
                                    handleInputChange("exam_year_difference_allowed", e.target.value ? Number(e.target.value) : null)
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="release_student_results">Release Student Results</Label>
                                <p className="text-sm text-muted-foreground">Release results to students?</p>
                            </div>
                            <Switch
                                id="release_student_results"
                                checked={formData.release_student_results}
                                onCheckedChange={(checked) => handleInputChange("release_student_results", checked)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t pt-6">
                        <Link href="/exam-sessions">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Exam Session"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
