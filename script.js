
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".club-grid");
  const previousButton = document.getElementById("clubs-prev");
  const nextButton = document.getElementById("clubs-next");
  const pageStatus = document.getElementById("clubs-page-status");

  if (!grid || !previousButton || !nextButton || !pageStatus) return;

  const cards = Array.from(grid.querySelectorAll(".club-card"))
  .sort((a, b) => {
    const nameA = a.querySelector("h2, h3, h4")?.textContent.trim() || "";
    const nameB = b.querySelector("h2, h3, h4")?.textContent.trim() || "";

    return nameA.localeCompare(nameB, "en", {
      sensitivity: "base",
      numeric: true
    });
  });

const pageSize = 9;

// Reorder the actual HTML elements to match the alphabetical sort
cards.forEach(card => grid.appendChild(card));
  let currentPage = 0;

  const totalPages = Math.max(1, Math.ceil(cards.length / pageSize));

  function showPage(page) {
    currentPage = Math.max(0, Math.min(page, totalPages - 1));

    cards.forEach((card, index) => {
      card.hidden =
        index < currentPage * pageSize ||
        index >= (currentPage + 1) * pageSize;
    });

    previousButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;

    const firstClub = cards.length ? currentPage * pageSize + 1 : 0;
    const lastClub = Math.min((currentPage + 1) * pageSize, cards.length);

    pageStatus.textContent =
      `Page ${currentPage + 1} of ${totalPages}` +
      (cards.length ? ` · Clubs ${firstClub}–${lastClub}` : "");

    pageStatus.setAttribute("aria-label", pageStatus.textContent);
  }

  previousButton.addEventListener("click", () => {
    showPage(currentPage - 1);
  });

  nextButton.addEventListener("click", () => {
    showPage(currentPage + 1);
  });

  showPage(0);
});

