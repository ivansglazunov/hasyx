'use client';

import React from 'react';
import { Files, FilesZone, useFilesUpload } from './index';
import { Button } from 'hasyx/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { useTranslations } from 'hasyx';

export default function FilesExample() {
  const tFiles = useTranslations('files');
  const { handleFilesSelected, handleUploadComplete, handleUploadError } = useFilesUpload();

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{tFiles('example.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Простая кнопка с dropzone */}
          <div>
            <h3 className="text-lg font-medium mb-2">{tFiles('example.simpleButton')}</h3>
            <Files
              onFilesSelected={handleFilesSelected}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              multiple
              className="inline-block"
            >
              <Button>
                {tFiles('example.uploadFiles')}
              </Button>
            </Files>
          </div>

          {/* Кастомная зона загрузки */}
          <div>
            <h3 className="text-lg font-medium mb-2">{tFiles('example.customDropZone')}</h3>
            <Files
              onFilesSelected={handleFilesSelected}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              multiple
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              dragActiveClassName="border-primary bg-primary/10"
            >
              <div className="space-y-2">
                <div className="text-4xl">📁</div>
                <div className="text-lg font-medium">{tFiles('example.dropHere')}</div>
                <div className="text-sm text-muted-foreground">
                  {tFiles('example.orClick')}
                </div>
              </div>
            </Files>
          </div>

          {/* Зона отображения загружаемых файлов */}
          <div>
            <h3 className="text-lg font-medium mb-2">{tFiles('example.uploadingFiles')}</h3>
            <FilesZone />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 