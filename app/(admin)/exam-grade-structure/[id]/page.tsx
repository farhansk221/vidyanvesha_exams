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
import { ExamGradeStructureService, type ExamGradeStructure } from "@/services/ExamGradeStructureService";

export default function ViewExamGradeStructurePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [structure, setStructure] = useState<ExamGradeStructure | null>(null);
    const [programName, setProgramName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [data, programsData] = await Promise.all([
                    ExamGradeStructureService.getById(Number(id)),
                    ExamGradeStructureService.getPrograms().catch(() => []) 
                ]);
                
                setStructure(data);
                
                if (data.program) {
                    const matchedProg = programsData.find(p => p.id === data.program);
                    if (matchedProg) {
                        setProgramName(matchedProg.prog_name || `Program ${matchedProg.id}`);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch grade structure:", error);
                toast.error("Failed to load grade structure details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this grade structure?")) return;
        try {
            await ExamGradeStructureService.delete(Number(id));
            toast.success("Grade structure deleted successfully");
            router.push("/exam-grade-structure");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete grade structure");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!structure) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Grade structure not found.</p>
                <Link href="/exam-grade-structure">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/exam-grade-structure">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Grade: {structure.grade}</h1>
                        <p className="text-muted-foreground">
                            ID: {structure.id} | Program: {programName || structure.program || "None"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <Link href={`/exam-grade-structure/${id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Grade Structure
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Details</CardTitle>
                        <CardDescription>Primary information about this grade</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Grade Name" value={structure.grade} />
                        <DetailItem label="Description" value={structure.description || "N/A"} />
                        <DetailItem label="Grade Point" value={structure.grade_point?.toString() || "N/A"} />
                        <DetailItem label="Minimum Marks" value={structure.min_marks?.toString() || "0"} />
                        <DetailItem label="Maximum Marks" value={structure.max_marks?.toString() || "N/A"} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Flags & Status</CardTitle>
                        <CardDescription>Indicators configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem 
                            label="Passing Grade" 
                            value={structure.passing_grade_flag ? "Yes" : "No"} 
                        />
                        <DetailItem 
                            label="Failing Grade" 
                            value={structure.failing_grade_flag ? "Yes" : "No"} 
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <p className="mt-1 text-sm">{value}</p>
            <Separator className="mt-3" />
        </div>
    );
}
