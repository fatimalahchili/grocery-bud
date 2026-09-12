"use strict";

const form = document.querySelector("#grocery-form");
const input = document.querySelector("#grocery-input");
const list = document.querySelector("#grocery-list");
const status = document.querySelector("#status");
const error = document.querySelector("#input-error");
const items = [];

function render() {
  list.replaceChildren();
  items.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = "grocery-item";
    const number = document.createElement("span");
    number.className = "item-number";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1).padStart(2, "0");
    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = item.name;
    row.append(number, name);
    list.append(row);
  });
  document.querySelector("#item-count").textContent = items.length;
  document.querySelector("#empty-state").hidden = items.length > 0;
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
  items.push({ id: crypto.randomUUID(), name });
  render();
  status.textContent = `${name} added to your list.`;
  form.reset();
  input.focus();
});

render();
