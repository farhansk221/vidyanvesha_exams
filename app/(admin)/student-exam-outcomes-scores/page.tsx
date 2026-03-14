"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
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

export default function StudentExamOutcomesScoresPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Student Exam Outcomes Scores</h1>
                <p className="text-muted-foreground">Manage student scores for exam outcomes</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search student outcome scores..." className="pl-9" />
                </div>
                <Link href="/student-exam-outcomes-scores/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Outcome Score
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>STUDENT</TableHead>
                            <TableHead>EXAM OUTCOME</TableHead>
                            <TableHead>SCORE</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No student outcome scores found. Click &quot;Create Outcome Score&quot; to get started.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}