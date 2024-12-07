// 모든 이미지 요소를 선택
const images = document.querySelectorAll("img");

// hover 이벤트 리스너 추가
images.forEach(image => {
  image.addEventListener("mouseenter", () => {
    // hover 시 실행할 코드
    console.log("Hovered over image:", image.src);

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
  infoBox.innerText = `Subin Kim Image URL: ${image.src}`;
  infoBox.style.position = "fixed";
  infoBox.style.top = "10px";
  infoBox.style.right = "10px";
  infoBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
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
