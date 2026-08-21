async function loadProjects() {
    const courseGrid = document.querySelector("#course-grid");
    const labProjectList = document.querySelector("#lab-project-list");

    if (!courseGrid || !labProjectList) return;

    try {
        const response = await fetch("data/projects.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        courseGrid.innerHTML = data.courses.map((course, index) => `
            <article class="course-card reveal">
                <div class="course-card-top">
                    <span class="course-number">${String(index + 1).padStart(2, "0")}</span>
                    <span class="course-category">${course.category}</span>
                </div>
                <div class="course-card-body">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                </div>
                <a class="course-link" href="${course.url}" target="_blank" rel="noopener noreferrer">
                    Explore course <span aria-hidden="true">↗</span>
                </a>
            </article>
        `).join("");

        labProjectList.innerHTML = data.labProjects.map((project) => `
            <article class="lab-project-card reveal">
                <div class="lab-project-meta">
                    <span class="project-status">${project.status}</span>
                    <span class="project-subtitle">${project.subtitle}</span>
                </div>
                <div class="lab-project-copy">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map((tag) => `<span>#${tag.replaceAll(" ", "")}</span>`).join("")}
                    </div>
                </div>
                ${project.url
                    ? `<a class="project-detail-link" href="${project.url}" target="_blank" rel="noopener noreferrer">View project <span>↗</span></a>`
                    : `<span class="project-detail-link is-disabled">Details coming soon</span>`}
            </article>
        `).join("");

        if (window.observeRevealElements) {
            window.observeRevealElements(courseGrid);
            window.observeRevealElements(labProjectList);
        }
    } catch (error) {
        console.error("프로젝트 데이터를 불러오지 못했습니다.", error);
        courseGrid.innerHTML = '<p class="data-error">프로젝트 정보를 불러오지 못했습니다.</p>';
    }
}

loadProjects();
