const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
initializeApp();
exports.pushOnAlert = onDocumentCreated("agencia/{tenantId}/alerts/{alertId}", async (event) => {
  const note = event.data && event.data.data();
  const tenantId = event.params.tenantId;
  if (!note) return;
  const tokensSnap = await getFirestore().collection("agencia").doc(tenantId).collection("tokens").get();
  const tokens = tokensSnap.docs.map((d) => d.data().token).filter(Boolean);
  if (!tokens.length) return;
  await getMessaging().sendEachForMulticast({
    tokens: tokens,
    notification: { title: note.title || "Agenda", body: note.body || "Novo agendamento" },
    data: { tenant: String(tenantId), id: String(note.id || "") }
  });
});
