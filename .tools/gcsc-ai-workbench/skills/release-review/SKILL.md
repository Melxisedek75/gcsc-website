---
name: gcsc-release-review
description: Проверяет локальное изменение GCSC перед review или передачей.
---

# Release review

1. Проверь diff и dirty-state; не включай чужие изменения.
2. Запусти только воспроизводимые локальные проверки, указанные проектом.
3. Для UI проверь пользовательский путь и failure states, а не только build.
4. Для AI проверь grounded behavior, refusal boundaries and handoff to owner.
5. Не называй mock, local bundle или static demo production-ready.
