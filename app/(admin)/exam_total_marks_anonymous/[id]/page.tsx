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
import { ExamTotalMarksAnonymousService, type ExamTotalMarksAnonymous } from "@/services/ExamTotalMarksAnonymousService";
import { ExamService, type Exam } from "@/services/ExamServices";

export default function ViewTotalMarksAnonymousPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [record, setRecord] = useState<ExamTotalMarksAnonymous | null>(null);
    const [examsMap, setExamsMap] = useState<Record<number, Exam>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [rec, examsRes] = await Promise.all([
                    ExamTotalMarksAnonymousService.getById(Number(id)),
                    ExamService.getAll().catch(() => []),
                ]);
                setRecord(rec);
                const map: Record<number, Exam> = {};
                (examsRes || []).forEach((e) => {
                    if (e.id !== undefined) map[e.id] = e;
                });
                setExamsMap(map);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load record");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await ExamTotalMarksAnonymousService.delete(Number(id));
            toast.success("Record deleted successfully");
            router.push("/exam_total_marks_anonymous");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete record");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!record) {
        return (
            <div className="p-6 text-center space-y-4">
                <h1 className="text-2xl font-bold tracking-tight">Record Not Found</h1>
                <p className="text-muted-foreground">The record with ID {id} could not be found.</p>
                <Link href="/exam_total_marks_anonymous">
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

    const examLabel = record.exam ? examsMap[record.exam]?.id ? `Exam ${record.exam}` : `Exam ${record.exam}` : '-';

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/exam_total_marks_anonymous">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Total Marks Record</h1>
                        <p className="text-muted-foreground">ID: {record.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <Link href={`/exam_total_marks_anonymous/${id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>Data for this record</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Exam" value={examLabel} />
                    <DetailItem label="Student Code" value={record.student_exam_code} />
                    <DetailItem label="Marks Scored" value={record.marks_scored} />
                    <DetailItem label="Seat No" value={record.seat_no} />
                </CardContent>
            </Card>
        </div>
    );
}
