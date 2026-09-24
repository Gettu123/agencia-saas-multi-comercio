# Agencia SaaS Multi-Comercio

White-label de agendamento com garantia e fidelidade.
Brasil (Pix / R$) + Venezuela (Pago Movil / Bs). Licenca da agencia em USD.

Site: https://gettu123.github.io/agencia-saas-multi-comercio/

## Acessos demo
- Dono Aurora: admin@aurora.local / 1234
- Dono El Leon: admin@leon.local / 1234
- Super Admin: usd2026
- Cliente: nome + telefone na vitrine

## Nuvem e push (Firebase)
1. console.firebase.google.com -> projeto agencia-saas
2. Firestore modo teste (southamerica-east1)
3. App Web -> copiar apiKey, projectId, appId
4. Cloud Messaging -> Web Push certificates -> vapidKey
5. Colar em data/firebase.json e enabled true
6. Push com app fechado: cd functions && npm i && firebase deploy --only functions

Contato: +55 19 98608-3932 / sanderolameda@gmail.com
