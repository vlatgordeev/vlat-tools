const toolRows = document.querySelectorAll(".tool-row");
const avatarLink = document.querySelector(".avatar-link");
const clickSound = new Audio("./assets/sound.mp3");
clickSound.preload = "auto";
const hoverColors = [
  "#e11d48",
  "#2563eb",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#0f766e",
  "#dc2626",
  "#4f46e5",
];

function randomHoverColor() {
  return hoverColors[Math.floor(Math.random() * hoverColors.length)];
}

toolRows.forEach((row) => {
  row.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") {
      row.classList.remove("is-hovered");
      return;
    }

    row.style.setProperty("--hover-color", randomHoverColor());
    row.classList.add("is-hovered");
  });

  row.addEventListener("pointerleave", () => {
    row.classList.remove("is-hovered");
  });

  row.addEventListener("pointercancel", () => {
    row.classList.remove("is-hovered");
  });

  row.addEventListener("touchend", () => {
    row.classList.remove("is-hovered");
  });

  row.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      return;
    }

    openToolLink(row);
  });

  row.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openToolLink(row);
  });
});

function openToolLink(row) {
  window.open(row.dataset.url, "_blank", "noopener,noreferrer");
}

function updateAvatarTilt(event) {
  const bounds = avatarLink.getBoundingClientRect();
  const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
  const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
  const rotateY = offsetX * 42;
  const rotateX = offsetY * -36;

  avatarLink.style.setProperty("--avatar-rotate-x", `${rotateX.toFixed(2)}deg`);
  avatarLink.style.setProperty("--avatar-rotate-y", `${rotateY.toFixed(2)}deg`);
}

function resetAvatarTilt() {
  avatarLink.style.setProperty("--avatar-rotate-x", "0deg");
  avatarLink.style.setProperty("--avatar-rotate-y", "0deg");
}

avatarLink.addEventListener("pointermove", updateAvatarTilt);
avatarLink.addEventListener("pointerleave", resetAvatarTilt);
avatarLink.addEventListener("blur", resetAvatarTilt);

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

function isInteractiveClickTarget(element) {
  return Boolean(element.closest("a, button, .tool-row[role='link']"));
}

document.addEventListener("click", (event) => {
  if (isInteractiveClickTarget(event.target)) {
    playClickSound();
  }
});
