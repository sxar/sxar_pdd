'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForExternal, monitorForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { containsFiles, getFiles } from '@atlaskit/pragmatic-drag-and-drop/external/file';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import styles from '../file.module.css';

interface FileUploadData {
  type: 'image';
  dataUrl: string;
  name: string;
  size: number;
}

export default function FileUpload() {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<'idle' | 'potential' | 'over'>('idle');
  const [uploads, setUploads] = useState<FileUploadData[]>([]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setUploads((prev) => [
          ...prev,
          {
            type: 'image',
            dataUrl,
            name: file.name,
            size: file.size,
          },
        ]);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    const element = dropZoneRef.current;
    invariant(element);

    return combine(
      dropTargetForExternal({
        element,
        canDrop: containsFiles,
        onDragEnter: () => setState('over'),
        onDragLeave: () => setState('potential'),
        onDrop: async ({ source }) => {
          const files = await getFiles({ source });
          files.forEach((file) => {
            if (file) processFile(file);
          });
          setState('idle');
        },
      }),
      monitorForExternal({
        canMonitor: containsFiles,
        onDragStart: () => {
          setState('potential');
          preventUnhandled.start();
        },
        onDrop: () => {
          setState('idle');
          preventUnhandled.stop();
        },
      })
    );
  }, [processFile]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(processFile);
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div
        ref={dropZoneRef}
        className={styles.dropZone}
        data-state={state}
        data-testid="file-drop-zone"
      >
        <div className={styles.dropZoneIcon}>📁</div>
        <p className={styles.dropZoneText}>
          Drop images here
        </p>
        <p className={styles.dropZoneSubtext}>
          or
        </p>
        <button
          type="button"
          className={styles.selectButton}
          onClick={handleSelectClick}
        >
          Select Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.fileInput}
          onChange={handleFileInputChange}
        />
      </div>

      {uploads.length > 0 && (
        <div className={styles.gallery}>
          {uploads.map((upload, index) => (
            <div key={index} className={styles.fileCard} data-testid="uploaded-file">
              <img
                src={upload.dataUrl}
                alt={upload.name}
                className={styles.fileImage}
              />
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{upload.name}</div>
                <div className={styles.fileSize}>
                  {Math.round(upload.size / 1024)} KB
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
