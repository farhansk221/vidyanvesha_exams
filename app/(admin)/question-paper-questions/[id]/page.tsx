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
import { QuestionPaperQuestionService, type QuestionPaperQuestion } from "@/services/QuestionPaperQuestionService";
import { QuestionPaperService } from "@/services/QuestionPaperService";
import { ExamQuestionService } from "@/services/ExamQuestionService";

export default function ViewQuestionPaperQuestionPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [item, setItem] = useState<QuestionPaperQuestion | null>(null);
    const [paperName, setPaperName] = useState<string | null>(null);
    const [questionLabel, setQuestionLabel] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await QuestionPaperQuestionService.getById(Number(id));
                setItem(data);

                if (data.question_paper) {
                    const papers = await QuestionPaperService.getAll().catch(() => []);
                    const matched = papers.find((p: any) => p.id === data.question_paper);
                    if (matched) setPaperName(matched.qp_name || `Paper ${matched.id}`);
                }

                if (data.question) {
                    const questions = await ExamQuestionService.getAll().catch(() => []);
                    const matched = questions.find((q: any) => q.id === data.question);
                    if (matched) setQuestionLabel(matched.question_label || `Question ${matched.id}`);
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
        if (!window.confirm("Are you sure you want to delete this mapping?")) return;
        try {
            await QuestionPaperQuestionService.delete(Number(id));
            toast.success("Deleted successfully");
            router.push("/question-paper-questions");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
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
                <Link href="/question-paper-questions">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/question-paper-questions">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mapping ID: {item.id}</h1>
                        <p className="text-muted-foreground">Detailed mapping information</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <Button asChild>
                        <Link href={`/question-paper-questions/${id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Mapping
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Source & Target</CardTitle>
                        <CardDescription>Paper and Question details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Question Paper" value={paperName || item.question_paper || "N/A"} />
                        <DetailItem label="Exam Question" value={questionLabel || item.question || "N/A"} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Sequence and marks setup</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Question Label" value={item.question_label || "N/A"} />
                        <DetailItem label="Question Sequence" value={item.question_sequence?.toString() || "N/A"} />
                        <DetailItem label="Max Marks" value={item.max_marks?.toString() || "0"} />
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