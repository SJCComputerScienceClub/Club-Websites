
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


document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("club-modal");
  const dialog = modal?.querySelector(".club-notecard");
  const cards = document.querySelectorAll(".club-card");

  if (!modal || !dialog) return;

  const closeButton = modal.querySelector(".club-modal-close");
  let previouslyFocused = null;

  const fields = [
    {
      key: "purpose",
      item: "purpose-item",
      output: "modal-club-purpose"
    },
    {
      key: "meeting",
      item: "meeting-item",
      output: "modal-club-meeting"
    },
    {
      key: "location",
      item: "location-item",
      output: "modal-club-location"
    },
    {
      key: "moderator",
      item: "moderator-item",
      output: "modal-club-moderator"
    }
  ];

  function openClubCard(card) {
    const name = card.querySelector(".club-card-name");
    const image = card.querySelector(".club-card-img");

    if (!name) return;

    previouslyFocused = card;

    document.getElementById("modal-club-name").textContent =
      name.textContent.trim();

    const modalImage = document.getElementById("modal-club-image");

    modalImage.src = image ? image.src : "";
    modalImage.alt = image ? image.alt : name.textContent.trim();
    modalImage.hidden = !image;

    const imageWrap = modal.querySelector(".club-notecard-image-wrap");
    imageWrap.hidden = !image;

    fields.forEach(({ key, item, output }) => {
      const value = (card.dataset[key] || "").trim();
      const section = document.getElementById(item);
      const paragraph = document.getElementById(output);

      paragraph.textContent = value;
      section.hidden = !value;
    });
    
    const websiteButton = document.getElementById("modal-club-website");
    const website = (card.dataset.website || "").trim();
    
    let validWebsite = "";
    
    try {
      const parsedURL = new URL(website);
    
      if (
        ["https:", "http:"].includes(parsedURL.protocol) &&
        parsedURL.hostname.includes(".")
      ) {
        validWebsite = parsedURL.href;
      }
    } catch {
      // No valid website supplied.
    }
    
    websiteButton.hidden = !validWebsite;
    
    if (validWebsite) {
      websiteButton.href = validWebsite;
    }


    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modal.inert = false;
    document.body.style.overflow = "hidden";

    closeButton.focus();
  }

  function closeClubCard() {
    if (!modal.classList.contains("is-open")) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.inert = true;
    document.body.style.overflow = "";

    if (previouslyFocused?.isConnected) {
      previouslyFocused.focus();
    }
  }

  cards.forEach(card => {
    // Preserve the current HTML links, but open the information card.
    card.addEventListener("click", event => {
      event.preventDefault();
      openClubCard(card);
    });

    // Make the thumbnail accessible by keyboard.
    card.addEventListener("keydown", event => {
      if (
        event.target === card &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        openClubCard(card);
      }
    });
  });

  modal.querySelectorAll("[data-close-modal]").forEach(element => {
    element.addEventListener("click", closeClubCard);
  });

  document.addEventListener("keydown", event => {
    if (!modal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeClubCard();
      return;
    }

    // Keep keyboard focus within the open notecard.
    if (event.key === "Tab") {
      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled), ' +
          'select:not(:disabled), textarea:not(:disabled), ' +
          '[tabindex]:not([tabindex="-1"])'
        )
      ).filter(element => !element.hidden);

      if (!focusable.length) {
        event.preventDefault();
        closeButton.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  });
});

