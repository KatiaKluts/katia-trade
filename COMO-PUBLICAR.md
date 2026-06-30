# 🚀 Como colocar o KÁTIA.TRADE online (guia para iniciante)

Olá, Kátia! Este guia te leva do zero até o app rodando na internet, num endereço
fixo onde seus dados ficam salvos. Não precisa saber programar. Siga na ordem.

Você vai usar 3 coisas, todas **gratuitas**:
1. **GitHub** — onde o código fica guardado
2. **Vercel** — o que coloca o app no ar
3. A pasta `katia-trade-app` — que eu já preparei para você

Tempo estimado: 20 a 30 minutos na primeira vez.

---

## PARTE 1 — Baixar a pasta do app

1. Baixe a pasta `katia-trade-app` (o arquivo .zip que veio junto).
2. Descompacte (clique com o botão direito → "Extrair tudo").
3. Guarde num lugar fácil de achar (ex: Área de Trabalho).

---

## PARTE 2 — Criar conta no GitHub

1. Acesse **https://github.com** e clique em **Sign up** (cadastrar).
2. Use seu e-mail, crie um usuário e uma senha. Confirme o e-mail.
3. Pronto, conta criada. (Guarde o usuário e a senha.)

---

## PARTE 3 — Subir o app no GitHub (sem instalar nada)

O GitHub permite enviar arquivos pelo próprio site, arrastando:

1. Logada no GitHub, clique no **+** no canto superior direito → **New repository**.
2. Em "Repository name" escreva: `katia-trade` (sem espaços).
3. Deixe marcado **Public** (público) — não tem problema, ninguém edita sem permissão.
4. **NÃO** marque nenhuma caixa extra (README, etc.). Clique em **Create repository**.
5. Na página que abrir, procure o link **"uploading an existing file"** (enviar arquivo
   existente) e clique.
6. Abra a pasta `katia-trade-app` no seu computador, **selecione TODOS os arquivos
   de dentro dela** (não a pasta, mas o conteúdo: as pastas `src`, e os arquivos
   `index.html`, `package.json`, `vite.config.js`, `.gitignore`) e **arraste** para
   a área do GitHub no navegador.
   - Dica: para ver o `.gitignore` (arquivo que começa com ponto), pode ser que
     precise ativar "mostrar arquivos ocultos" no seu computador. Se não aparecer,
     tudo bem — ele é opcional.
7. Espere terminar o envio (barrinha de progresso).
8. Lá embaixo, clique no botão verde **Commit changes**.

Pronto! Seu código está no GitHub.

---

## PARTE 4 — Publicar na Vercel (a parte mágica)

1. Acesse **https://vercel.com** e clique em **Sign Up**.
2. Escolha **"Continue with GitHub"** (entrar com o GitHub) — assim elas se conectam
   sozinhas. Autorize quando pedir.
3. Já dentro da Vercel, clique em **Add New...** → **Project**.
4. Vai aparecer a lista dos seus repositórios do GitHub. Encontre o `katia-trade`
   e clique em **Import**.
5. A Vercel reconhece sozinha que é um projeto Vite/React. **Não precisa mudar nada.**
   Só clique em **Deploy** (publicar).
6. Espere 1 a 2 minutos. Quando terminar, aparece "Congratulations!" e um endereço
   tipo `katia-trade.vercel.app`.
7. Clique no endereço (ou no preview) — **seu app está no ar!** 🎉

Esse endereço é seu, fixo. Pode abrir no computador e no celular. Seus dados agora
ficam salvos de verdade nesse navegador, entre as sessões.

---

## O QUE VAI FUNCIONAR no teste

✅ Toda a carteira, transações, orientações, núcleo/satélite
✅ Cotações em tempo real (Finnhub) — agora SIM, com internet liberada
✅ Logos das empresas (se você configurar a chave do logo.dev — veja abaixo)
✅ Alertas de preço com som
✅ Gráficos, distribuição, exportar Excel, backup
✅ Seus dados salvos de forma permanente

## O QUE AINDA NÃO vai funcionar (e é esperado)

❌ **Análise por IA** (o botão da estrela) — precisa de um servidor com chave da
   Anthropic, que é a fase seguinte. No teste, ele mostra "Análise indisponível".
   Não é bug, é só essa função que depende de servidor.
❌ **Notificações com o app fechado** — funcionam com o app aberto/minimizado.

Nada disso impede você de validar o app. Use, mexa, anote o que quer ajustar.

---

## (OPCIONAL) Ativar os logos das empresas

1. Acesse **https://logo.dev** e crie uma conta grátis.
2. Copie a sua "Publishable Key" (começa com `pk_`).
3. No GitHub, abra o arquivo `src/App.jsx`, clique no lápis (editar), e procure a
   linha: `const LOGO_DEV_KEY = "";`
4. Cole sua chave entre as aspas: `const LOGO_DEV_KEY = "pk_sua_chave_aqui";`
5. Salve (Commit changes). A Vercel republica sozinha em 1 minuto, com os logos.

---

## Como atualizar o app depois

Sempre que quisermos mudar algo, eu te entrego o `App.jsx` novo. Você:
1. Vai no GitHub → abre `src/App.jsx` → clica no lápis (editar).
2. Apaga tudo, cola o novo conteúdo, clica em **Commit changes**.
3. A Vercel republica sozinha em ~1 minuto. Seus dados (no navegador) continuam lá.

---

## Se algo der errado

- **A Vercel deu erro no Deploy?** Geralmente é arquivo faltando no GitHub. Confira
  se a pasta `src` (com `App.jsx` e `main.jsx`) foi enviada, e os arquivos
  `index.html`, `package.json`, `vite.config.js`.
- **Tela branca ao abrir?** Aperte F12 no navegador, veja se há erro em vermelho,
  e me manda print que eu te ajudo.
- **Qualquer dúvida:** me chama aqui e a gente resolve junto.

Boa sorte, Kátia — você consegue! 💪
