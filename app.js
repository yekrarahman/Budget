const STORAGE_KEY = "budget-pocket-entries";

const entryForm = document.getElementById("entryForm");
const entryIdField = document.getElementById("entryId");
const typeField = document.getElementById("type");
const amountField = document.getElementById("amount");
const categoryField = document.getElementById("category");
const dateField = document.getElementById("date");
const noteField = document.getElementById("note");
const resetButton = document.getElementById("resetButton");
const entryList = document.getElementById("entryList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const entryTemplate = document.getElementById("entryTemplate");
const downloadCsvBtn = document.getElementById("downloadCsv");
const uploadCsvInput = document.getElementById("uploadCsv");
const installHint = document.getElementById("installHint");

let entries = loadEntries();

if (!dateField.value) {
  dateField.value = new Date().toISOString().slice(0, 10);
}

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    id: entryIdField.value || crypto.randomUUID(),
    type: typeField.value,
    amount: Number(amountField.value),
    category: categoryField.value.trim(),
    date: dateField.value,
    note: noteField.value.trim(),
  };

  if (!payload.category || !payload.date || Number.isNaN(payload.amount) || payload.amount <= 0) {
    return;
  }

  const existingIndex = entries.findIndex((entry) => entry.id === payload.id);

  if (existingIndex >= 0) {
    entries[existingIndex] = payload;
  } else {
    entries.unshift(payload);
  }

  persistAndRender();
  clearForm();
});

resetButton.addEventListener("click", clearForm);

downloadCsvBtn.addEventListener("click", () => {
  if (entries.length === 0) {
    return;
  }

  const rows = ["id,type,amount,category,date,note"];

  entries.forEach((entry) => {
    const safeNote = entry.note.replaceAll('"', '""');
    const safeCategory = entry.category.replaceAll('"', '""');
    rows.push(
      [entry.id, entry.type, entry.amount, `"${safeCategory}"`, entry.date, `"${safeNote}"`].join(",")
    );
  });

  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `budget-entries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

uploadCsvInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const content = await file.text();
  const lines = content.split(/\r?\n/).filter(Boolean);

  if (lines.length < 2) {
    return;
  }

  const imported = [];

  for (let index = 1; index < lines.length; index += 1) {
    const [id, type, amount, category, date, note] = parseCsvLine(lines[index]);
    const parsedAmount = Number(amount);

    if (!id || !date || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      continue;
    }

    imported.push({
      id,
      type: type === "income" ? "income" : "expense",
      amount: parsedAmount,
      category: cleanCsvField(category),
      date,
      note: cleanCsvField(note),
    });
  }

  if (imported.length > 0) {
    entries = imported;
    persistAndRender();
    clearForm();
  }

  uploadCsvInput.value = "";
});

function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

function cleanCsvField(value = "") {
  return value.trim().replace(/^"|"$/g, "");
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  render();
}

function render() {
  entryList.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No entries yet. Add your first item above.";
    entryList.append(empty);
  } else {
    entries
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((entry) => {
        const row = entryTemplate.content.firstElementChild.cloneNode(true);
        row.querySelector(".entry-main").textContent = `${entry.category} • ${entry.type === "income" ? "+" : "-"}$${entry.amount.toFixed(2)}`;
        row.querySelector(".entry-meta").textContent = `${entry.date}${entry.note ? ` • ${entry.note}` : ""}`;

        row.querySelector(".edit-btn").addEventListener("click", () => fillForm(entry));
        row.querySelector(".delete-btn").addEventListener("click", () => {
          entries = entries.filter((item) => item.id !== entry.id);
          persistAndRender();
        });

        entryList.append(row);
      });
  }

  const totals = entries.reduce(
    (acc, entry) => {
      if (entry.type === "income") {
        acc.income += entry.amount;
      } else {
        acc.expense += entry.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  totalIncomeEl.textContent = formatCurrency(totals.income);
  totalExpenseEl.textContent = formatCurrency(totals.expense);
  balanceEl.textContent = formatCurrency(totals.income - totals.expense);
}

function clearForm() {
  entryForm.reset();
  entryIdField.value = "";
  dateField.value = new Date().toISOString().slice(0, 10);
  typeField.value = "expense";
}

function fillForm(entry) {
  entryIdField.value = entry.id;
  typeField.value = entry.type;
  amountField.value = entry.amount;
  categoryField.value = entry.category;
  dateField.value = entry.date;
  noteField.value = entry.note;
  amountField.focus();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  if (installHint) {
    installHint.textContent = "Install available: use browser menu and choose Install App / Add to Home Screen.";
  }
});
