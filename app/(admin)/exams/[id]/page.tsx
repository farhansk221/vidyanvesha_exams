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
import { ExamService, type Exam } from "@/services/ExamServices";
import { ExamSessionService } from "@/services/ExamSessionServices";

export default function ViewExamPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [exam, setExam] = useState<Exam | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [sessionName, setSessionName] = useState<string | null>(null);
    const [programName, setProgramName] = useState<string | null>(null);
    const [revisionName, setRevisionName] = useState<string | null>(null);
    const [courseName, setCourseName] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [examData, sessionsData, programsData, revisionsData, coursesData] = await Promise.all([
                    ExamService.getById(Number(id)),
                    ExamSessionService.getAll().catch(() => []),
                    ExamService.getPrograms().catch(() => []),
                    ExamService.getProgramRevisions().catch(() => []),
                    ExamService.getCourses().catch(() => [])
                ]);
                
                setExam(examData);
                
                if (examData.exam_session) {
                    const matched = (sessionsData || []).find((s) => s.id === examData.exam_session);
                    if (matched) setSessionName(matched.exam_session_name || `Session ${matched.id}`);
                }
                
                if (examData.prog) {
                    const matched = programsData.find((p) => p.id === examData.prog);
                    if (matched) setProgramName(matched.prog_name || `Program ${matched.id}`);
                }

                if (examData.prog_rev) {
                    const matched = revisionsData.find((r) => r.id === examData.prog_rev);
                    if (matched) setRevisionName(matched.prog_rev_name || `Revision ${matched.id}`);
                }

                if (examData.course) {
                    const matched = coursesData.find((c) => c.id === examData.course);
                    if (matched) setCourseName(matched.course_name ? `${matched.course_name} (${matched.course_code})` : `Course ${matched.id}`);
                }

            } catch (error) {
                console.error("Failed to fetch exam:", error);
                toast.error("Failed to load exam details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        try {
            await ExamService.delete(Number(id));
            toast.success("Exam deleted successfully");
            router.push("/exams");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete exam");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Exam not found.</p>
                <Link href="/exams">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/exams">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Exam ID: {exam.id}</h1>
                        <p className="text-muted-foreground">
                            {courseName || "No Course"} | {exam.exam_date} at {exam.exam_start_time}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <Link href={`/exams/${id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Exam
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Academic Context */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Academic Context</CardTitle>
                        <CardDescription>Session &amp; Program mappings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Exam Session" value={sessionName || exam.exam_session || "N/A"} />
                        <DetailItem label="Student Class" value={exam.stud_class?.toString() || "N/A"} />
                        <DetailItem label="Program" value={programName || exam.prog || "N/A"} />
                        <DetailItem label="Program Revision" value={revisionName || exam.prog_rev || "N/A"} />
                        <DetailItem label="Course Semester" value={exam.course_sem?.toString() || "N/A"} />
                        <DetailItem label="Course" value={courseName || exam.course || "N/A"} />
                    </CardContent>
                </Card>

                {/* Exam Settings */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Exam Settings</CardTitle>
                        <CardDescription>Configuration and timing details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Direct or Indirect" value={exam.direct_or_indirect || "N/A"} />
                        <DetailItem label="Pattern" value={exam.pattern || "N/A"} />
                        <DetailItem label="Exam Date" value={exam.exam_date} />
                        <DetailItem label="Start Time" value={exam.exam_start_time} />
                        <DetailItem label="Duration" value={exam.exam_duration ? `${exam.exam_duration} mins` : "N/A"} />
                        <DetailItem label="Category ID" value={exam.exam_category?.toString() || "N/A"} />
                    </CardContent>
                </Card>

                {/* Marks & Evaluation */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Marks &amp; Evaluation</CardTitle>
                        <CardDescription>Scoring and evaluation parameters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Total Marks" value={exam.total_marks?.toString() || "N/A"} />
                        <DetailItem label="Passing Marks" value={exam.passing_marks?.toString() || "N/A"} />
                        <DetailItem label="Question Wise Evaluation" value={exam.question_wise ? "Yes" : "No"} />
                        <DetailItem label="Grace Marks Applicable" value={exam.grace_marks_flag ? "Yes" : "No"} />
                        {exam.grace_marks_flag && (
                            <DetailItem label="Grace Marks Value" value={exam.grace_marks?.toString() || "0"} />
                        )}
                        <DetailItem label="Keep Marks Anonymous" value={exam.keep_marks_anonymous ? "Yes" : "No"} />
                    </CardContent>
                </Card>

                {/* Question Paper details */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Question Papers</CardTitle>
                        <CardDescription>Code and requirements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Question Paper Needed" value={exam.question_paper_needed ? "Yes" : "No"} />
                        {exam.question_paper_needed && (
                            <DetailItem label="No. of Papers Needed" value={exam.no_of_question_paper_needed?.toString() || "N/A"} />
                        )}
                        <DetailItem label="Question Paper Code" value={exam.exam_question_paper_code || "N/A"} />
                        <DetailItem label="Penalty Applicable" value={exam.penalty_applicable ? "Yes" : "No"} />
                    </CardContent>
                </Card>

                {/* Staff Details */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Staff Assignments</CardTitle>
                        <CardDescription>Assigned teaching and external staff</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem label="Teaching Staff Assigned ID" value={exam.teaching_staff_assigned?.toString() || "None"} />
                        <DetailItem label="External Staff Assigned ID" value={exam.external_staff_assigned?.toString() || "None"} />
                        <div className="sm:col-span-2">
                            <DetailItem label="External Staff (Manual)" value={exam.external_staff_manual || "None"} />
                        </div>
                    </CardContent>
                </Card>

                {/* Freezes & Locks */}
                <Card className="md:col-span-2 lg:col-span-3 border-orange-200 bg-orange-50/30 dark:border-orange-900/50 dark:bg-orange-950/20">
                    <CardHeader>
                        <CardTitle className="text-orange-700 dark:text-orange-400">Security &amp; Locks</CardTitle>
                        <CardDescription>Freezed parameters for this exam</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <DetailItem label="Freeze Question Paper" value={exam.freeze_question_paper_flag ? "Yes" : "No"} />
                        <DetailItem label="Freeze Questions" value={exam.exam_questions_freeze ? "Yes" : "No"} />
                        {exam.exam_questions_freeze && (
                            <DetailItem label="Questions Freeze Date" value={exam.exam_questions_freeze_dt || "N/A"} />
                        )}
                        <DetailItem label="Student Approval Needed" value={exam.student_approval_needed ? "Yes" : "No"} />
                        <DetailItem label="Freeze Student List" value={exam.freeze_student_list_flag ? "Yes" : "No"} />
                        <DetailItem label="Freeze Marks" value={exam.freeze_marks ? "Yes" : "No"} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <span className="text-xs font-medium text-muted-foreground uppercase">{label}</span>
            <p className="mt-1 text-sm">{value}</p>
        </div>
    );
}
