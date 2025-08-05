# Files Components

Универсальная система компонентов для загрузки файлов с поддержкой drag & drop и интеграцией с Zustand store.

## Компоненты

### `Files`
Основной компонент, который объединяет кнопку загрузки и зону drag & drop. Можно обернуть вокруг любого компонента.

#### Props
- `children` - ReactNode - Дочерние элементы (кнопка, зона и т.д.)
- `onFilesSelected` - (files: File[]) => void - Callback при выборе файлов
- `onUploadComplete` - (fileId: string) => void - Callback при успешной загрузке
- `onUploadError` - (error: string) => void - Callback при ошибке загрузки
- `accept` - string - Типы файлов для принятия
- `multiple` - boolean - Разрешить множественную загрузку
- `disabled` - boolean - Отключить компонент
- `className` - string - CSS классы
- `dragActiveClassName` - string - CSS классы при активном drag

#### Пример использования
```tsx
<Files
  onFilesSelected={handleFilesSelected}
  onUploadComplete={handleUploadComplete}
  onUploadError={handleUploadError}
  multiple
  className="cursor-pointer"
  dragActiveClassName="border-primary bg-primary/10"
>
  <Button>📤 Upload Files</Button>
</Files>
```

### `FilesZone`
Компонент для отображения загружаемых файлов с прогресс-барами и статусами.

#### Props
- `className` - string - CSS классы
- `showCompleted` - boolean - Показывать завершенные файлы
- `onFileComplete` - (fileId: string) => void - Callback при завершении файла

#### Пример использования
```tsx
<FilesZone className="mb-4" showCompleted={true} />
```

### `useFilesUpload`
Хук для интеграции с Zustand store.

#### Возвращает
- `handleFilesSelected` - (files: File[]) => void
- `handleUploadComplete` - (fileId: string) => void
- `handleUploadError` - (error: string) => void

#### Пример использования
```tsx
const { handleFilesSelected, handleUploadComplete, handleUploadError } = useFilesUpload();
```

### `useFilesStore`
Zustand store для управления состоянием загрузки файлов.

#### Методы
- `addFile(file: File)` - Добавить файл в очередь загрузки
- `updateProgress(id: string, progress: number)` - Обновить прогресс
- `completeUpload(id: string, fileId: string)` - Завершить загрузку
- `setError(id: string, error: string)` - Установить ошибку
- `removeFile(id: string)` - Удалить файл
- `clearAll()` - Очистить все файлы

## Примеры использования

### Простая кнопка загрузки
```tsx
import { Files, FilesZone, useFilesUpload } from 'hasyx/components/files';
import { Button } from 'hasyx/components/ui/button';

export default function SimpleUpload() {
  const { handleFilesSelected, handleUploadComplete, handleUploadError } = useFilesUpload();

  return (
    <div>
      <Files
        onFilesSelected={handleFilesSelected}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        multiple
      >
        <Button>📤 Upload Files</Button>
      </Files>
      <FilesZone />
    </div>
  );
}
```

### Кастомная зона drop & drop
```tsx
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
    <div className="text-lg font-medium">Drop files here</div>
    <div className="text-sm text-muted-foreground">
      or click to select files
    </div>
  </div>
</Files>
```

### Загрузка только изображений
```tsx
<Files
  onFilesSelected={handleFilesSelected}
  onUploadComplete={handleUploadComplete}
  onUploadError={handleUploadError}
  accept="image/*"
  multiple={false}
>
  <Button>🖼️ Upload Image</Button>
</Files>
```

## Особенности

1. **Универсальность**: `Files` можно обернуть вокруг любого компонента
2. **Drag & Drop**: Поддержка перетаскивания файлов
3. **Прогресс загрузки**: Автоматическое отображение прогресса
4. **Zustand интеграция**: Централизованное управление состоянием
5. **Типизация**: Полная TypeScript поддержка
6. **Кастомизация**: Гибкие CSS классы для стилизации

## Тестирование

Запуск тестов:
```bash
npm test components/files/files.test.ts -- -t "FilesStore"
``` 