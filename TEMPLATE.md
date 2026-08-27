# Template: Site de Serviço Local (mobile-first, Google Ads-ready)

Este documento descreve o padrão de site usado no projeto J.A Instalações, para ser reaproveitado em outros negócios de serviço local (encanador, eletricista, chaveiro, dedetizadora, etc.). Ao pedir um novo site "nesse padrão", use este arquivo como checklist/blueprint.

## Stack
- HTML + CSS + JS puro, sem build step, um único `index.html` + `styles.css` + `script.js`.
- Deploy direto no Netlify (`netlify.toml` com `publish = "."`, sem build command).
- Sem frameworks — carrega rápido em mobile, ideal para tráfego pago (Google Ads).

## Estrutura de página (nessa ordem)
1. **Header sticky**: logo + nome + botão "Solicitar orçamento" (âncora pro formulário).
2. **Hero**: avatar/mascote (se houver), eyebrow, H1 com a proposta de valor, subtítulo, 2 CTAs (WhatsApp + Ligar agora), badges de confiança (nota Google, atendimento urgente, etc.).
3. **Carrossel de serviços**: cards clicáveis (scroll-snap horizontal, mobile-first) que abrem um modal com explicação do serviço + CTA de WhatsApp específico daquele serviço.
4. **Avaliações**: resumo (nota + estrelas) com botão que abre um **modal in-page** (nunca leva o usuário pra fora do site) mostrando avaliações reais + CTA de WhatsApp + link discreto pro Google Maps completo, só como opção secundária.
5. **Formulário de contato**: nome, telefone, tipo de serviço, região — grava no **Netlify Forms** (`data-netlify="true"` + honeypot) E monta uma mensagem que abre o WhatsApp. Nunca depender de só um dos dois canais.
6. **Mapa embutido** (Google Maps `output=embed`, sem precisar de API key) com o endereço real.
7. **Footer**: logo, texto institucional, CNPJ, link da política de privacidade, copyright.
8. **Botão flutuante de WhatsApp** (fixed bottom-right) em todas as páginas.
9. **Página separada de Política de Privacidade** (`privacidade.html`), mesma identidade visual, cobrindo LGPD, cookies, GTM/Ads, WhatsApp.

## Regras de conteúdo/copy
- **Nunca prometer "orçamento grátis"** a menos que seja realmente o caso — usar frases como "Consulte a taxa de visita para a sua região".
- Avaliações exibidas devem ser **sempre reais**, nunca inventadas — se o cliente não fornecer, deixar a seção fora do ar até ter conteúdo real (não usar depoimentos fictícios em site com tráfego pago).
- A **nota agregada** (badge, resumo, `aggregateRating` no JSON-LD) deve ser sempre a nota real do perfil do Google do cliente — nunca assumir 5.0 por padrão. Peça print do perfil do Google (mostra nota + total de avaliações) antes de publicar essa seção.
- CTAs de WhatsApp sempre com número **sem o 9º dígito quando o negócio usa fixo/comercial** — confirmar com o cliente o número exato do WhatsApp Business.

## Design system (tokens em `styles.css`)
- Paleta baseada em uma cor principal do negócio (aqui, azul: `--blue-900` a `--blue-50`) + verde do WhatsApp (`--green: #25d366`) fixo, já que é um padrão reconhecível.
- Tipografia: título em `Poppins` (600–800), corpo em `Inter` (400–600), via Google Fonts.
- Cards com `border-radius: 16px`, sombra suave (`--shadow`), sem bordas duras.
- Botões em pílula (`border-radius: 999px`), com variantes `btn-primary` (WhatsApp/ação principal), `btn-outline` (ação secundária — **atenção ao contraste em fundos escuros**, usar override tipo `.hero .btn-outline` com borda/texto branco).
- Mobile-first: hero com CTAs empilhados verticalmente até 720px, carrossel com `scroll-snap`, breakpoint único em 720px para virar layout desktop.

## Google Tag Manager + conversões (Google Ads)
Sempre instalar o GTM (snippet no `<head>` + `<noscript>` logo após `<body>`) e disparar eventos customizados no `dataLayer` para cada ação de conversão real:

| Evento | Quando dispara |
|---|---|
| `whatsapp_click` | Clique em qualquer link `wa.me` (hero, flutuante, contato direto, modal de serviço, modal de avaliações) |
| `phone_click` | Clique em qualquer link `tel:` |
| `form_submit` | Envio do formulário de contato |
| `service_modal_open` | Abertura do modal de um serviço (micro-conversão) |
| `reviews_modal_open` | Abertura do modal de avaliações (micro-conversão) |

No GTM: gatilhos do tipo "Evento personalizado" (não usar "Clique em link" automático — menos confiável). Tags de conversão do Google Ads por evento. Marcar `whatsapp_click` e `form_submit` como conversões primárias; os demais como secundários. Sempre lembrar de ativar o **Conversion Linker** (essencial para não perder atribuição quando o clique abre WhatsApp/app externo).

## Captura de leads (Netlify Forms)
- Formulário com `name`, `method="POST"`, `data-netlify="true"`, `netlify-honeypot="bot-field"` + hidden `form-name` + hidden honeypot.
- No submit via JS: `fetch('/', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: <dados codificados> })` para gravar no Netlify Forms, e em paralelo abrir o link do WhatsApp — nunca só um dos dois.
- Configurar notificação por e-mail no painel Netlify (Site configuration → Forms → Form notifications).
- Automação opcional (próximo nível): Netlify Forms → webhook → Zapier/Make → Google Sheets, com coluna de link de WhatsApp pronto via `ARRAYFORMULA` + `HYPERLINK` + `ENCODEURL`.

## SEO técnico (sempre incluir)
- `robots.txt` liberando tudo + apontando pro sitemap.
- `sitemap.xml` com as páginas do site.
- `<link rel="canonical">` apontando pra URL final.
- Dados estruturados JSON-LD (schema.org), tipo apropriado ao negócio (`Plumber`, `Electrician`, `LocalBusiness`, etc.) com nome, telefone, endereço, `aggregateRating` se houver avaliações reais.
- Favicon = logo real da empresa (não ícone genérico).
- Recomendar ao cliente registrar no Google Search Console e enviar o sitemap.

## Checklist para replicar em outro negócio
1. [ ] Coletar: nome do negócio, CNPJ, cores da marca, logo/avatar em arquivo (peça upload direto no GitHub, não colado no chat), número de WhatsApp e telefone, endereço completo, tipo(s) de serviço.
2. [ ] Adaptar copy do hero e da lista de serviços/carrossel para o segmento do negócio.
3. [ ] Coletar avaliações reais (nome + texto) antes de publicar a seção de avaliações.
4. [ ] Criar container GTM próprio do cliente (não reaproveitar `GTM-M7ZGPMRT`, que é específico da J.A Instalações).
5. [ ] Gerar embed do Google Maps com o endereço do novo negócio.
6. [ ] Ajustar CNPJ, dados estruturados e política de privacidade para o novo negócio.
7. [ ] Deploy no Netlify do cliente, configurar Forms + notificação por e-mail.
8. [ ] Registrar no Search Console quando tiver domínio definitivo.
