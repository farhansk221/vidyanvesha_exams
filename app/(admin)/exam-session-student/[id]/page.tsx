"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Loader2, Trash, User, Calendar, BookOpen, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ExamSessionStudentService, type ExamSessionStudent } from "@/services/ExamSessionStudentService";
import { StudentService, type Student } from "@/services/StudentService";
import { ExamSessionService } from "@/services/ExamSessionServices";
import { ExamService } from "@/services/ExamServices";

export default function ViewExamSessionStudentPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [item, setItem] = useState<ExamSessionStudent | null>(null);
    const [student, setStudent] = useState<Student | null>(null);
    const [sessionName, setSessionName] = useState<string | null>(null);
    const [programName, setProgramName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await ExamSessionStudentService.getById(Number(id));
                setItem(data);

                const [studentsData, sessionsData, programsData] = await Promise.all([
                    data.student ? StudentService.getById(data.student).catch(() => null) : Promise.resolve(null),
                    data.exam_session ? ExamSessionService.getAll().catch(() => []) : Promise.resolve([]),
                    data.program ? ExamService.getPrograms().catch(() => []) : Promise.resolve([])
                ]);

                if (studentsData) setStudent(studentsData);

                if (data.exam_session) {
                    const matched = (sessionsData || []).find((s: any) => s.id === data.exam_session);
                    if (matched) setSessionName(matched.exam_session_name || `Session ${matched.id}`);
                }

                if (data.program) {
                    const matched = (programsData || []).find((p: any) => p.id === data.program);
                    if (matched) setProgramName(matched.prog_name || `Program ${matched.id}`);
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to remove this student from the session?")) return;
        try {
            await ExamSessionStudentService.delete(Number(id));
            toast.success("Student removed successfully");
            router.push("/exam-session-student");
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove student");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Mapping not found.</p>
                <Link href="/exam-session-student">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/exam-session-student">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {student ? `${student.stud_first_name} ${student.stud_last_name}` : `Student ID: ${item.student}`}
                        </h1>
                        <p className="text-muted-foreground">Session Enrollment Details</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Remove from Session
                    </Button>
                    <Button asChild>
                        <Link href={`/exam-session-student/${id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Enrollment
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Student Info */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            Student Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="First Name" value={student?.stud_first_name || "N/A"} />
                        <DetailItem label="Last Name" value={student?.stud_last_name || "N/A"} />
                        <DetailItem label="Registration No" value={student?.stud_reg_no || "N/A"} />
                        <DetailItem label="Mobile" value={student?.stud_mobile_no || "N/A"} />
                        <DetailItem label="Email" value={student?.stud_email_id || "N/A"} />
                    </CardContent>
                </Card>

                {/* Enrollment Context */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-500" />
                            Enrollment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Exam Session" value={sessionName || item.exam_session || "N/A"} />
                        <DetailItem label="Program" value={programName || item.program || "N/A"} />
                        <DetailItem label="Semester" value={item.semester?.toString() || "N/A"} />
                        <DetailItem label="Approval Status" value={
                            <Badge variant={item.approval_status === "Approved" ? "default" : "secondary"}>
                                {item.approval_status}
                            </Badge>
                        } />
                        <DetailItem label="Seat Number" value={item.seat_no || "Not Assigned"} />
                    </CardContent>
                </Card>

                {/* Status & Fees */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-500" />
                            Status & Fees
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Form Submitted" value={
                            item.exam_form_submitted ?
                                <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4" /> Yes</span> :
                                <span className="flex items-center gap-1 text-red-600"><XCircle className="h-4 w-4" /> No</span>
                        } />
                        <DetailItem label="Fees Asked" value={item.exam_fees_asked_to_pay?.toString() || "0"} />
                        <DetailItem label="Fees Paid" value={item.exam_fees_paid?.toString() || "0"} />
                        <DetailItem label="Hold Result" value={item.hold_result ? "Yes" : "No"} />
                        <DetailItem label="Condonation Applied" value={item.condonation_applied ? "Yes" : "No"} />
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
            <p className="mt-1 text-sm font-medium">{value}</p>
        </div>
    );
}
