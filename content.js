// 모든 이미지 요소를 선택
const images = document.querySelectorAll("img");
const baseURL = "http://143.248.136.29:5000";
const apiEndpoint = `${baseURL}/predict`;
// hover 이벤트 리스너 추가
images.forEach((image) => {
  image.addEventListener("mouseenter", () => {
    // hover 시 실행할 코드
    // 간단히 이미지를 강조
    image.style.outline = "2px solid red";

    // 커스텀 동작 (예: 팝업 생성)
    showImageInfo(image);
  });

  image.addEventListener("mouseleave", () => {
    // hover가 끝났을 때 실행할 코드
    image.style.outline = "none";
    hideImageInfo();
  });
});

// hover 시 표시할 정보를 처리
function showImageInfo(image) {
  const infoBox = document.createElement("div");
  infoBox.id = "hover-info-box";
  infoBox.innerText = "Fetching suspiciousness..."; // 기본 메시지
  infoBox.style.position = "fixed";
  infoBox.style.top = "50%";
  infoBox.style.left = "50%";
  infoBox.style.transform = "translate(-50%, -50%)"; // 중앙으로 이동
  infoBox.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
  infoBox.style.color = "white";
  infoBox.style.padding = "10px";
  infoBox.style.zIndex = "1000";
  document.body.appendChild(infoBox);

  // Suspiciousness 값을 가져오는 함수 호출
  const base64ImageSrc = image.src; // Base64 데이터 가져오기
  getSuspiciousness(base64ImageSrc, infoBox, apiEndpoint);
}

function hideImageInfo() {
  const infoBox = document.getElementById("hover-info-box");
  if (infoBox) {
    infoBox.remove(); // hover가 끝났을 때 InfoBox 제거
  }
}

// Suspiciousness 계산 함수
function getSuspiciousness(base64ImageSrc, infoBox, apiEndpoint) {
  // Base64 데이터를 디코드하여 Blob으로 변환
  const base64Data = base64ImageSrc.split(",")[1]; // Base64 데이터 부분만 추출
  const binaryData = atob(base64Data); // Base64 디코딩
  const arrayBuffer = new Uint8Array(binaryData.length);
  console.log("Sending request to:", apiEndpoint);
  console.log("FormData:", formData.get('image')); // Blob 내용 확인

  for (let i = 0; i < binaryData.length; i++) {
    arrayBuffer[i] = binaryData.charCodeAt(i); // Binary 데이터로 변환
  }

  const blob = new Blob([arrayBuffer], { type: "image/png" }); // Blob 생성

  // FormData에 Blob 추가
  const formData = new FormData();
  formData.append("image", blob, "image.png"); // Blob을 FormData에 추가

  // API로 요청 전송
  fetch(apiEndpoint, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else throw new Error("Server responded with an error.");
    })
    .then((data) => {
      const suspiciousness = data.probability; // API 응답에서 Suspiciousness 가져오기
      infoBox.innerText = `Suspiciousness: ${suspiciousness}`; // 결과를 InfoBox에 업데이트
      console.log(suspiciousness);
    })
    .catch((error) => {
      console.error("Error:", error); // 에러 처리
      infoBox.innerText = "Suspiciousness: Error"; // InfoBox에 에러 표시
    });
}
