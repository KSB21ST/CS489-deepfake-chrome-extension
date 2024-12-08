// inject.js

console.log("Injection script running in page context");

// 모든 이미지 요소에 hover 이벤트 추가
const images = document.querySelectorAll("img");
images.forEach((image) => {
  image.addEventListener("mouseenter", () => {
    image.style.outline = "2px solid red";
    handleImageHover(image);
  });

  image.addEventListener("mouseleave", () => {
    image.style.outline = "none";
    hideImageInfo();
  });
});

// hover 시 이미지 정보 처리
function handleImageHover(image) {
  const infoBox = document.createElement("div");
  infoBox.id = "hover-info-box";
  infoBox.innerText = "Fetching suspiciousness...";
  infoBox.style.position = "fixed";
  infoBox.style.top = "50%";
  infoBox.style.left = "50%";
  infoBox.style.transform = "translate(-50%, -50%)";
  infoBox.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
  infoBox.style.color = "white";
  infoBox.style.padding = "10px";
  infoBox.style.zIndex = "1000";
  document.body.appendChild(infoBox);

  // 이미지 데이터를 Canvas로 변환
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = image.width;
  canvas.height = image.height;

  try {
    context.drawImage(image, 0, 0);

    // Canvas 데이터를 Blob으로 변환
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Failed to convert image to Blob.");
        infoBox.innerText = "Suspiciousness: Error";
        return;
      }

      // FormData 생성
      const formData = new FormData();
      formData.append("image", blob, "image.png");

      // Content Script로 메시지 전달
      window.postMessage(
        {
          type: "FROM_PAGE",
          data: { message: "Image Blob ready" },
          apiEndpoint: "http://143.248.136.29:5000/predict",
          formData: formData,
        },
        "*"
      );
    }, "image/png");
  } catch (error) {
    console.error("Canvas error:", error.message);
    infoBox.innerText = "Suspiciousness: Error (CORS Issue)";
  }
}

// hover가 끝났을 때 정보 숨김
function hideImageInfo() {
  const infoBox = document.getElementById("hover-info-box");
  if (infoBox) {
    infoBox.remove();
  }
}

// 메시지 수신하여 UI 업데이트
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data.type && event.data.type === "FROM_EXTENSION") {
    const infoBox = document.getElementById("hover-info-box");
    if (infoBox) {
      infoBox.innerText = `Suspiciousness: ${event.data.data.probability}`;
    }
  }
});
