# Vida Financeira no Android (APK)

## Como funciona a atualização automática

```
você faz uma mudança aqui → push na branch main → GitHub Actions publica no GitHub Pages
                                                          ↓
                   o app no celular abre esse endereço e já mostra a versão nova
```

- O APK (pasta `android/`) é uma "casca" nativa leve (~50 KB) que abre
  `https://nanaamed-prog.github.io/Vida-Financeira-/`.
- Toda mudança no código do app (pasta `src/` etc.) que chegar na `main` é
  publicada pelo workflow **Publicar app** e aparece no celular na próxima
  abertura do app. **Não precisa reinstalar.**
- Depois do primeiro acesso, o app também funciona **offline** (service worker).
- Os dados do usuário ficam salvos no aparelho (localStorage) e não se perdem nas atualizações.
- Só é preciso instalar um APK novo se a pasta `android/` mudar.

## Compatibilidade (Android 5.0 ou superior)

- `minSdk 21` (Android 5.0), APK sem código nativo: roda em qualquer processador (ARM, ARM64, x86).
- Assinatura v1 + v2 (necessária para instalar no Android 5 e 6).
- JavaScript transpilado + polyfills (`@vitejs/plugin-legacy`) para WebViews antigos.
- O CSS do Tailwind v4 é convertido no build (`scripts/legacyCss.ts`) para funcionar
  no Chrome/WebView 61+: remove `@layer`, `:where()`, `oklch()`, `translate`/`scale`/`rotate`.
- Se o "Android System WebView" do aparelho for muito antigo, o app avisa e abre a Play Store para atualizar.

## Configuração única no GitHub (obrigatória)

1. O Pages é publicado na branch `gh-pages`. Se o site der 404, confira em **Settings → Pages** se a fonte está em **Deploy from a branch → gh-pages / (root)**.
2. Para o workflow **Gerar APK Android** assinar com a mesma chave do APK já instalado
   (senão o Android não deixa atualizar por cima), crie em
   **Settings → Secrets and variables → Actions**:
   - `ANDROID_KEYSTORE_BASE64` — o arquivo `vida-financeira.jks` em base64 (`base64 -w0 vida-financeira.jks`)
   - `ANDROID_KEYSTORE_PASSWORD` e `ANDROID_KEY_PASSWORD` — a senha da chave
   - `ANDROID_KEY_ALIAS` — `vidafinanceira`
3. (Opcional) IA com Gemini: publique o `server.ts` em algum servidor (Cloud Run, Render…) com
   `GEMINI_API_KEY` e crie a variável `VITE_API_URL` (Settings → Variables) com a URL dele.
   Sem isso, o Conselheiro usa o motor local, que funciona offline.

## Gerar o APK manualmente

```bash
cd android
./gradlew assembleRelease   # requer Android SDK (ANDROID_HOME) e JDK 17+
```

Para usar outro endereço: `./gradlew assembleRelease -PAPP_URL=https://seu-dominio/`.
