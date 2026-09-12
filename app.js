"use strict";

const form = document.querySelector("#grocery-form");
const input = document.querySelector("#grocery-input");
const list = document.querySelector("#grocery-list");
const status = document.querySelector("#status");
const error = document.querySelector("#input-error");
const submitButton = document.querySelector("#submit-button");
const cancelEdit = document.querySelector("#cancel-edit");
const clearButton = document.querySelector("#clear-button");
const clearDialog = document.querySelector("#clear-dialog");
let items = [];
let editingId = null;

const icons = {
  edit: '<path d="m13 5 6 6M4 20l5-1L21 7a2.1 2.1 0 0 0-6-3L3 16l-1 6Z"/>',
  delete: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
};

function actionButton(action, item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `icon-button ${action}`;
  button.dataset.action = action;
  button.dataset.id = item.id;
  const label = `${action === "edit" ? "Edit" : "Delete"} ${item.name}`;
  button.setAttribute("aria-label", label);
  button.title = label;
  // Only these fixed icon paths enter innerHTML; item names use textContent.
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[action]}</svg>`;
  return button;
}

function resetEditor() {
  editingId = null;
  form.reset();
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  document.querySelector("#input-label").textContent = "What do you need?";
  submitButton.textContent = "Add item +";
  cancelEdit.hidden = true;
}

function render() {
  list.replaceChildren();
  items.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = "grocery-item";
    row.classList.toggle("editing", item.id === editingId);
    const number = document.createElement("span");
    number.className = "item-number";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1).padStart(2, "0");
    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = item.name;
    const actions = document.createElement("div");
    actions.className = "item-actions";
    actions.append(actionButton("edit", item), actionButton("delete", item));
    row.append(number, name, actions);
    list.append(row);
  });
  document.querySelector("#item-count").textContent = items.length;
  document.querySelector("#empty-state").hidden = items.length > 0;
  clearButton.hidden = items.length === 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name || name.length > 120) {
    error.textContent = "Enter an item between 1 and 120 characters.";
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  const wasEditing = editingId !== null;
  if (wasEditing) {
    items.find((item) => item.id === editingId).name = name;
  } else {
    items.push({ id: crypto.randomUUID(), name });
  }
  resetEditor();
  render();
  status.textContent = `${name} ${wasEditing ? "updated" : "added to your list"}.`;
  input.focus();
});

input.addEventListener("input", () => {
  error.textContent = "";
  input.removeAttribute("aria-invalid");
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const index = items.findIndex((item) => item.id === button.dataset.id);
  if (index < 0) return;
  const item = items[index];
  if (button.dataset.action === "edit") {
    resetEditor();
    editingId = item.id;
    input.value = item.name;
    document.querySelector("#input-label").textContent = "Edit your item";
    submitButton.textContent = "Save changes";
    cancelEdit.hidden = false;
    render();
    status.textContent = `Editing ${item.name}.`;
    input.focus();
    input.select();
  } else {
    items.splice(index, 1);
    if (editingId === item.id) resetEditor();
    render();
    status.textContent = `${item.name} deleted.`;
    // Keep keyboard focus close to the deleted row.
    const nextRow = list.children[Math.min(index, items.length - 1)];
    (nextRow?.querySelector(".delete") || input).focus();
  }
});

function stopEditing() {
  resetEditor();
  render();
  status.textContent = "Edit canceled. Your item is unchanged.";
  input.focus();
}

cancelEdit.addEventListener("click", stopEditing);
input.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && editingId !== null) stopEditing();
});

clearButton.addEventListener("click", () => {
  clearDialog.returnValue = "cancel";
  clearDialog.showModal();
});
clearDialog.addEventListener("close", () => {
  if (clearDialog.returnValue !== "clear") return;
  items = [];
  resetEditor();
  render();
  status.textContent = "All items cleared. Ready for a fresh list.";
  input.focus();
});

render();
