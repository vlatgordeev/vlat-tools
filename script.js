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
const canUseHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const touchPressDelay = 120;
const touchMoveThreshold = 8;
let activeTouchPress = null;

function randomHoverColor() {
  return hoverColors[Math.floor(Math.random() * hoverColors.length)];
}

function clearRowColor(row) {
  row.classList.remove("is-hovered", "is-pressed");
}

function clearAllRowColors() {
  toolRows.forEach(clearRowColor);
}

function cancelTouchPress() {
  if (!activeTouchPress) {
    return;
  }

  window.clearTimeout(activeTouchPress.timer);
  clearRowColor(activeTouchPress.row);
  activeTouchPress = null;
}

toolRows.forEach((row) => {
  row.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse" || !canUseHover.matches) {
      clearRowColor(row);
      return;
    }

    row.style.setProperty("--hover-color", randomHoverColor());
    row.classList.add("is-hovered");
  });

  row.addEventListener("pointerleave", () => {
    clearRowColor(row);
  });

  row.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") {
      return;
    }

    cancelTouchPress();
    activeTouchPress = {
      row,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      timer: window.setTimeout(() => {
        if (!activeTouchPress || activeTouchPress.row !== row) {
          return;
        }

        row.style.setProperty("--hover-color", randomHoverColor());
        row.classList.add("is-pressed");
      }, touchPressDelay),
    };
  });

  row.addEventListener("pointermove", (event) => {
    if (!activeTouchPress || activeTouchPress.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = Math.abs(event.clientX - activeTouchPress.startX);
    const deltaY = Math.abs(event.clientY - activeTouchPress.startY);

    if (deltaX > touchMoveThreshold || deltaY > touchMoveThreshold) {
      cancelTouchPress();
    }
  });

  row.addEventListener("pointerup", cancelTouchPress);

  row.addEventListener("pointerout", (event) => {
    if (event.pointerType !== "mouse") {
      cancelTouchPress();
    }
  });

  row.addEventListener("pointercancel", () => {
    cancelTouchPress();
  });

  row.addEventListener("touchend", () => {
    cancelTouchPress();
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

window.addEventListener("scroll", cancelTouchPress, { passive: true });
window.addEventListener("blur", clearAllRowColors);

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
  if (canUseHover.matches && isInteractiveClickTarget(event.target)) {
    playClickSound();
  }
});
