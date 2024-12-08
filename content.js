const baseUrl = 'http://localhost:5000/predict';

// 모든 이미지 요소를 선택
const images = document.querySelectorAll("img");

// hover 이벤트 리스너 추가
images.forEach(image => {
  image.addEventListener("mouseenter", () => {
    console.log("Hovered over image:", image.src);
    image.style.outline = "2px solid red";

    // Check if image.src is base64 or URL
    const base64Prefix = "data:image";
    let requestBody = {};

    if (image.src.startsWith(base64Prefix)) {
      console.log("Image is base64 encoded.");
      requestBody = { base64Url: image.src };
    } else {
      console.log("Image is a downloadable URL.");
      requestBody = { downloadUrl: image.src };
    }

    // Send request to server
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
        // Display server response (you can customize this part)
        const infoElement = document.getElementById("info");
        if (infoElement) {
          infoElement.textContent = `Prediction: ${data.probability}`;
        }
      })
      .catch(error => {
        console.error("Error sending image URL:", error);
      });

    // Show hover info
    showImageInfo(image);
  });

  image.addEventListener("mouseleave", () => {
    image.style.outline = "none";
    hideImageInfo();
  });
});

// hover 시 표시할 정보를 처리
function showImageInfo(image) {
  const infoBox = document.createElement("div");
  infoBox.id = "hover-info-box";
  infoBox.innerText = `Image Source: ${image.src.startsWith("data:image") ? "Base64" : "URL"}`;
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
  document.body.appendChild(infoBox);
}

function hideImageInfo() {
  const infoBox = document.getElementById("hover-info-box");
  if (infoBox) {
    infoBox.remove();
  }
}
