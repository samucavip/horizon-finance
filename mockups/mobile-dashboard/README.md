# Mockups mobile — Dashboard

Protótipo navegável e isolado para validar a experiência mobile do Horizon Finances sem alterar o componente desktop existente.

## Telas

- **Início:** patrimônio, fluxo mensal, insights, ações rápidas, contas, orçamento e atividade recente.
- **Análises:** patrimônio líquido, projeção de fechamento, exposição cambial e categorias.
- **Insights:** Health Score, prioridades e recomendações.
- **Menu:** arquitetura global do aplicativo e organização das funcionalidades.
- **Ação central:** bottom sheet para despesa, receita, transferência, meta e importação.

## Executar

Na raiz do repositório:

```bash
python3 -m http.server 4173 --directory mockups/mobile-dashboard
```

Abra `http://localhost:4173` no navegador. O seletor acima do aparelho alterna entre os quatro mockups; a navegação inferior e os atalhos internos também são interativos.

## Escopo

Este diretório é deliberadamente independente do protótipo desktop em `controle-financeiro.jsx`. Os dados são estáticos e existem somente para validação visual e de arquitetura da informação.
