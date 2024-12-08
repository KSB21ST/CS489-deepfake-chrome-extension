const baseUrl = 'https://realeye.nurshift.com/predict';

let detectingState = false; // popup.js에서 전달받은 상태를 저장
let hoverTimer = null;       // hover 시 1초 후 요청 전송 위한 타이머
let hoveredElement = null;   // 현재 hover 중인 요소

// 상태 업데이트 메시지 수신
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateState") {
    detectingState = message.detecting;
    sendResponse({status: "ok"});
  }
});

// 모든 DOM 요소에서 hover 이벤트 감지
document.addEventListener("mouseover", (event) => {
  if (!detectingState) return; // Detecting이 Off면 동작 안함

  hoveredElement = event.target;
  const tagName = hoveredElement.tagName.toLowerCase();

  // 이미지 태그인지, 배경 이미지를 가진 태그인지 확인
  const backgroundImage = getComputedStyle(hoveredElement).backgroundImage;

  if (tagName === "img") {
    handleImageHover(hoveredElement, hoveredElement.src);
  } else if (backgroundImage && backgroundImage !== "none") {
    // 배경 이미지의 URL 추출
    const bgImageUrl = backgroundImage.slice(5, -2); // background-image: url("...") 에서 URL만 추출
    handleImageHover(hoveredElement, bgImageUrl);
  } else {
    // 이미지가 아닌 경우 처리하지 않음
    hideImageInfo();
    return;
  }

  // "Detecting..." 표시
  showImageInfo("Detecting...");

  // 1초 후에 API 요청을 보내기 위한 타이머 설정
  hoverTimer = setTimeout(() => {
    sendImageToServer(hoveredElement);
  }, 1000);
});

// hover가 해제되었을 때 처리
document.addEventListener("mouseout", (event) => {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  hoveredElement = null;

  // 커서를 기본값으로 복구
  document.body.style.cursor = "auto";

  hideImageInfo();
});

// 이미지 hover 처리 함수
function handleImageHover(element, imageUrl) {
  // 커서를 custom 커서로 설정
  document.body.style.cursor = `url(${chrome.runtime.getURL("icons/icon_32.png")}), auto`;
  element.style.cursor = `url(${chrome.runtime.getURL("icons/icon_32.png")}), auto`;
  // outline 제거 및 추가 스타일 처리 (필요 시)
  element.style.outline = "none";
  console.log("Hovered element:", element);
  console.log("Image URL:", imageUrl);
}

// 이미지 정보 요청 함수
function sendImageToServer(element) {
  const tagName = element.tagName.toLowerCase();
  let imageUrl = "";

  if (tagName === "img") {
    imageUrl = element.src;
  } else {
    const backgroundImage = getComputedStyle(element).backgroundImage;
    if (backgroundImage && backgroundImage !== "none") {
      imageUrl = backgroundImage.slice(5, -2); // background-image URL 추출
    }
  }

  if (!imageUrl) return; // 이미지 URL이 없으면 요청 중단

  const base64Prefix = "data:image";
  let requestBody = {};

  if (imageUrl.startsWith(base64Prefix)) {
    requestBody = { base64Url: imageUrl };
  } else {
    requestBody = { downloadUrl: imageUrl };
  }

  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Server response:", data);

      // Probability formatting
      let prob = data.probability;
      let displayProb = 0;
      if (prob <= 0.01) {
        displayProb = 0;
      } else {
        displayProb = parseFloat(prob.toFixed(2)); // 소수점 둘째 자리까지 표시
      }

      // probability가 0.1 이상이면 두껍고 진한 빨간색 테두리
      if (prob >= 0.1 && hoveredElement) {
        hoveredElement.style.outline = "4px solid red";
      }

      const infoBox = document.getElementById("hover-info-box");
      if (infoBox) {
        infoBox.innerText = `Prediction: ${displayProb}`;
      }
    })
    .catch(error => {
      console.error("Error sending image URL:", error);
      const infoBox = document.getElementById("hover-info-box");
      if (infoBox) {
        infoBox.innerText = "Error detecting.";
      }
    });
}

// hover 시 표시할 정보를 처리
function showImageInfo(text) {
  let infoBox = document.getElementById("hover-info-box");
  if (!infoBox) {
    infoBox = document.createElement("div");
    infoBox.id = "hover-info-box";
    document.body.appendChild(infoBox);
  }
  infoBox.innerText = text;
  infoBox.style.position = "fixed";
  infoBox.style.top = "50%";
  infoBox.style.left = "50%";
  infoBox.style.transform = "translate(-50%, -50%)"; // 중앙으로 이동
  infoBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  infoBox.style.color = "white";
  infoBox.style.padding = "10px";
  infoBox.style.borderRadius = "8px";
  infoBox.style.zIndex = "1000";
  infoBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
}

function hideImageInfo() {
  const infoBox = document.getElementById("hover-info-box");
  if (infoBox) {
    infoBox.remove();
  }
}
