import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            <p className="text-gray-500">Oops! The page you’re looking for doesn’t exist.</p>
            <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Go Home
            </Link>
        </div>
    );
}
