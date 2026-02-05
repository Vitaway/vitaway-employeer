"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle, Copy } from "lucide-react";
import { getToken } from "@/lib/api-client";

export default function ApiTestPage() {
    const [results, setResults] = useState<any[]>([]);
    const [testing, setTesting] = useState(false);
    const [baseUrl, setBaseUrl] = useState("http://127.0.0.1:8000/api/org");

    const tests: Array<{
        name: string;
        endpoint: string;
        method: string;
        description: string;
        testUrl?: (base: string) => string;
        body?: any;
        requiresAuth?: boolean;
    }> = [
            {
                name: "Backend Reachability",
                endpoint: "",
                method: "GET",
                description: "Check if backend server is responding",
                testUrl: (base: string) => base.replace("/api/org", ""),
            },
            {
                name: "API Base Check",
                endpoint: "/",
                method: "GET",
                description: "Verify /api/org is accessible",
            },
            {
                name: "Login Endpoint",
                endpoint: "/auth/login",
                method: "POST",
                description: "Check if login endpoint exists (will return validation errors)",
                body: {},
            },
            {
                name: "Dashboard Overview",
                endpoint: "/dashboard/overview",
                method: "GET",
                description: "Test dashboard metrics endpoint",
                requiresAuth: true,
            },
            {
                name: "Profile Endpoint",
                endpoint: "/profile",
                method: "GET",
                description: "Test organization profile endpoint",
                requiresAuth: true,
            },
            {
                name: "Population Health Analytics",
                endpoint: "/analytics/population-health",
                method: "GET",
                description: "Test population health data endpoint",
                requiresAuth: true,
            },
            {
                name: "Engagement Analytics",
                endpoint: "/analytics/engagement",
                method: "GET",
                description: "Test engagement metrics endpoint",
                requiresAuth: true,
            },
            {
                name: "List Employees",
                endpoint: "/employees",
                method: "GET",
                description: "Test employee list endpoint",
                requiresAuth: true,
            },
        ];

    async function runTests() {
        setTesting(true);
        setResults([]);
        const testResults = [];
        const token = getToken();

        for (const test of tests) {
            try {
                const url = test.testUrl ? test.testUrl(baseUrl) : `${baseUrl}${test.endpoint}`;
                const headers: any = {
                    Accept: "application/json",
                };

                if (test.requiresAuth && token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                if (test.body) {
                    headers["Content-Type"] = "application/json";
                }

                const startTime = Date.now();
                const response = await fetch(url, {
                    method: test.method,
                    headers,
                    body: test.body ? JSON.stringify(test.body) : undefined,
                });
                const duration = Date.now() - startTime;

                let data;
                const contentType = response.headers.get("content-type");
                if (contentType?.includes("application/json")) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }

                testResults.push({
                    ...test,
                    success: response.ok || response.status < 500,
                    status: response.status,
                    statusText: response.statusText,
                    duration,
                    data,
                    url,
                });
            } catch (error: any) {
                testResults.push({
                    ...test,
                    success: false,
                    error: error.message,
                    url: test.testUrl ? test.testUrl(baseUrl) : `${baseUrl}${test.endpoint}`,
                });
            }
        }

        setResults(testResults);
        setTesting(false);
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">API Diagnostics</h1>
                    <p className="text-muted-foreground">
                        Test backend API connectivity and endpoints
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="baseUrl">API Base URL</Label>
                            <Input
                                id="baseUrl"
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                placeholder="http://127.0.0.1:8000/api/org"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={runTests} disabled={testing}>
                                {testing ? "Running Tests..." : "Run All Tests"}
                            </Button>
                            {results.length > 0 && (
                                <Button variant="outline" onClick={() => setResults([])}>
                                    Clear Results
                                </Button>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>
                                <strong>Token:</strong>{" "}
                                {getToken() ? (
                                    <span className="text-green-600">✓ Present</span>
                                ) : (
                                    <span className="text-yellow-600">⚠ Not logged in</span>
                                )}
                            </p>
                            <p>
                                <strong>Environment:</strong> {process.env.NODE_ENV || "development"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {results.length > 0 && (
                    <div className="space-y-4">
                        {results.map((result, index) => (
                            <Card
                                key={index}
                                className={
                                    result.success
                                        ? "border-green-200 bg-green-50"
                                        : "border-red-200 bg-red-50"
                                }
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        {result.success ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        )}
                                        {result.name}
                                        {result.status && (
                                            <span
                                                className={`ml-auto text-sm font-mono ${result.success ? "text-green-700" : "text-red-700"
                                                    }`}
                                            >
                                                {result.status} {result.statusText}
                                            </span>
                                        )}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {result.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <code className="flex-1 bg-white px-3 py-2 rounded border text-xs">
                                            {result.method} {result.url}
                                        </code>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(result.url)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {result.duration && (
                                        <p className="text-xs text-muted-foreground">
                                            Response time: {result.duration}ms
                                        </p>
                                    )}

                                    {result.error && (
                                        <div className="bg-red-100 p-3 rounded">
                                            <p className="text-sm text-red-800 font-medium">Error:</p>
                                            <pre className="text-xs text-red-900 mt-1 whitespace-pre-wrap">
                                                {result.error}
                                            </pre>
                                        </div>
                                    )}

                                    {result.data && (
                                        <details className="text-xs">
                                            <summary className="cursor-pointer font-medium text-sm mb-2">
                                                Response Data
                                            </summary>
                                            <pre className="bg-white p-3 rounded border overflow-x-auto">
                                                {typeof result.data === "string"
                                                    ? result.data
                                                    : JSON.stringify(result.data, null, 2)}
                                            </pre>
                                        </details>
                                    )}

                                    {result.requiresAuth && !getToken() && (
                                        <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                                            <AlertCircle className="h-4 w-4" />
                                            This endpoint requires authentication. Login first to test.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
