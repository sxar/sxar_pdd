'use client';

import PageLayout from '@/components/PageLayout';
import SimpleTable from './components/SimpleTable';

export default function TablePage() {
  return (
    <PageLayout
      title="Data Table"
      description="Sortable table with row reordering (simplified demo)"
    >
      <SimpleTable />
    </PageLayout>
  );
}
