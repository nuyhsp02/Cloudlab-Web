// 1. Reveal 스크롤 애니메이션
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("on");
            }
        });
    },
    {
        threshold: 0.12
    }
);

document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
});

// 2. 모바일 메뉴 토글
const menuToggle = document.querySelector(".menu-toggle");
const navElement = document.querySelector(".nav");

if (menuToggle && navElement) {
    menuToggle.addEventListener("click", () => {
        navElement.classList.toggle("open");
    });
}

// 3. 내비게이션 링크 및 하이라이트
if (navElement) {
    const navLinks = [...navElement.querySelectorAll("a")];

    const highlight = document.createElement("div");
    highlight.classList.add("nav-highlight");

    navElement.appendChild(highlight);

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const currentLink = navLinks.find((link) => {
        return link.getAttribute("href") === currentPage;
    });

    if (currentLink) {
        currentLink.classList.add("active");
    }

    function moveHighlight(link) {
        if (!link) return;
        highlight.style.left = `${link.offsetLeft}px`;
        highlight.style.width = `${link.offsetWidth}px`;
    }

    function showHighlight(link) {
        moveHighlight(link);
        highlight.classList.remove("clicking");
        highlight.classList.add("hovering");
    }

    function hideHighlight() {
        highlight.classList.remove("hovering");
        highlight.classList.remove("clicking");
    }

    navLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            if (window.innerWidth <= 820) return;
            showHighlight(link);
        });

        link.addEventListener("mouseleave", () => {
            if (window.innerWidth <= 820) return;
            hideHighlight();
        });

        link.addEventListener("click", (event) => {
            const destination = link.getAttribute("href");
            if (!destination) return;

            if (window.innerWidth <= 820) {
                navElement.classList.remove("open");
                return;
            }

            event.preventDefault();
            moveHighlight(link);

            highlight.classList.remove("hovering");
            highlight.classList.add("clicking");

            if (destination === currentPage) {
                setTimeout(() => {
                    hideHighlight();
                }, 120);
                return;
            }

            setTimeout(() => {
                window.location.href = destination;
            }, 140);
        });
    });

    navElement.addEventListener("mouseleave", () => {
        if (window.innerWidth <= 820) return;
        hideHighlight();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth <= 820) {
            hideHighlight();
        }
    });
}

// 메인 Hero 단일 커서 이동 타이핑 효과
document.addEventListener("DOMContentLoaded", () => {
    const connectEl = document.querySelector(".typing-connect");
    const createEl = document.querySelector(".typing-create");
    const connectLine = document.querySelector(".title-connect");
    const createLine = document.querySelector(".title-create");
    const cursorEl = document.querySelector(".typing-cursor");

    if (!connectEl || !createEl || !cursorEl || !connectLine || !createLine) return;

    const word1 = "Connect.";
    const word2 = "Create.";

    let stage = 0; // 0: 2행 타이핑, 1: 3행 타이핑, 2: 3행 삭제, 3: 2행 삭제
    let char1 = 0;
    let char2 = 0;

    function moveCursor(targetLine) {
        if (cursorEl.parentElement !== targetLine) {
            targetLine.appendChild(cursorEl);
        }
    }

    function runTyping() {
        let speed = 90;

        if (stage === 0) {
            // 2행 Connect. 타이핑
            moveCursor(connectLine);
            char1++;
            connectEl.textContent = word1.substring(0, char1);

            if (char1 === word1.length) {
                stage = 1;
                speed = 300; // 3행으로 넘어가기 전 잠깐 대기
            }
        } else if (stage === 1) {
            // 3행 Create. 타이핑
            moveCursor(createLine);
            char2++;
            createEl.textContent = word2.substring(0, char2);

            if (char2 === word2.length) {
                stage = 2;
                speed = 2200; // 3줄 완성 후 2.2초 대기
            }
        } else if (stage === 2) {
            // 3행 Create. 삭제
            moveCursor(createLine);
            char2--;
            createEl.textContent = word2.substring(0, char2);
            speed = 45;

            if (char2 === 0) {
                stage = 3;
                speed = 150;
            }
        } else if (stage === 3) {
            // 2행 Connect. 삭제
            moveCursor(connectLine);
            char1--;
            connectEl.textContent = word1.substring(0, char1);
            speed = 45;

            if (char1 === 0) {
                stage = 0;
                speed = 600; // 전부 지워진 후 0.6초 뒤 다시 시작
            }
        }

        setTimeout(runTyping, speed);
    }

    setTimeout(runTyping, 700);
});