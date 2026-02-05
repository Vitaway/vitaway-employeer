"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Report, ExportHistory, ApiResponse } from "@/types";
import { FileText, Download, Calendar, AlertCircle } from "lucide-react";
import { getReports } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'auth' | 'server' | 'network'>('network');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  async function fetchReports() {
    try {
      setLoading(true);
      setError(null);
      const response = await getReports({ page: currentPage }) as ApiResponse<any>;
      
      if (response?.success && response.data) {
        setReports(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
        setError(null);
      } else {
        setReports([]);
        setError(response?.message || "Failed to load reports");
        setErrorType('server');
      }
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      const message = err instanceof Error ? err.message : String(err);
      
      if (message.includes('Unauthenticated') || message.includes('401')) {
        setErrorType('auth');
        setError('You need to login to view reports');
      } else if (message.includes('500')) {
        setErrorType('server');
        setError(message);
      } else {
        setErrorType('network');
        setError(message || "Failed to fetch reports");
      }
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const reportColumns = [
    {
      key: "reportType",
      label: "Report Type",
    },
    {
      key: "format",
      label: "Format",
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: "generatedAt",
      label: "Generated",
      render: (value: Date) => new Date(value).toLocaleString(),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : value === "GENERATING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "downloadUrl",
      label: "Action",
      render: (value: string | undefined, row: Report) =>
        row.status === "COMPLETED" ? (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        ) : null,
    },
  ];

  const exportColumns = [
    {
      key: "dataType",
      label: "Data Type",
    },
    {
      key: "format",
      label: "Format",
    },
    {
      key: "recordCount",
      label: "Records",
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: "exportedBy",
      label: "Exported By",
    },
    {
      key: "exportedAt",
      label: "Exported At",
      render: (value: Date) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Exports
        </h1>
        <p className="text-muted-foreground">
          Generate reports and export data for internal review and compliance
        </p>
      </div>

      {/* Important Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="h-5 w-5" />
            Export Audit Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-800">
          All data exports are audited and logged for compliance purposes. Only
          aggregated data is available for export. Individual health records
          require specific consent and are subject to additional approval
          processes.
        </CardContent>
      </Card>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="generate">Generate New Report</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <DataTable
                  data={reports}
                  columns={reportColumns}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  emptyMessage="No reports generated yet"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>
                Create a formal summary report for internal review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Type *</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="reportType"
                          value="population-health"
                          className="h-4 w-4"
                        />
                        <div>
                          <p className="font-medium">Population Health Summary</p>
                          <p className="text-xs text-muted-foreground">
                            Aggregated health metrics and risk distribution
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="reportType"
                          value="engagement"
                          className="h-4 w-4"
                        />
                        <div>
                          <p className="font-medium">Engagement Analytics</p>
                          <p className="text-xs text-muted-foreground">
                            Platform usage and participation metrics
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="reportType"
                          value="program-completion"
                          className="h-4 w-4"
                        />
                        <div>
                          <p className="font-medium">Program Completion</p>
                          <p className="text-xs text-muted-foreground">
                            Health program participation and outcomes
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="reportType"
                          value="monthly-summary"
                          className="h-4 w-4"
                        />
                        <div>
                          <p className="font-medium">Monthly Summary</p>
                          <p className="text-xs text-muted-foreground">
                            Comprehensive monthly overview
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Output Format *</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="format"
                          value="PDF"
                          className="h-4 w-4"
                        />
                        <span className="text-sm">PDF (Formatted Report)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="format"
                          value="CSV"
                          className="h-4 w-4"
                        />
                        <span className="text-sm">CSV (Data Export)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="date"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">to</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="date"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>
                Audit trail of all data exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <DataTable
                  data={exportHistory}
                  columns={exportColumns}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  emptyMessage="No export history available"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
