"use client"

import React, { useState } from 'react';
import { useQuery, useHasyx, useSubscription } from 'hasyx';
import { Button } from 'hasyx/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from 'hasyx/components/ui/dialog';
import { Input } from 'hasyx/components/ui/input';
import { Textarea } from 'hasyx/components/ui/textarea';
import { Label } from 'hasyx/components/ui/label';
import { ScrollArea } from 'hasyx/components/ui/scroll-area';
import { Plus, MessageSquare } from 'lucide-react';
import { MultiSelectHasyx } from '@/components/multi-select-hasyx';
import Room from '@/components/room';

interface Room {
  id: string;
  title: string;
  user_id: string;
  allow_select_users: string[];
  allow_change_users: string[];
  allow_reply_users: string[];
  allow_remove_users: string[];
  allow_delete_users: string[];
  created_at: number;
  updated_at: number;
}

interface CreateRoomForm {
  title: string;
  allow_select_users: string[];
  allow_change_users: string[];
  allow_reply_users: string[];
  allow_remove_users: string[];
  allow_delete_users: string[];
}

export function MessagingClient() {
  const hasyx = useHasyx();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateRoomForm>({
    title: '',
    allow_select_users: [],
    allow_change_users: [],
    allow_reply_users: [],
    allow_remove_users: [],
    allow_delete_users: [],
  });

  // Запрос для получения списка комнат
  const { data: rooms = [], loading: roomsLoading } = useSubscription({
    table: 'rooms',
    where: {},
    returning: [
      'id', 'title', 'user_id', 'allow_select_users', 'allow_change_users',
      'allow_reply_users', 'allow_remove_users', 'allow_delete_users',
      'created_at', 'updated_at'
    ],
    order_by: [{ updated_at: 'desc' }],
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!formData.title.trim()) {
      console.error('❌ Название комнаты обязательно');
      return;
    }

    setIsCreating(true);
    try {
      // Создаем комнату через Hasura insert
      const result = await hasyx.insert({
        table: 'rooms',
        object: {
          id: crypto.randomUUID(), // Генерируем уникальный ID
          title: formData.title,
          allow_select_users: formData.allow_select_users,
          allow_change_users: formData.allow_change_users,
          allow_reply_users: formData.allow_reply_users,
          allow_remove_users: formData.allow_remove_users,
          allow_delete_users: formData.allow_delete_users,
        },
        returning: ['id', 'title', 'user_id', 'created_at'],
      });

      console.log('✅ Комната создана:', result);
      
      // Закрываем диалог
      setCreateDialogOpen(false);
      
      // Очищаем форму
      setFormData({
        title: '',
        allow_select_users: [],
        allow_change_users: [],
        allow_reply_users: [],
        allow_remove_users: [],
        allow_delete_users: [],
      });
      
    } catch (error) {
      console.error('❌ Ошибка при создании комнаты:', error);
      // Здесь можно добавить уведомление пользователю об ошибке
    } finally {
      setIsCreating(false);
    }
  };

  const handleFormChange = (field: keyof CreateRoomForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex h-full">
      {/* Левая колонка - список комнат */}
      <div className="w-[300px] border-r flex flex-col">
        <div className="p-4 border-b">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Создать комнату
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Создать новую комнату</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-title">Название комнаты</Label>
                  <Input
                    id="room-title"
                    placeholder="Введите название комнаты..."
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Кто может просматривать сообщения</Label>
                  <MultiSelectHasyx
                    value={formData.allow_select_users}
                    onValueChange={(value) => handleFormChange('allow_select_users', value)}
                    placeholder="Выберите пользователей..."
                    queryGenerator={(search) => ({
                      table: 'users',
                      where: search && search.length >= 2 ? {
                        name: { _ilike: `%${search}%` }
                      } : {},
                      returning: ['id', 'name'],
                      limit: search && search.length >= 2 ? 10 : 50, // Show more users when not searching
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Кто может изменять сообщения</Label>
                  <MultiSelectHasyx
                    value={formData.allow_change_users}
                    onValueChange={(value) => handleFormChange('allow_change_users', value)}
                    placeholder="Выберите пользователей..."
                    queryGenerator={(search) => ({
                      table: 'users',
                      where: search && search.length >= 2 ? {
                        name: { _ilike: `%${search}%` }
                      } : {},
                      returning: ['id', 'name'],
                      limit: search && search.length >= 2 ? 10 : 50, // Show more users when not searching
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Кто может отвечать</Label>
                  <MultiSelectHasyx
                    value={formData.allow_reply_users}
                    onValueChange={(value) => handleFormChange('allow_reply_users', value)}
                    placeholder="Выберите пользователей..."
                    queryGenerator={(search) => ({
                      table: 'users',
                      where: search && search.length >= 2 ? {
                        name: { _ilike: `%${search}%` }
                      } : {},
                      returning: ['id', 'name'],
                      limit: search && search.length >= 2 ? 10 : 50, // Show more users when not searching
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Кто может удалять свои сообщения</Label>
                  <MultiSelectHasyx
                    value={formData.allow_remove_users}
                    onValueChange={(value) => handleFormChange('allow_remove_users', value)}
                    placeholder="Выберите пользователей..."
                    queryGenerator={(search) => ({
                      table: 'users',
                      where: search && search.length >= 2 ? {
                        name: { _ilike: `%${search}%` }
                      } : {},
                      returning: ['id', 'name'],
                      limit: search && search.length >= 2 ? 10 : 50, // Show more users when not searching
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Кто может удалять любые сообщения</Label>
                  <MultiSelectHasyx
                    value={formData.allow_delete_users}
                    onValueChange={(value) => handleFormChange('allow_delete_users', value)}
                    placeholder="Выберите пользователей..."
                    queryGenerator={(search) => ({
                      table: 'users',
                      where: search && search.length >= 2 ? {
                        name: { _ilike: `%${search}%` }
                      } : {},
                      returning: ['id', 'name'],
                      limit: search && search.length >= 2 ? 10 : 50, // Show more users when not searching
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Отмена
                </Button>
                                       <Button onClick={handleCreateRoom} disabled={isCreating}>
                         {isCreating ? 'Создание...' : 'Создать'}
                       </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {roomsLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Загрузка комнат...
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Нет комнат
              </div>
            ) : (
              rooms.map((room: Room) => (
                <div
                  key={room.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRoom?.id === room.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="font-medium">{room.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(room.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Правая колонка - содержимое комнаты */}
      <div className="flex-1">
        {selectedRoom ? (
          <Room room={selectedRoom} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Выберите комнату для просмотра сообщений</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 