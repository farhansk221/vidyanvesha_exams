"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Settings, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ExamSessionService } from "@/services/ExamSessionServices";

interface Combination {
    department_id: number;
    department_name: string;
    program_id: number;
    program_name: string;
    semester: number;
    class_id: number;
    class_name: string;
    [key: string]: any;
}

export default function CombinationsPage() {
    const params = useParams();
    const sessionId = Number(params.id);
    const [combinations, setCombinations] = useState<Combination[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});

    const fetchCombinations = async () => {
        if (!sessionId) return;
        try {
            setIsLoading(true);
            setError(null);
            const data = await ExamSessionService.getCombinations(sessionId);
            // Handle both array response and paginated results
            const results = Array.isArray(data) ? data : (data.results || []);
            setCombinations(results);
        } catch (err) {
            console.error("Failed to fetch combinations:", err);
            setError("Failed to load combinations");
            toast.error("Failed to load combinations");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCombinations();
    }, [sessionId]);

    const handleSync = async (comb: Combination) => {
        const syncKey = `${comb.department_id}-${comb.program_id}-${comb.semester}-${comb.class_id}`;
        try {
            setIsSyncing(prev => ({ ...prev, [syncKey]: true }));
            await ExamSessionService.syncStudents(
                sessionId,
                comb.department_id,
                comb.program_id,
                comb.semester,
                comb.class_id
            );
            toast.success(`Students synced successfully for ${comb.class_name}`);
        } catch (err) {
            console.error("Sync failed:", err);
            toast.error(`Failed to sync students for ${comb.class_name}`);
        } finally {
            setIsSyncing(prev => ({ ...prev, [syncKey]: false }));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exam-sessions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Exam Session Combinations</h1>
                    <p className="text-muted-foreground">Manage and sync students for session ID: {sessionId}</p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead className="text-right">Manage Student</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Loading combinations...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                                        <AlertCircle className="h-8 w-8" />
                                        <p className="font-medium">{error}</p>
                                        <Button variant="outline" size="sm" onClick={fetchCombinations} className="mt-2 text-foreground">
                                            Try Again
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : combinations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                        <p className="font-medium text-muted-foreground">No response found</p>
                                        <p className="text-sm text-muted-foreground">There are no combinations available for this session.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            combinations.map((comb, index) => {
                                const syncKey = `${comb.department_id}-${comb.program_id}-${comb.semester}-${comb.class_id}`;
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{comb.department_name}</TableCell>
                                        <TableCell>{comb.program_name}</TableCell>
                                        <TableCell>{comb.semester}</TableCell>
                                        <TableCell>{comb.class_name}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleSync(comb)}
                                                disabled={isSyncing[syncKey]}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {isSyncing[syncKey] ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Settings className="mr-2 h-4 w-4" />
                                                )}
                                                Manage Student
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
