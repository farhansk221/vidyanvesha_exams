"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    Plus, 
    Search, 
    Loader2, 
    Eye, 
    Pencil, 
    Trash, 
    BookOpen, 
    HelpCircle, 
    FileText, 
    Users,
    MoreVertical
} from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExamSessionService, type ExamSession } from "@/services/ExamSessionServices";

export default function ExamSessionsPage() {
    const [sessions, setSessions] = useState<ExamSession[]>([]);
    const [academicSessionsMap, setAcademicSessionsMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this exam session?")) return;
        try {
            await ExamSessionService.delete(id);
            toast.success("Exam session deleted successfully");
            fetchData();
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
                            <TableHead className="text-right">ACTIONS</TableHead>
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
                                    <TableCell className="font-medium">{session.exam_session_name}</TableCell>
                                    <TableCell>{session.exam_session_held_in}</TableCell>
                                    <TableCell>
                                        {session.academic_session_id
                                            ? academicSessionsMap[session.academic_session_id] || session.academic_session_id
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>{session.exam_session_start_date}</TableCell>
                                    <TableCell>{session.exam_session_end_date}</TableCell>
                                    <TableCell>{session.exam_session_regular ? "Yes" : "No"}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[200px]">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <Link href={`/exam-sessions/${session.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Preview</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam-sessions/${session.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <Link href={`/exams?sessionId=${session.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        <span>View Exams</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam-questions?sessionId=${session.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <HelpCircle className="mr-2 h-4 w-4" />
                                                        <span>View Questions</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam-question-paper?sessionId=${session.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        <span>View Question Papers</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam-question-outcomes?sessionId=${session.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        <span>CO Mapping</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam-session-student?sessionId=${session.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Users className="mr-2 h-4 w-4" />
                                                        <span>View Students</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => session.id && handleDelete(session.id)}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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