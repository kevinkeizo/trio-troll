# Trio Troll

Sorteador de campeão, build e feitiços de LoL para o trio (React + Vite).

## Rodar

```bash
npm install
npm run dev
```

Abra o endereço que o terminal mostrar (normalmente http://localhost:5173).

## Estrutura

- `src/engine.js`: campeões, itens, temas de build, picks off meta e a lógica do sorteio
- `src/ddragon.jsx`: carrega ícones e nomes em PT-BR direto do Data Dragon da Riot
- `src/PlayerCard.jsx`: card de cada jogador
- `src/App.jsx`: controles, regras e desafio do trio
- `src/styles.css`: visual

## Ajustes comuns

- Adicionar pick off meta: lista `OFF` em `src/engine.js`
- Novo tema de build troll: lista `THEMES` em `src/engine.js`
- Novo desafio: lista `CHALLENGES` em `src/engine.js`

## Próximos passos (anotado)

- Importar a build no LoL: app local em que os 3 logam na mesma sessão/party, e a build sorteada
  (itens na ordem + runas) é enviada para o cliente como item set / página de runas.
  Falta definir: como obter as runas de cada pick (hoje o engine só sorteia itens e feitiços) e a ponte com o cliente (LCU).
- Adicionar runas ao sorteio (keystone + árvores) tanto no modo troll quanto no off meta.
