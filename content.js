// 모든 이미지 요소를 선택
const images = document.querySelectorAll("img");

// hover 이벤트 리스너 추가
images.forEach(image => {
  image.addEventListener("mouseenter", () => {
    console.log("Hovered over image:", image.src);
    image.style.outline = "2px solid red";

    fetch('http://143.248.136.29:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUrl: image.src })
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
          infoElement.textContent = `Prediction: ${data.prediction}`;
        }
      })
      .catch(error => {
        console.error("Error sending image URL:", error);
      });

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
// Middle
    infoBox.id = "hover-info-box";
    infoBox.innerText = `Image URL: ${image.src}`;
    infoBox.style.position = "fixed";
    infoBox.style.top = "50%";
    infoBox.style.left = "50%";
    infoBox.style.transform = "translate(-50%, -50%)"; // 중앙으로 이동
    infoBox.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    infoBox.style.color = "white";
    infoBox.style.padding = "10px";
    infoBox.style.zIndex = "1000";
    document.body.appendChild(infoBox);
}

function hideImageInfo() {
  const infoBox = document.getElementById("hover-info-box");
  if (infoBox) {
    infoBox.remove();
  }
}
