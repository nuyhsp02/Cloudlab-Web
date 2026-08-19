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


const menuToggle = document.querySelector(".menu-toggle");
const navElement = document.querySelector(".nav");


if (menuToggle && navElement) {
    menuToggle.addEventListener("click", () => {
        navElement.classList.toggle("open");
    });
}


if (navElement) {
    const navLinks = [...navElement.querySelectorAll("a")];

    const highlight = document.createElement("div");
    highlight.classList.add("nav-highlight");

    navElement.appendChild(highlight);


    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";


    const currentLink =
        navLinks.find((link) => {
            return link.getAttribute("href") === currentPage;
        });


    if (currentLink) {
        currentLink.classList.add("active");
    }


    function moveHighlight(link) {
        if (!link) {
            return;
        }

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
            if (window.innerWidth <= 820) {
                return;
            }

            showHighlight(link);
        });


        link.addEventListener("mouseleave", () => {
            if (window.innerWidth <= 820) {
                return;
            }

            hideHighlight();
        });


        link.addEventListener("click", (event) => {
            const destination = link.getAttribute("href");

            if (!destination) {
                return;
            }


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
        if (window.innerWidth <= 820) {
            return;
        }

        hideHighlight();
    });


    window.addEventListener("resize", () => {
        if (window.innerWidth <= 820) {
            hideHighlight();
        }
    });
}