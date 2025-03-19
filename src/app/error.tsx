'use client';

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <AlertTriangle className="size-6"/>
            <p className=" flex items-center justify-center flex-col "> Something went wrong </p>
            <Button variant='secondary' asChild>
                <Link href='/'> Back to Home</Link>
            </Button>
        </div>
    )
}