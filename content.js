// 모든 이미지 요소를 선택
const images = document.querySelectorAll("img");
const baseURL = "http://143.248.136.29:5000";
const apiEndpoint = `${baseURL}/predict`;

images.forEach((image) => {
  image.crossOrigin = "anonymous"; // 크로스오리진 활성화
  image.addEventListener("mouseenter", () => {
    image.style.outline = "2px solid red"; // 강조 표시
    showImageInfo(image); // 팝업 생성 및 API 호출
  });

  image.addEventListener("mouseleave", () => {
    image.style.outline = "none"; // 강조 해제
    hideImageInfo(); // 팝업 제거
  });
});

// hover 시 표시할 정보를 처리
function showImageInfo(image) {
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

  sendImageDirectly(image, infoBox, apiEndpoint);
}

// hover가 끝났을 때 정보를 숨김
function hideImageInfo() {
  const infoBox = document.getElementById("hover-info-box");
  if (infoBox) {
    infoBox.remove();
  }
}

// 이미지를 타입 변환 없이 서버로 전송
function sendImageDirectly(image, infoBox, apiEndpoint) {
  const imageType = getImageType(image.src); // 이미지 타입 추출
  const blob = base64ToBlob(image.src, imageType); // Base64 데이터를 Blob으로 변환

  if (!blob) {
    console.error("Failed to convert image to Blob.");
    infoBox.innerText = "Suspiciousness: Error";
    return;
  }

  const formData = new FormData();
  formData.append("image", blob, `image.${imageType}`);

  console.log("Sending request to:", apiEndpoint);
  console.log("FormData entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  fetch(apiEndpoint, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else throw new Error(`Server responded with status: ${response.status}`);
    })
    .then((data) => {
      const suspiciousness = data.probability;
      infoBox.innerText = `Suspiciousness: ${suspiciousness}`;
      console.log("API Response:", data);
    })
    .catch((error) => {
      console.error("Fetch Error:", error);
      infoBox.innerText = "Suspiciousness: Error";
    });
}

// 이미지 src에서 타입 추출
function getImageType(src) {
  const matches = src.match(/^data:image\/(jpeg|png|gif|bmp);base64,/);
  if (matches && matches[1]) {
    return matches[1];
  } else {
    console.error("Unsupported image format or invalid Base64 string.");
    return "jpeg"; // 기본값으로 jpeg 반환
  }
}

// Base64 데이터를 Blob으로 변환
function base64ToBlob(base64, type) {
  try {
    const base64Data = base64.split(",")[1];
    const binaryData = atob(base64Data);
    const arrayBuffer = new Uint8Array(binaryData.length);

    for (let i = 0; i < binaryData.length; i++) {
      arrayBuffer[i] = binaryData.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: `image/${type}` });
  } catch (error) {
    console.error("Error converting Base64 to Blob:", error);
    return null;
  }
}
