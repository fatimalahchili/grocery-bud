const { test } = require("node:test");
const assert = require("node:assert/strict");
const { STORAGE_KEY, parseSavedItems, loadItems, saveItems } = require("../storage.js");

test("missing data restores an empty list", () => {
  assert.deepEqual(parseSavedItems(null), []);
});

test("valid saved items restore trimmed names and ignore extra properties", () => {
  assert.deepEqual(parseSavedItems('[{"id":"a","name":"  Milk  ","extra":true}]'), [
    { id: "a", name: "Milk" },
  ]);
});

test("malformed JSON and invalid schemas are rejected", () => {
  const invalid = ["{", "null", "{}", "42", '[null]', '["Milk"]',
    '[{"id":"a","name":" "}]', '[{"id":1,"name":"Milk"}]',
    '[{"id":" ","name":"Milk"}]', '[{"id":"a","name":7}]',
    JSON.stringify([{ id: "a", name: "x".repeat(121) }]),
    '[{"id":"a","name":"Milk"},{"id":"a","name":"Bread"}]'];
  for (const raw of invalid) assert.throws(() => parseSavedItems(raw), undefined, raw);
});

test("storage round trip includes updates and an empty list", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value) };
  const items = [{ id: "a", name: "Oat milk" }];
  saveItems(storage, items);
  assert.equal(values.has(STORAGE_KEY), true);
  assert.deepEqual(loadItems(storage), items);
  saveItems(storage, []);
  assert.deepEqual(loadItems(storage), []);
});

test("storage access and quota errors propagate for the interface to handle", () => {
  const storage = { getItem() { throw new Error("Access denied"); },
    setItem() { throw new Error("Quota exceeded"); } };
  assert.throws(() => loadItems(storage), /Access denied/);
  assert.throws(() => saveItems(storage, []), /Quota exceeded/);
});
