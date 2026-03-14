"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit, Trash, Loader2, Pencil, MoreVertical } from "lucide-react";
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
import { ExamGradeStructureService, type ExamGradeStructure } from "@/services/ExamGradeStructureService";

export default function ExamGradeStructurePage() {
    const [structures, setStructures] = useState<ExamGradeStructure[]>([]);
    const [programsMap, setProgramsMap] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [structuresData, programsData] = await Promise.all([
                ExamGradeStructureService.getAll(),
                ExamGradeStructureService.getPrograms().catch(() => [])
            ]);

            setStructures(structuresData);

            const map: Record<number, string> = {};
            programsData.forEach((prog) => {
                map[prog.id] = prog.prog_name || `Program ${prog.id}`;
            });
            setProgramsMap(map);
        } catch (err) {
            console.error(err);
            setError("Failed to load exam grade structures");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this grade structure?")) return;
        try {
            await ExamGradeStructureService.delete(id);
            toast.success("Grade structure deleted successfully");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete grade structure");
        }
    };
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Exam Grade Structure</h1>
                <p className="text-muted-foreground">Manage grading structures for exams</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search grade structures..." className="pl-9" />
                </div>
                <Link href="/exam-grade-structure/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Grade Structure
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>GRADE</TableHead>
                            <TableHead>PROGRAM</TableHead>
                            <TableHead>MIN MARKS</TableHead>
                            <TableHead>MAX MARKS</TableHead>
                            <TableHead>PASSING</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : structures.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No grade structures found. Click &quot;Create Grade Structure&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            structures.map((structure) => (
                                <TableRow key={structure.id}>
                                    <TableCell>{structure.id}</TableCell>
                                    <TableCell className="font-medium">{structure.grade}</TableCell>
                                    <TableCell>
                                        {structure.program
                                            ? programsMap[structure.program] || structure.program
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>{structure.min_marks ?? "N/A"}</TableCell>
                                    <TableCell>{structure.max_marks ?? "N/A"}</TableCell>
                                    <TableCell>{structure.passing_grade_flag ? "Yes" : "No"}</TableCell>
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
                                                <Link href={`/exam-grade-structure/${structure.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Preview</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/exam-grade-structure/${structure.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => structure.id && handleDelete(structure.id)}
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