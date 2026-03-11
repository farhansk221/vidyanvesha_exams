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
import { ExamSessionService, type ExamSession } from "@/services/ExamSessionServices";

export default function ViewExamSessionPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [session, setSession] = useState<ExamSession | null>(null);
    const [academicSessionName, setAcademicSessionName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchSession = async () => {
            try {
                setIsLoading(true);
                const [data, academicSessionsData] = await Promise.all([
                    ExamSessionService.getById(Number(id)),
                    ExamSessionService.getAcademicSessions().catch(() => []) 
                ]);
                
                setSession(data);
                
                if (data.academic_session_id) {
                    const matchedSession = academicSessionsData.find((s: any) => s.id === data.academic_session_id);
                    if (matchedSession) {
                        setAcademicSessionName(matchedSession.session_name || matchedSession.academic_session_name || matchedSession.name || `Session ${matchedSession.id}`);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch exam session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this exam session?")) return;
        try {
            await ExamSessionService.delete(Number(id));
            toast.success("Exam session deleted successfully");
            router.push("/exam-sessions");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete exam session");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="p-6 text-center space-y-4">
                <h1 className="text-2xl font-bold tracking-tight">Exam Session Not Found</h1>
                <p className="text-muted-foreground">The exam session with ID {id} could not be found.</p>
                <Link href="/exam-sessions">
                    <Button>Back to List</Button>
                </Link>
            </div>
        );
    }

    const DetailItem = ({ label, value }: { label: string; value: string | number | boolean | null | undefined }) => (
        <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="text-base text-foreground">
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || '-')}
            </span>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/exam-sessions">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{session.exam_session_name}</h1>
                        <p className="text-muted-foreground">ID: {session.id} | Academic Session: {academicSessionName || session.academic_session_id || "None"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <Link href={`/exam-sessions/${id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Session
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic details</CardTitle>
                        <CardDescription>Core details surrounding this schedule</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Session Name" value={session.exam_session_name} />
                        <DetailItem label="Held In" value={session.exam_session_held_in} />
                        <DetailItem label="Start Date" value={session.exam_session_start_date} />
                        <DetailItem label="End Date" value={session.exam_session_end_date} />
                        <DetailItem label="Regular Session" value={session.exam_session_regular} />
                        <DetailItem label="Collect Exam Fees" value={session.exam_session_collect_exam_fees} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Exam Form Config</CardTitle>
                        <CardDescription>Release and submissions timeline</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Exam Form Released" value={session.exam_session_exam_form_released} />
                        <DetailItem label="Release Date" value={session.exam_session_exam_form_released_dt} />
                        <DetailItem label="Submission Date" value={session.exam_session_exam_form_submission_dt} />
                        <DetailItem label="Auto Exam Generated" value={session.automatic_exam_generated} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Seat Number & Hallticket</CardTitle>
                        <CardDescription>Ticket and seating plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Seat No Generated" value={session.exam_seat_no_generated} />
                        <DetailItem label="Seat No Generated Date" value={session.exam_seat_no_generated_dt} />
                        <DetailItem label="Seat No Borrowed" value={session.exam_seat_no_has_to_be_borrowed} />
                        <DetailItem label="Borrowed From Session ID" value={session.exam_seat_no_to_be_borrowed_from_id} />
                        <Separator className="my-2" />
                        <DetailItem label="Hall ticket Notation / Year" value={session.hallticket_year_or_other_notation} />
                        <DetailItem label="Hall ticket Generated" value={session.hallticket_generated} />
                        <DetailItem label="Hall ticket Gen. Date" value={session.hallticket_generated_dt} />
                        <DetailItem label="Hall ticket Released" value={session.hallticket_released} />
                        <DetailItem label="Hall ticket Rel. Date" value={session.hallticket_released_dt} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Grading & Audit rules</CardTitle>
                        <CardDescription>Mark freezing and result propagation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Grade Penalty" value={session.grade_penalty} />
                        <DetailItem label="Grade Penalty Level" value={session.grade_penalty_level} />
                        <DetailItem label="Freeze Marks" value={session.freeze_marks} />
                        <DetailItem label="Freeze Marks Date" value={session.freeze_marks_dt} />
                        <DetailItem label="Exam Year Max Difference" value={session.exam_year_difference_allowed} />
                        <DetailItem label="Release Student Results" value={session.release_student_results} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}