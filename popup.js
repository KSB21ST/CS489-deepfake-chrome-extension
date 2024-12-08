const onBtn = document.getElementById("onBtn");
const offBtn = document.getElementById("offBtn");

// 초기 상태를 Off로 가정
let detectingState = false;

// 상태 변경 함수
function updateDetectingState(state) {
    detectingState = state;

    // UI 업데이트
    if (detectingState) {
        onBtn.classList.add("on");
        offBtn.classList.remove("on");
    } else {
        offBtn.classList.add("on");
        onBtn.classList.remove("on");
    }

    // 상태를 저장
    chrome.storage.local.set({detecting: detectingState});

    // content.js에 상태 전달
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "updateState", detecting: detectingState});
    });
}

// 이벤트 리스너 등록
onBtn.addEventListener("click", () => {
    updateDetectingState(true);
});

offBtn.addEventListener("click", () => {
    updateDetectingState(false);
});

// 팝업이 열릴 때 상태 복원
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["detecting"], (result) => {
        const savedState = result.detecting !== undefined ? result.detecting : false;
        updateDetectingState(savedState);
    });
});
