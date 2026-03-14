"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash, Loader2, AlertCircle, MoreVertical, Eye } from "lucide-react";
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
import { toast } from "sonner";
import { ExamOutcomeService, ExamOutcome } from "@/services/ExamOutcomeService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ExamOutcomesPage() {
    const [outcomes, setOutcomes] = useState<ExamOutcome[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchOutcomes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ExamOutcomeService.getAll();
            setOutcomes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn("Fetch error:", err);
            setError("Failed to load data. The API might be down or unreachable.");
            toast.error("Failed to load exam outcomes.");
            setOutcomes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOutcomes();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this exam outcome?")) return;

        try {
            await ExamOutcomeService.delete(id);
            toast.success("Exam outcome deleted successfully");
            fetchOutcomes();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete exam outcome.");
        }
    };

    const filteredOutcomes = (Array.isArray(outcomes) ? outcomes : []).filter((outcome) =>
        outcome.id?.toString().includes(searchQuery) ||
        outcome.exam?.toString().includes(searchQuery) ||
        outcome.course_outcome?.toString().includes(searchQuery)
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Exam Outcomes</h1>
                    <p className="text-muted-foreground">Manage exam outcomes and their mappings</p>
                </div>
                <Link href="/exam-outcomes/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Exam Outcome
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by ID, Exam, or Outcome..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>EXAM</TableHead>
                            <TableHead>COURSE OUTCOME</TableHead>
                            <TableHead>WEIGHTAGE</TableHead>
                            <TableHead>ATTAINMENT</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading exam outcomes...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredOutcomes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    {searchQuery ? "No matching results found." : "No exam outcomes found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOutcomes.map((outcome) => (
                                <TableRow key={outcome.id}>
                                    <TableCell>{outcome.id}</TableCell>
                                    <TableCell>{outcome.exam}</TableCell>
                                    <TableCell>{outcome.course_outcome}</TableCell>
                                    <TableCell>{outcome.weightage}</TableCell>
                                    <TableCell>{outcome.attainment_level_achieved}</TableCell>
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
                                                <Link href={`/exam-outcomes/${outcome.id}/edit`}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => outcome.id && handleDelete(outcome.id)}
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