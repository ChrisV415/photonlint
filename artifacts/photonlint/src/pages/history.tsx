import { useListDrcRuns } from '@workspace/api-client-react';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload } from 'lucide-react';
import { useLocation } from 'wouter';

export default function History() {
  const [, setLocation] = useLocation();
  const { data: runs, isLoading, isError } = useListDrcRuns();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Run History</h1>
          <p className="text-muted-foreground mt-1">View all past DRC check results</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">Loading history...</p>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-destructive font-medium">Failed to load run history.</p>
              <p className="text-sm text-muted-foreground mt-1">Check your connection and refresh the page.</p>
            </CardContent>
          </Card>
        ) : runs && runs.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>All Runs</CardTitle>
              <CardDescription>{runs.length} total checks performed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Foundry</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Checked At</TableHead>
                    <TableHead>Processing Time</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((run) => (
                    <TableRow
                      key={run.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setLocation(`/results/${run.id}`)}
                      data-testid={`row-run-${run.id}`}
                    >
                      <TableCell>
                        <StatusBadge status={run.status} />
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">{run.filename}</TableCell>
                      <TableCell className="text-sm">{run.foundryName}</TableCell>
                      <TableCell>
                        <span
                          className={`font-mono font-semibold ${run.violationCount > 0 ? 'text-destructive' : 'text-green-600'}`}
                          data-testid={`text-violations-${run.id}`}
                        >
                          {run.violationCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {(() => { const d = new Date(run.checkedAt); return isNaN(d.getTime()) ? '—' : d.toLocaleString(); })()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {Number.isFinite(run.processingTimeMs) ? `${run.processingTimeMs}ms` : '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/results/${run.id}`);
                          }}
                          data-testid={`button-view-${run.id}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12 space-y-4">
              <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold">No DRC runs yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload your first GDSII file to get started
                </p>
              </div>
              <Button onClick={() => setLocation('/')} data-testid="button-upload-first">
                Upload Layout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
