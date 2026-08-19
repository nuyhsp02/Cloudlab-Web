/* =========================================
   스크롤 애니메이션 (Intersection Observer)
========================================= */
document.addEventListener("DOMContentLoaded", function() {
    // 'fade-in' 클래스를 가진 모든 요소를 찾습니다.
    const faders = document.querySelectorAll('.fade-in');

    // 관찰자 설정: 요소가 화면에 15% 보일 때 작동
    const appearOptions = {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px" // 화면 하단에서 50px 위로 올라왔을 때 작동되도록 마진 설정
    };

    // 관찰자 생성
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // 화면에 안 보이면 아무 작업도 안 함
            } else {
                entry.target.classList.add('appear'); // 화면에 들어오면 'appear' 클래스 추가
                observer.unobserve(entry.target); // 한 번 나타난 요소는 더 이상 감시하지 않음 (성능 향상)
            }
        });
    }, appearOptions);

    // 찾은 모든 fade-in 요소들에게 관찰자를 붙여줍니다.
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});


/* =========================================
   Hero Section 파티클 애니메이션 (미니멀 네트워크)
========================================= */
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // 캔버스 크기 설정 (화면 크기에 맞춤)
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('.hero').offsetHeight;

    // 마우스 객체 설정
    let mouse = {
        x: null,
        y: null,
        radius: 100 // 마우스를 피하는 반경 설정 (여백 확보)
    }

    // 마우스 이벤트 리스너
    canvas.addEventListener('mousemove', function(event) {
        // 배너 내에서의 마우스 위치 계산
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    // 마우스가 배너 밖으로 나가면 위치 초기화
    canvas.addEventListener('mouseleave', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // 화면 크기 변경 시 캔버스 리사이징
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = document.querySelector('.hero').offsetHeight;
        init(); // 크기가 변하면 파티클 재설정
    });

    // 개별 파티클 클래스 생성
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // 파티클 그리기
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // 파티클 이동 및 마우스 인터랙션 계산
        update() {
            // 벽에 닿으면 방향 반전
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // 마우스 회피 로직 (깔끔함을 위해 마우스 주변 여백 생성)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const maxSpeed = 2; // 밀어내는 속도
                
                // 마우스 반대 방향으로 스르륵 밀려남
                this.x -= forceDirectionX * force * maxSpeed;
                this.y -= forceDirectionY * force * maxSpeed;
            } else {
                // 평소에는 천천히 부유함
                this.x += this.directionX;
                this.y += this.directionY;
            }

            this.draw();
        }
    }

    // 파티클 배열 초기화 (점의 개수를 적당히 조절하여 깔끔함 유지)
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 15000; // 화면 크기에 비례한 점의 개수
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.5) + 0.5; // 먼지처럼 아주 작게 (0.5 ~ 2px)
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            // 아주아주 느린 속도로 이동
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(255, 255, 255, 0.6)'; // 은은한 반투명 흰색

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // 파티클 선 연결 애니메이션
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight); // 이전 프레임 지우기

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect(); // 선 긋기
    }

    // 가까이 있는 파티클끼리 가느다란 선으로 연결
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) 
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                // 거리가 가까울 때만 선을 그림
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    // 거리가 멀어질수록 선이 투명해짐
                    opacityValue = 1 - (distance / 15000);
                    ctx.strokeStyle = 'rgba(255, 255, 255, ' + (opacityValue * 0.2) + ')'; // 극도로 얇고 투명한 선
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    init();
    animate();
});

/* =========================================
   타이핑 애니메이션 (Hero Section)
========================================= */
document.addEventListener("DOMContentLoaded", function() {
    // 랩실에서 다루는 4가지 핵심 키워드
    const words = ["Cloud-Native", "MSA & DevOps", "MLOps", "Data Pipeline"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector('.typing-text');

    if (!typingElement) return;

    function type() {
        const currentWord = words[wordIndex];
        
        // 지우는 중인지, 쓰는 중인지에 따라 글자 수 조절
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        // 화면에 글자 표시
        typingElement.textContent = currentWord.substring(0, charIndex);

        // 타이핑 속도 (글자를 쓸 때는 100ms, 지울 때는 50ms로 더 빠르게)
        let typeSpeed = isDeleting ? 50 : 100;

        // 단어를 다 썼을 때
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // 2초 동안 멈춰서 단어를 보여줌
            isDeleting = true; // 지우기 시작
        } 
        // 단어를 다 지웠을 때
        else if (isDeleting && charIndex === 0) {
            isDeleting = false; // 다시 쓰기 시작
            wordIndex = (wordIndex + 1) % words.length; // 다음 단어로 이동
            typeSpeed = 500; // 단어 넘어가기 전 0.5초 대기
        }

        setTimeout(type, typeSpeed);
    }

    // 1초 뒤에 타이핑 시작
    setTimeout(type, 1000);
});