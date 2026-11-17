# Site Navex Transportes

Site institucional da Navex Transportes: redespacho e distribuição de última milha
para transportadoras de e-commerce na Baixada Santista (Bertioga a Peruíbe).

É um site estático: HTML + CSS em um único arquivo, sem build, sem servidor e sem senhas.

## Estrutura

```
site/
├── index.html          # página única (conteúdo, estilos e script)
├── robots.txt
├── sitemap.xml
└── assets/
    ├── logo-navex.svg          # logo azul (#214478)
    ├── logo-navex-branco.svg   # logo branco, para fundos escuros
    ├── favicon.svg / favicon-32.png / apple-touch-icon.png / icon-512.png
    └── og-image.png            # imagem de quando o link é compartilhado (1200x630)
```

## Ver localmente

Abra `index.html` no navegador, ou rode `python3 -m http.server` dentro de `site/`
e acesse http://localhost:8000.

## Contato

- Botões de WhatsApp abrem conversa com +55 11 93722-0762.
- O formulário não envia e-mail: ele monta a mensagem e abre no WhatsApp.
  Assim não há servidor nem senha para manter.

## Publicar

Qualquer hospedagem estática serve. Sugestão: **Cloudflare Pages** ou **Netlify**
(gratuitos, com HTTPS). Basta apontar para a pasta `site/`.

O domínio considerado é `www.navextransportes.com.br`. Se mudar, troque a URL em:
`index.html` (canonical, og:url, og:image e JSON-LD), `robots.txt` e `sitemap.xml`.

## Depois de publicar

1. Registrar o domínio em registro.br.
2. Cadastrar o site no **Google Search Console** e enviar o `sitemap.xml`.
3. Criar o **Perfil da Empresa no Google** (Google Meu Negócio) com o mesmo
   endereço, telefone e link do site.
