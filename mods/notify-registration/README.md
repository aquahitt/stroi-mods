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

Единственный путь публикации и обновления этого мода — Pull Request в
[`aquahitt/stroi-mods`](https://github.com/aquahitt/stroi-mods). Merge PR = модерация
пройдена; мод появляется в приложении со следующим релизом stroi.homes. Подробности
процесса — в [корневом README репозитория](../../README.md).
