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

const sendMessage = (message) => {
  const name = document.getElementById("name").value;
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
    .then((data) => data.json())
    .then((d) => console.log(d))
    .catch((e) => console.log("error occurred"));
};

var input = document.getElementById("message");

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage(event.target.value);
    event.target.value = "";
  }
});
