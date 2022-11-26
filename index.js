const host = "https://ytlivechat.herokuapp.com";

const eventSource = new EventSource(host);

eventSource.onopen = () => {
  console.log("connected");
};

eventSource.onmessage = (event) => {
  updateMessage(event.data);
};

eventSource.onerror = function () {
  console.log("Server closed connection");
  eventSource.close();
};

/**
 * This method is called to append the
 * response data to the document.
 */
function updateMessage(data) {
  const { name, message } = JSON.parse(data);
  const chats = document.getElementById("chat-data");
  const chat = `<p><b>${name}: </b>${message}</p>`;
  const chatres = document.createRange().createContextualFragment(chat);
  chats.appendChild(chatres);
  document
    .querySelector(".chat-content")
    .scrollTo(0, document.querySelector(".chat-content").scrollHeight);
}

/**
 * This method is called to update
 * the user name and make it non
 * editable until the user clicks on edit.
 */
const updateName = () => {
  const mode = document.getElementById("update-name").value;
  if (mode === "Edit") {
    document.getElementById("name").readOnly = false;
    document.getElementById("update-name").value = "Save";
  } else {
    document.getElementById("name").readOnly = true;
    document.getElementById("update-name").value = "Edit";
  }
};

/**
 * This method calls the API to send data
 * to the server to save the chat message.
 */
const sendMessage = (message) => {
  const name = document.getElementById("name").value;
  if (!name || !message) {
    return;
  }
  fetch(host + "/add-message", {
    method: "POST",
    body: JSON.stringify({
      name,
      message,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => console.log("Data Sent successfully"))
    .catch((e) => console.log("error occurred", e));
};

var input = document.getElementById("message");

/**
 * Watch the keypress event and trigger the
 * API on press of enter.
 */
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage(event.target.value);
    event.target.value = "";
  }
});
