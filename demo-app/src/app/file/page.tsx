'use client';

import PageLayout from '@/components/PageLayout';
import FileUpload from './components/FileUpload';

export default function FilePage() {
  return (
    <PageLayout
      title="File Upload"
      description="External drag adapter for file drops from desktop"
    >
      <FileUpload />
    </PageLayout>
  );
}
