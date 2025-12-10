'use client';

import { usePWA } from '../hooks/use-pwa';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Download, X, RefreshCw, Share2, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'hasyx';

export function PWAInstallPrompt() {
  const [show, setShow] = useState(true);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const tPwa = useTranslations('pwa');

  const { 
    isSupported,
    isInstalled,
    installPromptAvailable,
    updateAvailable,
    displayMode,
    platform,
    install,
    update,
    dismissUpdate
  } = usePWA();

  // Don't show anything if PWA is not supported or already installed
  if (!isSupported || isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    if (platform === 'ios') {
      // For iOS, show modal with instructions instead of calling install()
      setShowIOSModal(true);
    } else {
      // For other platforms, use the standard install flow
      await install();
    }
  };

  return (
    <>
      {/* Install Prompt */}
      {installPromptAvailable && show && (
        <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5" />
                {tPwa('install.title')}
              </CardTitle>
            </div>
            <CardDescription>
              {platform === 'ios' 
                ? tPwa('install.description.ios') || 'Установите приложение на ваш iPhone или iPad'
                : tPwa('install.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button onClick={handleInstall} className="flex-1">
                {tPwa('install.install')}
              </Button>
              <Button variant="outline" onClick={() => setShow(false)}>
                {tPwa('install.later')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* iOS Installation Instructions Modal */}
      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              {tPwa('install.ios.title') || 'Установка на iOS'}
            </DialogTitle>
            <DialogDescription>
              {tPwa('install.ios.description') || 'Следуйте инструкциям ниже, чтобы установить приложение на ваш iPhone или iPad'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">
                  {tPwa('install.ios.step1.title') || 'Откройте Safari'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tPwa('install.ios.step1.description') || 'Убедитесь, что вы используете браузер Safari (не Chrome или другие браузеры)'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  {tPwa('install.ios.step2.title') || 'Нажмите кнопку "Поделиться"'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tPwa('install.ios.step2.description') || 'Найдите кнопку "Поделиться" (квадрат со стрелкой вверх) в нижней части экрана Safari'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  {tPwa('install.ios.step3.title') || 'Выберите "На экран \'Домой\'"'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tPwa('install.ios.step3.description') || 'Прокрутите меню вниз и нажмите "На экран \'Домой\'" или "Add to Home Screen"'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                4
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">
                  {tPwa('install.ios.step4.title') || 'Подтвердите установку'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tPwa('install.ios.step4.description') || 'Нажмите "Добавить" в правом верхнем углу. Иконка приложения появится на главном экране'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowIOSModal(false)}>
              {tPwa('install.ios.close') || 'Понятно'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Available Prompt */}
      {updateAvailable && (
        <Card className="fixed top-4 right-4 z-50 w-80 shadow-lg border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-900">
                <RefreshCw className="h-5 w-5" />
                {tPwa('update.title')}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissUpdate}
                className="text-orange-600 hover:text-orange-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-orange-700">
              {tPwa('update.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button onClick={update} className="flex-1">
                {tPwa('update.updateNow')}
              </Button>
              <Button variant="outline" onClick={dismissUpdate}>
                {tPwa('update.later')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export function PWAStatus() {
  const { 
    isSupported,
    isInstalled,
    displayMode,
    isInitialized
  } = usePWA();

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="text-xs text-muted-foreground p-2 border-t">
      PWA: {isSupported ? '✅ Supported' : '❌ Not Supported'} | 
      {isInstalled ? ' 📱 Installed' : ' 🌐 Web'} | 
      Mode: {displayMode}
    </div>
  );
} 