'use client'

import { SupportedExportFormats } from '@/types/export';
import { forwardRef } from 'react';

interface Props {
  onImport: (data: SupportedExportFormats) => void;
}

export const TextReader = forwardRef<HTMLInputElement, Props> (({ onImport }, ref) => {
    return <input
            ref={ref}
            id="import-file"
            className="sr-only"
            tabIndex={-1}
            type="file"
            accept=".json"
            onChange={(e) => {
            if (!e.target.files?.length) return;

            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                let json = JSON.parse(e.target?.result as string);
                onImport(json);
            };
            reader.readAsText(file);
            }}
        />
})

TextReader.displayName = 'text-reader'