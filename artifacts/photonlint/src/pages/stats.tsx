import { useGetDrcStats } from '@workspace/api-client-react';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Stats() {
  const { data: stats, isLoading } = useGetDrcStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto p-8">
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">Loading statistics...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto p-8">
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No statistics available</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const passRateData = [
    { name: 'Pass', value: stats.passCount, color: 'hsl(142, 70%, 45%)' },
    { name: 'Fail', value: stats.failCount, color: 'hsl(0, 72%, 51%)' },
    { name: 'Error', value: stats.errorCount, color: 'hsl(38, 92%, 50%)' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground mt-1">Aggregate metrics across all DRC runs</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Runs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono" data-testid="text-total-runs">
                {stats.totalRuns}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pass Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono text-green-600" data-testid="text-pass-rate">
                {stats.passRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Violations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono text-destructive" data-testid="text-total-violations">
                {stats.totalViolations}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Violations/Run</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono" data-testid="text-avg-violations">
                {stats.avgViolationsPerRun.toFixed(1)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pass/Fail Distribution</CardTitle>
              <CardDescription>Breakdown of all run outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={passRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {passRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Violations</CardTitle>
              <CardDescription>Most frequent rule failures</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.commonViolations.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.commonViolations} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      type="category"
                      dataKey="rule"
                      stroke="hsl(var(--muted-foreground))"
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                      formatter={(value: number, _name: string, props: { payload?: { percentage?: number } }) => [
                        `${value} (${(props.payload?.percentage ?? 0).toFixed(1)}%)`,
                        'Count',
                      ]}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No violation data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {stats.commonViolations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Violation Details</CardTitle>
              <CardDescription>Top violations by frequency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.commonViolations.map((violation, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    data-testid={`violation-detail-${idx}`}
                  >
                    <div>
                      <p className="font-mono font-semibold text-sm">{violation.rule}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {violation.percentage.toFixed(1)}% of all violations
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-mono text-destructive">{violation.count}</p>
                      <p className="text-xs text-muted-foreground">occurrences</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
