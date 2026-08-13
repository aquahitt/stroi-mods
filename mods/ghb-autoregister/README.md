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
- `fixtures/` — `success.json` / `already-registered.json` / `wrong-sms.json`; прогоняются
  внутренним CLI платформы (`stroi-mod test`, см. ниже), для отправки PR не требуются.

## Локальная разработка

Валидатор, который реально гоняет CI этого репозитория, доступен любому
контрибьютору из корня репозитория:

```bash
npm install
npm run validate
```

Это тот же `scripts/validate.ts`, что запускает `.github/workflows/validate.yml`:
проверяет схему манифеста, совпадение `id` с именем директории мода и
наличие/валидность `declaration.json` для `runtime: "declarative"`.

Полный CLI `@stroi/mod-cli` (`stroi-mod validate .` / `stroi-mod classify .` /
`stroi-mod test .`, включая прогон `fixtures/*.json` против sandbox) —
внутренний инструмент платформенной команды из приватного репозитория
`aquahitt/stroi-homes`. Он не опубликован в npm и внешним контрибьюторам
недоступен; для публикации мода через PR он не нужен.

## Публикация

Единственный путь публикации и обновления этого мода — Pull Request в
[`aquahitt/stroi-mods`](https://github.com/aquahitt/stroi-mods). Merge PR = модерация
пройдена; мод появляется в приложении со следующим релизом stroi.homes. Подробности
процесса — в [корневом README репозитория](../../README.md).

На Android мод даёт capability `http:reg.ghb.by` + `user_input`; на web/iOS эти
способности urезаны (стор-политика).
