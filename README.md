CLOUDLAB Web

CLOUDLAB을 소개하기 위한 공식 웹사이트 프로젝트입니다.

연구실 소개, 활동 및 교육 과정, 멤버, 리쿠르팅 등의 정보를 제공하며
HTML, CSS, JavaScript 기반의 정적 웹사이트로 개발합니다.

Team

CLOUDLAB Web 5기

박성현
정우명
최승연
## 프로젝트 구조

```text
Cloudlab-Web/
├── index.html
├── about.html
├── projects.html
├── publications.html
├── members.html
├── recruiting.html
├── faq.html
├── css/
│   └── styles.css
├── js/
│   ├── script.js
│   ├── projects.js
│   └── publications.js
└── data/
    ├── projects.json
    └── publications.json
```

## 콘텐츠 수정 방법

Projects와 Publications는 HTML에 항목을 직접 추가하지 않고 `data/`의 JSON 파일로 관리합니다.

- 교육 과정 또는 프로젝트 추가: `data/projects.json`
- 논문 추가: `data/publications.json`

JSON 항목을 추가하면 각 페이지에서 자동으로 렌더링됩니다. 공통 레이아웃이나 카드 디자인을 바꿀 때만 HTML/CSS/JS를 수정하는 것을 권장합니다.

로컬 확인 시 JSON `fetch()`가 정상 동작하도록 프로젝트 루트에서 간단한 웹 서버를 실행합니다.

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다.
