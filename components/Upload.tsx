import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  PROGRESS_INCREMENT,
  PROGRESS_INTERVAL_MS,
  REDIRECT_DELAY_MS,
} from '../lib/constants';

const Upload = ({ onComplete }: { onComplete: (base64: string) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isSignedIn } = useOutletContext<AuthContext>();

  const intervalRef = useRef<number | null>(null);

  const clearProgressInterval = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // const onComplete = useCallback((base64: string) => {
  //   // Intentionally minimal: current Upload component has no navigation hook.
  //   // Replace with real redirect/action when wired by the parent route.
  //   // eslint-disable-next-line no-console
  //   console.log('Upload complete (base64):', base64.slice(0, 80) + '...');
  // }, []);

  const processFile = useCallback(
    (files: FileList | File[]) => {
      if (!isSignedIn) return;

      const firstFile = Array.isArray(files) ? files[0] : files[0];
      if (!firstFile) return;

      clearProgressInterval();
      setFile(firstFile);
      setProgress(0);

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== 'string') return;

        const base64 = result;

        intervalRef.current = window.setInterval(() => {
          setProgress((prev) => {
            const next = Math.min(100, prev + PROGRESS_INCREMENT);
            if (next >= 100) {
              clearProgressInterval();

              window.setTimeout(() => {
                onComplete(base64);
              }, REDIRECT_DELAY_MS);
            }
            return next;
          });
        }, PROGRESS_INTERVAL_MS);
      };

      reader.onerror = () => {
        clearProgressInterval();
        // eslint-disable-next-line no-console
        console.error('FileReader error');
      };

      reader.readAsDataURL(firstFile);
    },
    [isSignedIn, onComplete],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isSignedIn) return;
      const files = e.target.files;
      if (!files || files.length === 0) return;
      processFile(files);
    },
    [isSignedIn, processFile],
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isSignedIn) return;
      setIsDragging(true);
    },
    [isSignedIn],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isSignedIn) return;
      setIsDragging(true);
    },
    [isSignedIn],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isSignedIn) return;
      setIsDragging(false);
    },
    [isSignedIn],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isSignedIn) return;

      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;
      processFile(files);
    },
    [isSignedIn, processFile],
  );

  return (
    <div className='upload'>
      {!file ? (
        <div
          className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type='file'
            className='drop-input'
            disabled={!isSignedIn}
            accept='.jpg,.jpeg,.png'
            onChange={handleInputChange}
          />
          <div className='drop-content'>
            <div className='drop-icon'>
              <UploadIcon size={20} />
            </div>
            <p>
              {isSignedIn
                ? 'Click to upload or just drag and drop'
                : 'Please log in to upload your floor plan'}
            </p>
            <p className='help'>Maximum file size: 10MB</p>
          </div>
        </div>
      ) : (
        <div className='upload-status'>
          <div className='status-content'>
            <div className='status-icon'>
              {progress === 100 ? (
                <CheckCircle2 className='check' />
              ) : (
                <ImageIcon className='image' />
              )}
            </div>
            <h3>{file?.name}</h3>
            <div className='progress'>
              <div className='bar' style={{ width: `${progress}%` }} />
              <p className='status-text'>
                {progress < 100 ? 'Analyzing floor plan...' : 'Redirecting...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
