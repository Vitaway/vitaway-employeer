"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { DashboardMetrics, ApiResponse } from "@/types";
import { getDashboardMetrics } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'auth' | 'server' | 'network'>('network');
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  async function fetchMetrics() {
    try {
      setLoading(true);
      const response = await getDashboardMetrics() as ApiResponse<DashboardMetrics>;

      if (response?.success && response.data) {
        // Map snake_case API response to camelCase TypeScript interface
        const apiData = response.data as any;
        setMetrics({
          totalEmployees: apiData.total_employees ?? 0,
          activeUsers: apiData.active_users ?? 0,
          inactiveUsers: apiData.inactive_users ?? 0,
          engagementRate: apiData.engagement_rate ?? 0,
          programParticipationRate: apiData.program_participation_rate ?? 0,
          riskDistribution: {
            low: apiData.risk_distribution?.low ?? 0,
            medium: apiData.risk_distribution?.medium ?? 0,
            high: apiData.risk_distribution?.high ?? 0,
          },
          outcomeIndicators: apiData.outcome_indicators ? {
            improved: apiData.outcome_indicators.improved ?? 0,
            stable: apiData.outcome_indicators.stable ?? 0,
            declined: apiData.outcome_indicators.declined ?? 0,
          } : undefined,
        });
        setError(null);
      } else {
        setMetrics(null);
        setError(response?.message || "Dashboard API returned an error");
      }
    } catch (err: any) {
      console.error("Error fetching metrics:", err);
      const message = err instanceof Error ? err.message : String(err);
      
      // Detect error type
      if (message.includes('Unauthenticated') || message.includes('401')) {
        setErrorType('auth');
        setError('You need to login to view dashboard metrics');
      } else if (message.includes('undefined method') || message.includes('500')) {
        setErrorType('server');
        setError(message);
      } else {
        setErrorType('network');
        setError(message || "Failed to fetch dashboard metrics");
      }
      
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isDev = process.env.NODE_ENV !== "production";
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Key metrics and performance indicators for your organization</p>
        </div>
        
        {errorType === 'auth' ? (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <AlertCircle className="h-5 w-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-yellow-800">
                You need to be logged in to view dashboard metrics.
                {!isAuthenticated && " Please login to continue."}
              </p>
              <div className="flex gap-2">
                {!isAuthenticated ? (
                  <Button onClick={() => router.push('/login')} size="sm">
                    Go to Login
                  </Button>
                ) : (
                  <Button onClick={() => fetchMetrics()} size="sm" disabled={loading}>
                    {loading ? 'Retrying...' : 'Retry'}
                  </Button>
                )}
              </div>
              {user && (
                <p className="text-xs text-yellow-700">
                  Logged in as: {user.email}
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertCircle className="h-5 w-5" />
                {errorType === 'server' ? 'Backend Error' : 'Connection Error'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-red-800">
              <p className="font-medium">
                {errorType === 'server' 
                  ? 'The backend encountered an error processing your request.' 
                  : 'We couldn\'t connect to the backend server.'}
              </p>
              <div className="flex gap-2 items-center">
                <button
                  className="inline-flex items-center rounded bg-red-600 px-3 py-1 text-white text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  onClick={() => setShowDetails((s) => !s)}
                >
                  {showDetails ? "Hide details" : "Show details"}
                </button>
                <button
                  className="inline-flex items-center rounded border border-red-300 bg-white px-3 py-1 text-sm text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  onClick={() => fetchMetrics()}
                  disabled={loading}
                >
                  {loading ? "Retrying..." : "Retry"}
                </button>
              </div>

              {showDetails && (
                <pre className="whitespace-pre-wrap wrap-break-word bg-red-100 p-3 rounded text-xs text-red-900">
                  {isDev ? error : "An internal error occurred. Contact support."}
                </pre>
              )}

              <div>
                <p className="font-semibold mb-1">Troubleshooting</p>
                <ul className="list-disc list-inside ml-2 text-xs space-y-1">
                  <li>Backend URL: <code className="bg-red-100 px-2 py-1 rounded">http://127.0.0.1:8000/api/org</code></li>
                  <li>Endpoint: <code className="bg-red-100 px-2 py-1 rounded">GET /dashboard/overview</code></li>
                  {errorType === 'server' && (
                    <li className="text-yellow-700 font-medium">Check Laravel logs: <code className="bg-red-100 px-2 py-1 rounded">storage/logs/laravel.log</code></li>
                  )}
                  {errorType === 'network' && (
                    <li className="text-yellow-700 font-medium">Ensure Laravel is running: <code className="bg-red-100 px-2 py-1 rounded">php artisan serve</code></li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (!metrics) {
    return <div>Error loading metrics</div>;
  }

  const riskDistributionData = [
    { name: "Low", value: metrics.riskDistribution.low },
    { name: "Medium", value: metrics.riskDistribution.medium },
    { name: "High", value: metrics.riskDistribution.high },
  ];

  const engagementTrendData = [
    { name: "Week 1", value: 72 },
    { name: "Week 2", value: 75 },
    { name: "Week 3", value: 76 },
    { name: "Week 4", value: 78.4 },
  ];

  const outcomeData = metrics.outcomeIndicators ? [
    { name: "Improved", value: metrics.outcomeIndicators.improved },
    { name: "Stable", value: metrics.outcomeIndicators.stable },
    { name: "Declined", value: metrics.outcomeIndicators.declined },
  ] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor your organization's health and engagement metrics
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Employees"
          value={metrics.totalEmployees.toLocaleString()}
          icon={Users}
          description="Enrolled in platform"
        />
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers.toLocaleString()}
          icon={Activity}
          description={`${metrics.inactiveUsers} inactive`}
          trend={{ value: 5.2, isPositive: true }}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${metrics.engagementRate}%`}
          icon={TrendingUp}
          description="Last 30 days"
          trend={{ value: 2.1, isPositive: true }}
        />
        <MetricCard
          title="Program Participation"
          value={`${metrics.programParticipationRate}%`}
          icon={AlertCircle}
          description="Enrolled in at least one program"
          trend={{ value: 3.5, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Risk Category Distribution"
          data={riskDistributionData}
          type="pie"
          colors={["#10b981", "#f59e0b", "#ef4444"]}
          description="Employee risk categorization (non-diagnostic)"
        />
        <ChartCard
          title="Engagement Trend"
          data={engagementTrendData}
          type="line"
          description="Weekly engagement rate percentage"
        />
      </div>

      {/* Outcome Indicators (if available) */}
      {outcomeData && (
        <div className="grid gap-6">
          <ChartCard
            title="Health Outcome Indicators"
            data={outcomeData}
            type="bar"
            colors={["#10b981", "#3b82f6", "#ef4444"]}
            description="Employee health outcome trends"
          />
        </div>
      )}

      {/* Additional Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Estimated Cost Impact
          </h3>
          <p className="mt-2 text-2xl font-bold">$125,000</p>
          <p className="text-xs text-muted-foreground mt-1">
            Projected annual savings from preventive care
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Average Health Score
          </h3>
          <p className="mt-2 text-2xl font-bold">7.8/10</p>
          <p className="text-xs text-muted-foreground mt-1">
            Aggregated population health indicator
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Program Completion
          </h3>
          <p className="mt-2 text-2xl font-bold">892</p>
          <p className="text-xs text-muted-foreground mt-1">
            Programs completed this month
          </p>
        </div>
      </div>
    </div>
  );
}
