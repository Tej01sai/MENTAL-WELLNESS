export const sendMessageToChatbot = async (message) => {
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  return await response.json();
};
