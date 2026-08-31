# Therius docs — translation glossary (es-LATAM · pt-BR)

Authoritative term list for translating `../` (the Mintlify docs) into Spanish (`es/`) and
Portuguese (`pt/`). **es is Latin-American Spanish, pt is Brazilian Portuguese** — not es-ES,
not pt-PT.

Sourced from the house style already shipped in
`therius-dashboard/locales/{es,pt}.json` and `therius-website/src/data/marketing/strings.data.ts`.
When those disagree with a general dictionary, the shipped strings win. Update this file when
a reviewer corrects a term.

## Do NOT translate (keep verbatim)

`Therius`, `Thera`, API method names and paths (`POST /payment/purchase`), field names
(`merchantCode`, `orderCode`, `networkTransactionId`, `card.nonceData`), JSON keys and values,
HTTP verbs and headers (`Authorization`, `Bearer`, `Idempotency-Key`, `Content-Type`),
status strings (`captured`, `authorized`, `refused`, `pending_action`, `active`, `past_due`),
error/reason codes, product/brand names (Stripe, Adyen, Visa, Mastercard, PIX, Boleto, SEPA,
Bancontact, Multibanco, SPEI, Nequi…), acronyms **CIT / MIT / 3DS / 3-D Secure / SCA / PSD2 /
PCI DSS / SAQ / APM / SDK / JWT / BIN / DPAN / TLID / NTI / MCC / ISO 8583 / UUID / RFC 3339**,
code samples in full (translate only `# comments` inside them).

## Core terms

| English | es-LATAM | pt-BR | Notes |
|---|---|---|---|
| payment | pago | pagamento | |
| payment method | método de pago | método de pagamento | (dashboard: `tab_tokens`) |
| card | tarjeta | cartão | |
| charge (verb) | cobrar | cobrar | |
| charge (noun) | cobro | cobrança | |
| authorize / authorization | autorizar / autorización | autorizar / autorização | |
| capture | capturar / captura | capturar / captura | |
| refund | reembolso | reembolso | dashboard uses "reembolso" pt too; NOT "estorno" for a merchant-initiated refund |
| void / cancel | anular / cancelar | anular / cancelar | |
| chargeback | contracargo | chargeback | pt-BR keeps "chargeback" (also seen: "estorno"/"disputa" — prefer **chargeback**) |
| dispute | disputa | disputa | |
| settlement | liquidación | liquidação | |
| reconciliation | conciliación | conciliação | |
| acquirer | adquirente | adquirente | |
| gateway | gateway | gateway | keep English |
| connection (a configured gateway) | conexión | conexão | Therius-specific: a wired provider |
| merchant | comercio | lojista | dashboard pt: "lojista"; also "estabelecimento" — prefer **lojista** |
| merchant account | cuenta de comercio | conta do lojista | |
| shopper / customer | cliente | cliente | |
| cardholder | titular de la tarjeta | titular do cartão | |
| issuer | emisor | emissor | (dashboard: `label_...`: "emisor" / "emissor") |
| issuing bank | banco emisor | banco emissor | |
| currency | moneda | moeda | |
| amount | monto | valor | pt-BR: "valor" (dashboard); es: "monto" |
| minor units | unidades menores | unidades menores | |
| exponent | exponente | expoente | |
| instalments | cuotas | parcelas | LATAM "parcelado"; es "cuotas" (also "pagos"); pt "parcelas" |
| fee | comisión | taxa | |
| payout | pago (transferencia) | repasse | |

## Stored credentials / tokenization

| English | es-LATAM | pt-BR | Notes |
|---|---|---|---|
| token | token | token | keep English |
| vault / vaulted | bóveda / almacenado en bóveda | cofre / no cofre | dashboard: `vaulted_token` → es "Token almacenado" / pt "Token no cofre" |
| network token | token de red | token de rede | dashboard confirmed |
| stored credential | credencial almacenada | credencial armazenada | |
| Cardholder Initiated Transaction (CIT) | transacción iniciada por el titular (CIT) | transação iniciada pelo titular (CIT) | keep **CIT** acronym after first use |
| Merchant Initiated Transaction (MIT) | transacción iniciada por el comercio (MIT) | transação iniciada pelo lojista (MIT) | keep **MIT** |
| mandate | mandato | mandato | recurring-billing sense |
| save my card / save the card | guardar mi tarjeta | salvar meu cartão | |
| saved payment method | método de pago guardado | método de pagamento salvo | dashboard: `no_tokens` |

## Subscriptions / billing

| English | es-LATAM | pt-BR | Notes |
|---|---|---|---|
| subscription | suscripción | assinatura | |
| plan | plan | plano | |
| billing cycle | ciclo de facturación | ciclo de faturamento | |
| renewal | renovación | renovação | |
| dunning | gestión de cobros (dunning) | gestão de cobranças (dunning) | keep "(dunning)" parenthetical on first use |
| retry | reintento / reintentar | nova tentativa / tentar novamente | |
| trial | período de prueba | período de teste | |
| past due | vencido | em atraso | |
| suspended | suspendida | suspensa | |
| paused | pausada | pausada | |
| invoice | factura | fatura | |
| recurring billing | facturación recurrente | faturamento recorrente | marketing house style |

## Auth / environments / SDK

| English | es-LATAM | pt-BR | Notes |
|---|---|---|---|
| API key | clave de API | chave de API | |
| private key / secret key | clave privada / secreta | chave privada / secreta | |
| public key | clave pública | chave pública | |
| header (HTTP) | encabezado | cabeçalho | |
| request body | cuerpo de la solicitud | corpo da requisição | |
| request / response | solicitud / respuesta | requisição / resposta | |
| endpoint | endpoint | endpoint | keep English |
| environment | entorno | ambiente | |
| sandbox | sandbox | sandbox | keep English |
| production / live | producción | produção | |
| client token | client token | client token | keep (dashboard: `bearer_token` kept) |
| hosted fields | campos alojados (hosted fields) | campos hospedados (hosted fields) | keep parenthetical |
| checkout widget | widget de checkout | widget de checkout | |
| drop-in | drop-in | drop-in | keep |
| webhook | webhook | webhook | keep |
| retry / replay (webhook) | reintento / reenvío | nova tentativa / reenvio | |
| signature verification | verificación de firma | verificação de assinatura | |
| idempotency | idempotencia | idempotência | |

## Routing / orchestration (the differentiator)

| English | es-LATAM | pt-BR | Notes |
|---|---|---|---|
| payment orchestration | orquestación de pagos | orquestração de pagamentos | |
| smart routing | enrutamiento inteligente | roteamento inteligente | |
| routing rule | regla de enrutamiento | regra de roteamento | |
| failover / cascade | conmutación por error / cascada | failover / cascata | |
| authorization rate / approval rate | tasa de aprobación | taxa de aprovação | |
| decline | rechazo | recusa | (dashboard: `recusa`) |
| declined payment | pago rechazado | pagamento recusado | |
| soft / hard decline | rechazo temporal / definitivo | recusa temporária / definitiva | |
| retryable | reintentable | passível de nova tentativa | |

## UI phrasing conventions

- Second person, informal-professional: es **"tú"** (LATAM standard for docs; NOT "usted"),
  pt **"você"**.
- Sentence case for headings, both languages.
- Bold for UI elements, same as English.
- "you" → es "tú" / pt "você"; "your server" → "tu servidor" / "seu servidor".
- Keep the English term in parentheses on first use for: dunning, hosted fields, failover,
  client token, checkout widget, gateway, connection.

## Nav labels (docs.json)

| English tab/group | es | pt |
|---|---|---|
| Documentation | Documentación | Documentação |
| API Reference | Referencia de API | Referência da API |
| JS SDK | SDK de JS | SDK de JS |
| Connections | Conexiones | Conexões |
| Get Started | Primeros pasos | Primeiros passos |
| Core Concepts | Conceptos básicos | Conceitos básicos |
| Guides | Guías | Guias |
| Webhooks | Webhooks | Webhooks |
| AI Assistant | Asistente de IA | Assistente de IA |
| E-Commerce Plugins | Plugins de e-commerce | Plugins de e-commerce |
| Payments | Pagos | Pagamentos |
| Tokenization | Tokenización | Tokenização |
| Subscriptions | Suscripciones | Assinaturas |
| Plans | Planes | Planos |
| SDK Session | Sesión del SDK | Sessão do SDK |
| Payment Methods | Métodos de pago | Métodos de pagamento |
| Overview | Descripción general | Visão geral |
| Card Collection | Recolección de tarjeta | Coleta de cartão |
| Wallets & More | Billeteras y más | Carteiras e mais |
