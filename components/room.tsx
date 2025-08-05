"use client"

import React, { useState, useEffect } from 'react';
import { useQuery, useHasyx, useSubscription } from 'hasyx';
import { Card, CardContent, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Badge } from 'hasyx/components/ui/badge';
import { ScrollArea } from 'hasyx/components/ui/scroll-area';
import { Button } from 'hasyx/components/ui/button';
import { Textarea } from 'hasyx/components/ui/textarea';
import { MessageSquare, Users, Edit, Trash2, Reply, Send } from 'lucide-react';

interface RoomProps {
  room: {
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
  };
}

interface Message {
  id: string;
  value: string;
  user_id: string;
  created_at: number;
  updated_at: number;
}

interface Reply {
  id: string;
  message_id: string;
  room_id: string;
  created_at: number;
}

export default function Room({ room }: RoomProps) {
  const hasyx = useHasyx();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Получаем сообщения для этой комнаты
  const { data: messages = [], loading: messagesLoading } = useSubscription({
    table: 'messages',
    where: {
      replies: {
        room_id: { _eq: room.id }
      }
    },
    returning: ['id', 'value', 'user_id', 'created_at', 'updated_at'],
    order_by: [{ created_at: 'asc' }],
  });

  // Получаем пользователей для отображения имен
  const { data: users = [] } = useQuery({
    table: 'users',
    where: {},
    returning: ['id', 'name'],
  });

  const getUserName = (userId: string) => {
    const user = users.find((u: any) => u.id === userId);
    return user?.name || `User ${userId}`;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      // Создаем сообщение
      const messageId = crypto.randomUUID();
      const message = await hasyx.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: newMessage.trim(),
        },
        returning: ['id', 'value', 'user_id'],
      });

      // Создаем reply, связывающий сообщение с комнатой
      const replyId = crypto.randomUUID();
      await hasyx.insert({
        table: 'replies',
        object: {
          id: replyId,
          message_id: messageId,
          room_id: room.id,
        },
        returning: ['id'],
      });

      console.log('✅ Сообщение отправлено:', message);
      setNewMessage('');
    } catch (error) {
      console.error('❌ Ошибка при отправке сообщения:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок комнаты */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{room.title}</h1>
            <p className="text-sm text-muted-foreground">
              Создана {new Date(room.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <MessageSquare className="w-3 h-3 mr-1" />
              {messages.length} сообщений
            </Badge>
          </div>
        </div>
      </div>

      {/* Область чата */}
      <div className="flex-1 flex flex-col">
        {/* Список сообщений */}
        <ScrollArea className="flex-1 p-4">
          {messagesLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Загрузка сообщений...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Нет сообщений</p>
              <p className="text-sm">Начните разговор первым!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message: Message) => (
                <div key={message.id} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {getUserName(message.user_id).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {getUserName(message.user_id)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mt-1 p-3 bg-muted rounded-lg">
                        {message.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Форма отправки сообщения */}
        <div className="p-4 border-t bg-background">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 