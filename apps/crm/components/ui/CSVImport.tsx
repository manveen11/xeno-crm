'use client';

import { useState, useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

export function CSVImport() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/customers/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully imported ${data.count} customers!`);
        router.refresh();
      } else {
        toast.error(`Error importing customers: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('An error occurred during import.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 text-xs"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? 'Importing...' : 'Import CSV'}
      </Button>
      
      <a href="/customer_template.csv" download>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-xs w-full sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Template
        </Button>
      </a>
    </div>
  );
}
