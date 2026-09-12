"use strict";

// A versioned key keeps future data formats separate from this one.
const STORAGE_KEY = "grocery-bud:v1";

function parseSavedItems(raw) {
  if (raw === null) return [];
  const saved = JSON.parse(raw);
  const ids = new Set();
  if (!Array.isArray(saved)) throw new Error("Expected a list.");
  return saved.map((item) => {
    if (
      !item || typeof item !== "object" ||
      typeof item.id !== "string" || !item.id.trim() || ids.has(item.id) ||
      typeof item.name !== "string" || !item.name.trim() || item.name.trim().length > 120
    ) {
      throw new Error("Invalid grocery item.");
    }
    ids.add(item.id);
    return { id: item.id, name: item.name.trim() };
  });
}

function loadItems(storage) {
  return parseSavedItems(storage.getItem(STORAGE_KEY));
}

function saveItems(storage, items) {
  storage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Expose the parser to Node's built-in test runner without a build step.
if (typeof module !== "undefined") {
  module.exports = { STORAGE_KEY, parseSavedItems, loadItems, saveItems };
}
