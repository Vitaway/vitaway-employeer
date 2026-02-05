"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PopulationHealthData, ApiResponse } from "@/types";
import { AlertCircle } from "lucide-react";
import { getPopulationHealth } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";

export default function PopulationHealthPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'auth' | 'server' | 'network'>('network');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const response = await getPopulationHealth() as ApiResponse<any>;
      
      if (response?.success && response.data) {
        setData(response.data);
        setError(null);
      } else {
        setData(null);
        setError(response?.message || "Failed to load population health data");
        setErrorType('server');
      }
    } catch (err: any) {
      console.error("Error fetching population health data:", err);
      const message = err instanceof Error ? err.message : String(err);
      
      if (message.includes('Unauthenticated') || message.includes('401')) {
        setErrorType('auth');
        setError('You need to login to view this data');
      } else if (message.includes('500')) {
        setErrorType('server');
        setError(message);
      } else {
        setErrorType('network');
        setError(message || "Failed to fetch population health data");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading population health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Population Health Overview</h1>
          <p className="text-muted-foreground">Aggregated health metrics and risk analysis</p>
        </div>
        <Card className={errorType === 'auth' ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${errorType === 'auth' ? 'text-yellow-900' : 'text-red-900'}`}>
              <AlertCircle className="h-5 w-5" />
              {errorType === 'auth' ? 'Authentication Required' : 'Error Loading Data'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{error}</p>
            <div className="flex gap-2">
              {errorType === 'auth' && !isAuthenticated ? (
                <Button onClick={() => router.push('/login')} size="sm">Go to Login</Button>
              ) : (
                <Button onClick={() => fetchData()} size="sm" disabled={loading}>
                  {loading ? 'Retrying...' : 'Retry'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return <div>Error loading data</div>;
  }

  // Map API response to chart format
  const bmiData = data.bmi_distribution ? [
    { name: "Underweight", value: data.bmi_distribution.underweight?.count || 0 },
    { name: "Normal", value: data.bmi_distribution.normal?.count || 0 },
    { name: "Overweight", value: data.bmi_distribution.overweight?.count || 0 },
    { name: "Obese", value: data.bmi_distribution.obese?.count || 0 },
  ] : [];

  const bloodPressureData = data.blood_pressure_risk ? [
    { name: "Normal", value: data.blood_pressure_risk.normal || 0 },
    { name: "Elevated", value: data.blood_pressure_risk.elevated || 0 },
    { name: "High", value: data.blood_pressure_risk.high || 0 },
  ] : [];

  const diabetesRiskData = data.diabetes_risk ? [
    { name: "Low", value: data.diabetes_risk.low || 0 },
    { name: "Moderate", value: data.diabetes_risk.moderate || 0 },
    { name: "High", value: data.diabetes_risk.high || 0 },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Population Health Overview
        </h1>
        <p className="text-muted-foreground">
          Aggregated health trends and risk indicators for your organization
        </p>
      </div>

      {/* Important Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertCircle className="h-5 w-5" />
            Data Privacy Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          All data displayed is aggregated and anonymized. Individual health
          records are not accessible through this dashboard. Risk indicators are
          for informational purposes only and do not constitute medical
          diagnoses or recommendations.
        </CardContent>
      </Card>

      {/* BMI Distribution */}
      <ChartCard
        title="BMI Distribution"
        data={bmiData}
        type="bar"
        description={`Body Mass Index distribution across ${data.total_enrolled || 0} enrolled employees`}
      />

      {/* Risk Indicators Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Blood Pressure Risk Levels"
          data={bloodPressureData}
          type="pie"
          colors={["#10b981", "#f59e0b", "#ef4444"]}
          description="Aggregated blood pressure risk assessment"
        />
        <ChartCard
          title="Diabetes Risk Indicators"
          data={diabetesRiskData}
          type="pie"
          colors={["#10b981", "#f59e0b", "#ef4444"]}
          description="Diabetes risk screening results"
        />
      </div>

      {/* Summary Stats from API */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Enrolled Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.total_enrolled?.toLocaleString() || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Employees with health data in the system
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
