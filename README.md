# Horizon Finance

Sistema pessoal de controle financeiro multi-país e multi-moeda (BR/EUA), com controle de contas, cartões de crédito, categorias customizáveis, orçamento, metas e dashboard.

## Status atual

Protótipo funcional em React (`controle-financeiro.jsx`), rodando como artifact web — funciona bem no navegador do celular, mas ainda não é um app nativo iOS/Android.

## Funcionalidades já implementadas

- Contas em múltiplos países e moedas (BR/BRL, US/USD), com saldo atual e projetado
- Transferências entre contas com conversão de câmbio
- Cartões de crédito como contas próprias: fatura do mês, limite, % de uso, parcelamento automático
- Categorias e subcategorias customizáveis (cor + ícone)
- Orçamento por categoria com alerta ao aproximar/estourar o limite, comparando com o ritmo esperado do mês
- Metas financeiras com acompanhamento de progresso
- Dashboard: saldo total, saldo previsto para o fim do mês, entradas/saídas, gastos por categoria
- Importação de extratos/faturas via CSV

## Roadmap / próximos passos

- [ ] App nativo Android/iOS (ou PWA instalável como primeiro passo)
- [ ] Backend real com banco de dados (hoje os dados ficam presos ao ambiente do artifact)
- [ ] Leitura automática de faturas em PDF (hoje só CSV)
- [ ] Recorrências automáticas (assinaturas, contas fixas)
- [ ] Autenticação e sincronização entre dispositivos

## Estrutura

```
/controle-financeiro.jsx   # componente React principal (protótipo web)
```

## Como rodar localmente

Este arquivo é um componente React único (sem build system definido ainda). Para rodar localmente, será necessário criar um projeto (Vite/Next.js) e importar o componente, instalando as dependências: `lucide-react`, `recharts`.
