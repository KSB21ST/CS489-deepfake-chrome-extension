// content.js

// Injection Script를 페이지에 삽입
function injectScript(file) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(file); // 확장 프로그램의 경로에서 inject.js 가져오기
  script.type = "text/javascript";
  script.onload = function () {
    this.remove(); // 삽입 후 DOM에서 제거
  };
  (document.head || document.documentElement).appendChild(script);
}

// Injection Script 삽입
injectScript("inject.js");

// DOM에서 메시지를 받는 역할
window.addEventListener("message", (event) => {
  if (event.source !== window) return; // 자신이 보낸 메시지인지 확인
  if (event.data.type && event.data.type === "FROM_PAGE") {
    console.log("Message from page context:", event.data.data);

    // 데이터를 서버로 전달
    fetch(event.data.apiEndpoint, {
      method: "POST",
      body: event.data.formData,
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error(`Server responded with status: ${response.status}`);
      })
      .then((data) => {
        console.log("Server Response:", data);

        // 결과를 페이지에 다시 전달
        window.postMessage(
          { type: "FROM_EXTENSION", data: data },
          "*"
        );
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  }
});
