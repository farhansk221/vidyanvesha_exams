"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Eye, Pencil, Trash, MoreVertical } from "lucide-react";
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
import { QuestionPaperService, type QuestionPaper } from "@/services/QuestionPaperService";

export default function QuestionPapersPage() {
    const [papers, setPapers] = useState<QuestionPaper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                setIsLoading(true);
                const response = await QuestionPaperService.getAll();
                setPapers(response.results || []);
            } catch (err) {
                console.error("Failed to fetch question papers", err);
                setError("Failed to load");
                setPapers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPapers();
    }, []);

    const refreshList = async () => {
        try {
            const response = await QuestionPaperService.getAll();
            setPapers(response.results || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this question paper?")) return;
        try {
            await QuestionPaperService.delete(id);
            toast.success("Question paper deleted successfully");
            setPapers((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete question paper");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Question Papers</h1>
                <p className="text-muted-foreground">Manage question papers and their details</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search question papers..." className="pl-9" />
                </div>
                <Link href="/question-papers/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Question Paper
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>NAME</TableHead>
                            <TableHead>CODE</TableHead>
                            <TableHead>TOTAL MARKS</TableHead>
                            <TableHead>FINAL</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : papers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No question papers found. Click &quot;Create Question Paper&quot; to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            papers.map((qp) => (
                                <TableRow key={qp.id}>
                                    <TableCell>{qp.id}</TableCell>
                                    <TableCell>{qp.qp_name}</TableCell>
                                    <TableCell>{qp.qp_code}</TableCell>
                                    <TableCell>{qp.qp_total_marks}</TableCell>
                                    <TableCell>{qp.is_final ? "Yes" : "No"}</TableCell>
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
                                                <Link href={`/question-papers/${qp.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Preview</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/question-papers/${qp.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => qp.id && handleDelete(qp.id)}
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