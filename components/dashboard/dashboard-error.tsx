'use client';

import { Card, CardContent } from '@/components/ui/card';

interface DashboardErrorProps {
  error: string;
}

export function DashboardError({ error }: DashboardErrorProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-red-500">{error}</p>
      </CardContent>
    </Card>
  );
}

