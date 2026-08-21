async function loadPublications() {
    const publicationList = document.querySelector("#publication-list");
    if (!publicationList) return;

    try {
        const response = await fetch("data/publications.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const publications = await response.json();

        publicationList.innerHTML = publications.map((publication, index) => `
            <article class="publication-item reveal">
                <div class="publication-index">${String(index + 1).padStart(2, "0")}</div>
                <div class="publication-main">
                    <div class="publication-meta">
                        ${publication.year ? `<span>${publication.year}</span>` : '<span>PUBLICATION</span>'}
                        <span>${publication.venue}</span>
                    </div>
                    <h3>${publication.title}</h3>
                    <p>${publication.authors}</p>
                </div>
                ${publication.url
                    ? `<a class="publication-link" href="${publication.url}" target="_blank" rel="noopener noreferrer" aria-label="논문 링크 열기">↗</a>`
                    : '<span class="publication-link is-disabled" aria-hidden="true">—</span>'}
            </article>
        `).join("");

        if (window.observeRevealElements) {
            window.observeRevealElements(publicationList);
        }
    } catch (error) {
        console.error("논문 데이터를 불러오지 못했습니다.", error);
        publicationList.innerHTML = '<p class="data-error">논문 정보를 불러오지 못했습니다.</p>';
    }
}

loadPublications();
