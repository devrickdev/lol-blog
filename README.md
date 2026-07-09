# Summoner's Ledger

Um blog pessoal estático para documentar seu progresso no League of Legends:
diário de partidas, gráficos de evolução de elo/KDA e uma tabela de campeões.

Não tem backend, banco de dados nem build step. Tudo é HTML/CSS/JS puro que
lê arquivos `.json` na pasta `data/`. Para atualizar o site, você edita esses
arquivos e sobe de novo (ou só salva, se estiver rodando localmente).

## Estrutura

```
lol-blog/
├── index.html          # página inicial (resumo + últimas entradas)
├── posts.html           # lista completa do diário, com filtro por tag
├── post.html            # visualização de uma entrada (via ?id=...)
├── stats.html            # gráficos de evolução + "escada" de elo
├── champions.html        # tabela de campeões jogados
├── css/style.css
├── js/
│   ├── data.js           # helpers para carregar os JSON
│   ├── nav.js             # menu lateral
│   ├── stats.js           # lógica dos gráficos e da escada
│   └── champions.js       # lógica da tabela de campeões
└── data/
    ├── config.json        # nome de invocador, elo atual, etc.
    ├── posts.json          # entradas do diário
    ├── stats.json           # histórico de elo/KDA (usado nos gráficos)
    └── champions.json        # pool de campeões
```

## Como adicionar conteúdo

### Novo post no diário
Edite `data/posts.json` e adicione um objeto no array:

```json
{
  "id": "2026-07-03-p1",
  "date": "2026-07-03",
  "title": "Título da entrada",
  "result": "win",
  "champion": "Nome do campeão",
  "tags": ["ranqueada", "jungle"],
  "summary": "Um resumo curto, aparece na lista.",
  "content": ["Primeiro parágrafo.", "Segundo parágrafo."]
}
```
`id` precisa ser único (sugestão: `data-algumacoisa`). `result` é `"win"` ou `"loss"`.

### Novo ponto no histórico de elo
Edite `data/stats.json` e adicione uma entrada:

```json
{ "date": "2026-07-03", "tier": "Ouro", "division": "I", "lp": 20, "wins": 3, "losses": 2, "kills": 30, "deaths": 20, "assists": 28 }
```
Tiers aceitos (em português): `Ferro, Bronze, Prata, Ouro, Platina, Esmeralda,
Diamante, Mestre, Grão-Mestre, Desafiante`. Os três últimos não usam `division`
(pode omitir ou deixar `null`).

### Atualizar um campeão
Edite `data/champions.json`. O campo `championId` é o nome usado pela Riot no
Data Dragon (sem espaços/acentos), por exemplo: `LeeSin`, `Viego`, `KaiSa`,
`MonkeyKing` (esse é o Wukong), `Nunu`. Se o ícone não carregar, a página
mostra automaticamente as iniciais do campeão no lugar.

### Personalizar o cabeçalho
Edite `data/config.json` — nome de invocador, elo atual e frase de efeito
que aparece no rodapé do menu lateral.

## Rodando localmente

Como o site usa `fetch()` para ler os arquivos `.json`, abrir o `index.html`
diretamente (`file://`) não funciona por causa de restrições de CORS do
navegador. Rode um servidor local simples a partir da pasta do projeto:

```bash
# Python
python3 -m http.server 8000

# ou Node
npx serve .
```

Depois acesse `http://localhost:8000`.

## Publicando

Como é tudo estático, qualquer um destes serve:

- **GitHub Pages**: suba a pasta para um repositório e ative o Pages nas
  configurações (branch `main`, pasta raiz).
- **Netlify / Vercel**: arraste a pasta no painel, ou conecte o repositório
  Git — não precisa configurar build command.
- **Cloudflare Pages**: mesma ideia, sem build step.

## Bibliotecas externas usadas

- [Chart.js](https://www.chartjs.org/) via CDN, para os gráficos de evolução.
- Fontes do Google Fonts: Oswald, Spectral, IBM Plex Mono.
- Ícones de campeão via [Data Dragon](https://developer.riotgames.com/docs/lol),
  o CDN público de assets da Riot Games.
