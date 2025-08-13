# VTB Payments

Документация по адаптеру VtbPaymentProcessor (`lib/payments/vtb.ts`)

## Хранение конфигурации

Конфиг провайдера хранится в `payments_providers.config` (JSONB):
```
{
  "type": "vtb",
  "config": {
    "api_base_url": "https://vtb.rbsuat.com/payment/rest/", // TEST по умолчанию, PROD: https://platezh.vtb24.ru/payment/rest/
    "token": "..." // либо user_name/password
  },
  "is_test_mode": true,
  "default_return_url": "https://app.example.com/payments/return",
  "default_webhook_url": "https://app.example.com/api/payments/vtb/webhook"
}
```

## Реализованные методы

- initiatePayment → `register.do` (редирект пользователя)
- getPaymentStatus → `getOrderStatusExtended.do`
- confirmPayment → `deposit.do`
- cancelPayment → `refund.do`
- addPaymentMethod → `register.do` с `createBinding=true` (редирект для привязки)
- getCardList → `getBindings.do`
- removeCard → `unBindCard.do`
- createSubscription → инициирует первый платёж с флагом привязки
- chargeRecurrent → `recurrentPayment.do` по `bindingId`
- handleWebhook → разбор callback и маппинг статуса

## Статусы

Маппинг `orderStatus` → `PaymentStatus`:
```
0 → pending_user_action
1 → pending_confirmation
2 → succeeded
3 → canceled
4 → refunded
5 → canceled (chargeback)
```

## URL

- TEST: `https://vtb.rbsuat.com/payment/rest/`
- PROD: `https://platezh.vtb24.ru/payment/rest/`

## Безопасность

- Аутентификация: `token` или `userName/password` в параметрах запроса
- Вебхуки: рекомендуется проверка источника, при необходимости доп. подпись


