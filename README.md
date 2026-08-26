# J.A Instalações

Site institucional (uma página, mobile-first) para a J.A Instalações, encanador/bombeiro hidráulico em São Paulo. Otimizado para campanhas de Google Ads, com rastreamento de conversões via Google Tag Manager.

## Stack
HTML + CSS + JS puro, sem build step. Pronto para deploy direto no Netlify (arquivo `netlify.toml` já configurado com `publish = "."`).

## Deploy no Netlify
1. Conecte este repositório no Netlify.
2. Build command: (nenhum)
3. Publish directory: `.`

## Conteúdo
- Hero com CTAs de WhatsApp e telefone.
- Carrossel de serviços (clicável, abre modal com detalhes e CTA de WhatsApp).
- Seção de avaliações (link para o Google Maps).
- Formulário de contato (nome, tipo de serviço, região de SP) que monta uma mensagem e abre o WhatsApp.
- Rodapé com CNPJ e link para localização no Google Maps.

## Configurações de contato
Editar em `index.html` e `script.js`:
- Número de WhatsApp: `5511950922446`
- Telefone: `+551150922446`

## Google Tag Manager e conversões (Google Ads)

O container GTM `GTM-M7ZGPMRT` já está instalado em `index.html` (snippet no `<head>` + `<noscript>` logo após `<body>`).

O site empurra os seguintes eventos para o `dataLayer` a cada ação de conversão:

| Evento (`dataLayer.event`) | Quando dispara | Parâmetros extras |
|---|---|---|
| `whatsapp_click` | Clique em qualquer link de WhatsApp (hero, botão flutuante, contato direto, CTA do modal de serviço) | `link_location` |
| `phone_click` | Clique em qualquer link `tel:` (hero, contato direto) | `link_location` |
| `service_modal_open` | Abertura do modal de detalhe de um serviço do carrossel | `service_name` |
| `form_submit` | Envio do formulário de contato (antes de abrir o WhatsApp) | `service_type`, `region` |

### Como configurar o rastreamento de conversões no GTM

1. Acesse [tagmanager.google.com](https://tagmanager.google.com) → container `GTM-M7ZGPMRT`.
2. Crie um **Gatilho** do tipo *Evento personalizado* para cada evento acima (ex: nome do evento = `whatsapp_click`).
3. Crie uma **Tag** do tipo *Google Ads: Rastreamento de conversão* para cada gatilho, usando o **ID de conversão** e o **rótulo de conversão** gerados no Google Ads (Ferramentas → Conversões → Nova ação de conversão → Site).
4. Publique o container (**Enviar** → **Publicar**).
5. Recomendado: marcar `whatsapp_click` e `form_submit` como conversões principais (são os eventos de maior intenção); `phone_click` e `service_modal_open` podem ser usados como conversões secundárias/micro-conversões para otimização de lances.

Nenhuma alteração de código é necessária para adicionar/ajustar conversões — tudo é feito dentro do GTM a partir dos eventos já disponíveis.
