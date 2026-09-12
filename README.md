# Grocery Bud

A responsive grocery list built with semantic HTML, CSS, and vanilla JavaScript. No frameworks, build step, external assets, or runtime dependencies.

## Features

- Add grocery items with Enter or the Add item button.
- Edit an item, save changes, or cancel with the Cancel edit button or Escape.
- Delete individual items and clear the entire list through a confirmation dialog.
- Automatically restore saved items after a refresh.
- Reject empty and whitespace-only input; limit item names to 120 characters.
- Show item counts, empty states, success messages, validation errors, and storage warnings.
- Use labeled inputs, descriptive icon-button names, visible keyboard focus, live status announcements, and a native modal dialog that initially focuses the safe cancel action.
- Support narrow mobile screens and long item names.

## Run locally

Clone this repository, enter its directory, and start a static server with Python 3:

```sh
git clone https://github.com/fatimalahchili/grocery-bud.git
cd grocery-bud
python3 -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173> in a current Chrome, Firefox, Safari, or Edge browser. Stop the server with Ctrl+C. No package installation is needed. Use localhost/127.0.0.1 locally or HTTPS when hosting, because item IDs use `crypto.randomUUID()`.

Use a static server rather than opening `index.html` directly: storage behavior for `file:` URLs varies by browser. To host the app, serve `index.html`, `styles.css`, `storage.js`, and `app.js` together over HTTPS.

## How localStorage works

The key `grocery-bud:v1` contains a JSON array of `{ "id": "unique-id", "name": "Oat milk" }` objects. Every successful add, edit, delete, or clear action saves the current array. Loading the page restores it. Canceling an edit or confirmation does not write anything.

The parser validates the array and every item's ID and name, rejects duplicate IDs, trims names, and discards unrecognized properties. If saved data is malformed, the app starts with an empty list and a warning. It leaves the original stored value untouched until the next successful list change replaces it. A failed read or write is caught; the app remains usable in memory and warns that changes may not survive leaving the tab.

Data stays in this browser profile for this origin (scheme, host, and port); it is not uploaded or synchronized. Clearing browser site data removes the list. Private browsing or storage restrictions may prevent persistence. Separate tabs keep independent in-memory lists; the most recent write wins, so use one tab for editing. Item names are rendered as text, never executable HTML.

## Project files

- `index.html`: semantic page structure and clear confirmation dialog.
- `styles.css`: responsive layout and focus states.
- `app.js`: list rendering, editing, validation, and focus management.
- `storage.js`: saved-data validation and storage helpers.
- `tests/storage.test.cjs`: dependency-free tests for data validation and storage behavior.

`.gitignore` excludes local environment files, dependencies, logs, and generated test output. No secrets are required.

## Checks

With Node.js installed:

```sh
node --check app.js
node --check storage.js
node --test tests/*.test.cjs
git diff --check
```

Five automated tests cover missing data, valid data normalization, malformed JSON and invalid schemas, storage round trips including clearing, and access/quota errors.

Browser verification performed in Chrome:

- Empty and whitespace-only submissions display an error and create no item.
- Adding with Enter trims the name, clears the input, and announces success.
- Editing updates the item; Escape cancels an edit without changing it.
- Edited items and individual deletions survive a refresh.
- Clear-all opens a modal with initial focus on Keep my list; cancel preserves items.
- Confirmed clearing shows the empty state, returns focus to the input, and survives refresh.
- Desktop and 375px/320px mobile layouts display long item names and usable controls; 320px has no horizontal overflow.

The accessibility checks cover semantics and keyboard behavior; they are not a full screen-reader audit. Other browser engines were not tested.
