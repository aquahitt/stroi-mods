# ghb-autoregister

Модификация для платформы **stroi.homes**: при открытии регистрации у застройщика GHB
автоматически заполняет и отправляет заявку на `reg.ghb.by` с устройства пользователя
(ввод SMS-кода — вручную). 5-шаговый HTTP-флоу + `user_input`. **Только Android**
(кросс-доменный HTTP через CapacitorHttp доступен только на нативной сборке).

Автор: **antiaquabot**. ⚠️ Авторегистрация может нарушать правила застройщика — использование
на страх и риск пользователя; платформа не является автором и не несёт ответственности.

## Состав

- `stroi-mod.json` — манифест (declarative; `http:reg.ghb.by` + `user_input`). Категория
  витрины `automation` (Автоматизация), теги `авторегистрация` / `ghb` / `регистрация` —
  по ним мод находится в поиске и фильтрах каталога.
- `declaration.json` — исполняемая декларация (s1–s5 + SMS `user_input`).
- `fixtures/` — `success.json` / `already-registered.json` / `wrong-sms.json` для `stroi-mod test`.

## Локальная разработка (CLI `@stroi/mod-cli`)

```bash
stroi-mod validate .
stroi-mod classify .
stroi-mod test .
```

## Публикация

Единственный путь публикации и обновления этого мода — Pull Request в
[`aquahitt/stroi-mods`](https://github.com/aquahitt/stroi-mods). Merge PR = модерация
пройдена; мод появляется в приложении со следующим релизом stroi.homes. Подробности
процесса — в [корневом README репозитория](../../README.md).

На Android мод даёт capability `http:reg.ghb.by` + `user_input`; на web/iOS эти
способности urезаны (стор-политика).
