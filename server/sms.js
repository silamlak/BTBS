import twilio from "twilio";

export const sendMessage = (to, body) => {
  if (!to || !body) return;
  const formattedTo = to.startsWith("0") ? `+251${to.slice(1)}` : to;

  const client = new twilio(process.env.SID, process.env.TOKEN);
  return client.messages
    .create({
      body,
      from: "+19034874781",
      to: formattedTo,
    })
    .then((msg) => {
      console.log("Message sent:", msg.sid); // Show message SID for confirmation
    })
    .catch((err) => {
      console.error("Error sending message:", err);
    });
};
