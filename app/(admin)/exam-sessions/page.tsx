"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Eye, Edit, Pencil, Trash, BookOpen, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ExamSessionService, type ExamSession } from "@/services/ExamSessionServices";

export default function ExamSessionsPage() {
    const [sessions, setSessions] = useState<ExamSession[]>([]);
    const [academicSessionsMap, setAcademicSessionsMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                const [examSessionsResponse, academicSessionsData] = await Promise.all([
                    ExamSessionService.getAll(),
                    ExamSessionService.getAcademicSessions().catch(() => [])
                ]);
                
                setSessions(examSessionsResponse.results || []);
                
                const map: Record<number, string> = {};
                academicSessionsData.forEach((session: any) => {
                    map[session.id] = session.session_name || session.academic_session_name || session.name || `Session ${session.id}`;
                });
                setAcademicSessionsMap(map);
                
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load exam sessions");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await ExamSessionService.getAll();
            setSessions(response.results || []);
        } catch (err) {
            console.error("Failed to fetch exam sessions:", err);
        }
    };
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this exam session?")) return;
        try {
            await ExamSessionService.delete(id);
            toast.success("Exam session deleted successfully");
            fetchSessions();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete exam session");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Exam Sessions</h1>
                <p className="text-muted-foreground">Manage exam sessions and their configurations</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search exam sessions..." className="pl-9" />
                </div>
                <Link href="/exam-sessions/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Exam Session
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>SESSION NAME</TableHead>
                            <TableHead>HELD IN</TableHead>
                            <TableHead>ACADEMIC SESSION</TableHead>
                            <TableHead>START DATE</TableHead>
                            <TableHead>END DATE</TableHead>
                            <TableHead>REGULAR</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : sessions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                    No exam sessions found. Click &quot;Create Exam Session&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sessions.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell>{session.id}</TableCell>
                                    <TableCell>{session.exam_session_name}</TableCell>
                                    <TableCell>{session.exam_session_held_in}</TableCell>
                                    <TableCell>
                                        {session.academic_session_id 
                                            ? academicSessionsMap[session.academic_session_id] || session.academic_session_id 
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>{session.exam_session_start_date}</TableCell>
                                    <TableCell>{session.exam_session_end_date}</TableCell>
                                    <TableCell>{session.exam_session_regular ? "Yes" : "No"}</TableCell>
                                    <TableCell>
                                        <Link href={`/exam-sessions/${session.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/exam-sessions/${session.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/exams?sessionId=${session.id}`}>
                                            <Button variant="outline" size="sm" title="View Exams">
                                                <BookOpen className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/exam-questions?sessionId=${session.id}`}>
                                            <Button variant="outline" size="sm" title="View Questions">
                                                <HelpCircle className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm"
                                            onClick={() => session.id && handleDelete(session.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}