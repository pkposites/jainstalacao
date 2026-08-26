# J.A Instalações

Site institucional (uma página, mobile-first) para a J.A Instalações, encanador/bombeiro hidráulico em São Paulo.

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
