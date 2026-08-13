# notify-registration

Модификация для платформы **stroi.homes**: при открытии регистрации у выбранного застройщика
показывает уведомление внутри приложения. Трогает только платформенный API (подписка на события
+ локальное уведомление), без кросс-доменного HTTP — работает на web / Android / iOS.

Автор: **antiaquabot**. Использование — на риск пользователя.

## Состав

- `stroi-mod.json` — манифест (declarative). Категория витрины `notifications`
  (Уведомления), теги `уведомления` / `регистрация` / `ghb` — по ним мод находится
  в поиске и фильтрах каталога.
- `declaration.json` — исполняемая декларация (notify-шаг).
- `fixtures/` — детерминированные фикстуры для `stroi-mod test`.

## Локальная разработка (CLI `@stroi/mod-cli`)

```bash
stroi-mod validate .     # QG-0: схема манифеста + guard declarative
stroi-mod classify .     # категория + ограничения платформ
stroi-mod test .         # прогон fixtures/*.json против sandbox
```

## Публикация

```bash
STROI_MOD_TOKEN=sh_... stroi-mod publish . --api https://stroi.homes
```

Отправляет `{manifest, declaration_json}` на модерацию (`POST /api/v1/mods/submissions`).
После одобрения мод появляется в каталоге/витрине платформы.
