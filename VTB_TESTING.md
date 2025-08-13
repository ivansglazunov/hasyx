# VTB Payment Testing Guide

## Подготовка

- Зарегистрируйте провайдера `vtb` в UI (Providers → Add VTB Test), укажите `token` или `user_name/password`.
- Убедитесь, что запущены миграции payments и cron `subscription-billing`.

## Разовый платёж

1. Создайте операцию оплаты и вызовите `/api/payments/vtb/init`.
2. Перейдите по `payment_url`, завершите оплату в VTB.
3. Проверьте `payments_operations` (status изменится после вебхука или статуса).

## Привязка карты

1. Вкладка "Payment Methods" → Add Method → выберите VTB провайдер, укажите ClientId.
2. Backend вызовет `register.do (createBinding=true)` и вернёт redirect URL.
3. Завершите привязку, затем вызовите `getBindings.do` (автоматически делает card-webhook/обработчик) и проверьте, что метод сохранён с `recurrent_details.bindingId`.

## Подписка

1. Создайте план (minute для быстрой проверки).
2. Создайте подписку через `/api/payments/vtb/create-subscription` (первый платёж с привязкой).
3. После редиректа проверьте статус подписки.

## Рекуррент

1. Ожидайте cron (10–15 мин) либо вызовите endpoint вручную.
2. Проверьте операции со статусом `succeeded` и обновлённые поля подписки.

## Диагностика

```bash
npx hasyx js -- -e "console.log(await client.select({table:'payments_providers',returning:['id','type','is_test_mode']}))"
npx hasyx js -- -e "console.log(await client.select({table:'payments_methods',returning:['id','recurrent_details','status']}))"
npx hasyx js -- -e "console.log(await client.select({table:'payments_subscriptions',returning:['id','status','billing_retry_count']}))"
npx hasyx js -- -e "console.log(await client.select({table:'payments_operations',order_by:{created_at:'desc'},limit:10}))"
```


