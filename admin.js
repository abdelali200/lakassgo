/* ================= lakassGo Admin — Application ================= */
"use strict";

/* ---------- Helpers ---------- */
const el = (id) => document.getElementById(id);
const $ = (sel, root = document) => root.querySelector(sel);
const money = (n) => "$ " + n.toFixed(2);

function table(headers, rowsHtml) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;
}
function pill(text, color) {
  return `<span class="pill pill-${color}">${text}</span>`;
}
const headBlock = (title, sub) => `
  <div class="view-head"><div><h1>${title}</h1><p>${sub}</p></div></div>`;

/* ---------- Auth ---------- */
const ADMIN_USER = "admin";
const ADMIN_PASS = "LkG-2025-Admin!";
const session = {
  get() { try { return sessionStorage.getItem("lkg_admin_session"); } catch { return null; } },
  set() { try { sessionStorage.setItem("lkg_admin_session", "1"); } catch { /* ignore */ } },
  clear() { try { sessionStorage.removeItem("lkg_admin_session"); } catch { /* ignore */ } },
};

function showLogin() {
  el("loginForm").hidden = false;
  el("app").hidden = true;
  document.body.classList.add("login-page");
}
function showApp() {
  el("loginForm").hidden = true;
  el("app").hidden = false;
  document.body.classList.remove("login-page");
  switchView("dashboard");
}
function initAuth() {
  if (session.get() === "1") showApp();
  el("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const u = el("loginUser").value.trim();
    const p = el("loginPass").value;
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      el("loginError").hidden = true;
      el("loginPass").value = "";
      session.set();
      showApp();
    } else {
      el("loginError").hidden = false;
    }
  });
  el("signOutBtn").addEventListener("click", () => {
    session.clear();
    el("loginUser").value = "";
    showLogin();
  });
}

/* ---------- Navigation ---------- */
const RENDERED = new Set();
function switchView(name) {
  document.querySelectorAll(".side-item").forEach((b) => {
    const active = b.dataset.view === name;
    b.classList.toggle("active", active);
    b.setAttribute("aria-current", active ? "page" : "false");
  });
  document.querySelectorAll(".view").forEach((v) => {
    v.hidden = v.id !== "view-" + name;
  });
  if (!RENDERED.has(name)) {
    RENDERED.add(name);
    renderView(name);
  }
  el("sidebar").classList.remove("open");
}
function initNav() {
  document.querySelectorAll(".side-item").forEach((btn) =>
    btn.addEventListener("click", () => switchView(btn.dataset.view))
  );
  el("menuBtn").addEventListener("click", () => el("sidebar").classList.toggle("open"));
}

/* ---------- Demo data ---------- */
const ORDERS = [
  { id: "#LKG-1042", customer: "Yassine B.", date: "Nov 25, 2026", total: 34.9, status: "pending" },
  { id: "#LKG-1041", customer: "Salma E.", date: "Nov 25, 2026", total: 78.4, status: "processing" },
  { id: "#LKG-1040", customer: "Omar T.", date: "Nov 24, 2026", total: 19.9, status: "shipped" },
  { id: "#LKG-1039", customer: "Nadia K.", date: "Nov 24, 2026", total: 112.0, status: "delivered" },
  { id: "#LKG-1038", customer: "Hamza R.", date: "Nov 23, 2026", total: 29.9, status: "delivered" },
  { id: "#LKG-1037", customer: "Ilham M.", date: "Nov 23, 2026", total: 45.5, status: "shipped" },
  { id: "#LKG-1036", customer: "Karim A.", date: "Nov 22, 2026", total: 44.9, status: "cancelled" },
  { id: "#LKG-1035", customer: "Sofia L.", date: "Nov 22, 2026", total: 61.2, status: "delivered" },
  { id: "#LKG-1034", customer: "Bilal Z.", date: "Nov 21, 2026", total: 17.9, status: "delivered" },
  { id: "#LKG-1033", customer: "Rim D.", date: "Nov 21, 2026", total: 96.0, status: "processing" },
];
const STATUS_PILLS = {
  pending: ["pending", "amber"],
  processing: ["processing", "blue"],
  shipped: ["shipped", "blue"],
  delivered: ["delivered", "green"],
  cancelled: ["cancelled", "red"],
};
const SHIPMENTS = [
  { id: "TRK-77012", order: "#LKG-1041", carrier: "Amana Express", city: "Casablanca", status: "in transit" },
  { id: "TRK-77009", order: "#LKG-1040", carrier: "CTM Messagerie", city: "Rabat", status: "in transit" },
  { id: "TRK-77005", order: "#LKG-1039", carrier: "Amana Express", city: "Marrakech", status: "delivered" },
  { id: "TRK-77001", order: "#LKG-1038", carrier: "DHL", city: "Tangier", status: "delivered" },
  { id: "TRK-76996", order: "#LKG-1037", carrier: "Amana Express", city: "Fes", status: "delayed" },
];
const STATUS_STYLES = { "in transit": "blue", delivered: "green", delayed: "red" };
const CHATS = [
  { name: "Yassine B.", topic: "Does this pads set fit a Clio 4?", time: "2 min ago", unread: true },
  { name: "Salma E.", topic: "Can I return the mirror if it doesn't match?", time: "18 min ago", unread: true },
  { name: "Omar T.", topic: "Delivery time to Tangier?", time: "1 h ago", unread: true },
  { name: "Nadia K.", topic: "Invoice request for #LKG-1039", time: "3 h ago", unread: false },
  { name: "Hamza R.", topic: "Thanks, part received — great quality!", time: "Yesterday", unread: false },
];
const PRODUCT_SEEDS = [
  { name: "Ceramic Brake Pads — Front Set", cat: "brakes", price: 34.9, stock: 42, icon: "🛞" },
  { name: "Vented Brake Discs — Pair", cat: "brakes", price: 58.0, stock: 18, icon: "💿" },
  { name: "Oil Filter (Universal Fit)", cat: "engine", price: 7.9, stock: 96, icon: "🛢️" },
  { name: "Air Filter — High Flow", cat: "engine", price: 12.5, stock: 54, icon: "🌬️" },
  { name: "12V 60Ah Battery", cat: "electric", price: 89.0, stock: 9, icon: "🔋" },
  { name: "Headlight Bulb H7 — Pair", cat: "electric", price: 11.9, stock: 120, icon: "💡" },
  { name: "Shock Absorber — Front", cat: "suspension", price: 46.0, stock: 6, icon: "🔩" },
  { name: "Wiper Blades Set 24\"/18\"", cat: "body", price: 15.9, stock: 33, icon: "🌧️" },
];
function loadProducts() {
  try {
    const raw = localStorage.getItem("lkg_admin_products");
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length >= 0) return arr;
    }
  } catch { /* ignore */ }
  return PRODUCT_SEEDS.map((p) => ({ ...p }));
}
function saveProducts() {
  try { localStorage.setItem("lkg_admin_products", JSON.stringify(PRODUCTS)); } catch { /* ignore */ }
}
let PRODUCTS = loadProducts();
function refreshProductViews() {
  ["inventory", "catalogue", "gshopping"].forEach((v) => RENDERED.delete(v));
  renderView("products");
}
const FEED_PLATFORMS = [
  { name: "Google Shopping", items: 14, status: "active", last: "Today 03:00" },
  { name: "Facebook Catalog", items: 14, status: "active", last: "Today 03:00" },
  { name: "Instagram Shop", items: 14, status: "active", last: "Yesterday 23:40" },
  { name: "Avito Pro (export)", items: 8, status: "paused", last: "Nov 20 12:00" },
];

/* ---------- Dashboard ---------- */
const DATA_RANGES = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  base: [96, 124, 141, 118, 152, 189, 135],
};
function renderDashboard() {
  el("barChart").innerHTML = DATA_RANGES.base
    .map((v, i) => `
      <div class="bar-col">
        <div class="bar-tip">${v} sessions</div>
        <div class="bar" style="height:${(v / 200) * 100}%"></div>
        <span class="bar-label">${DATA_RANGES.labels[i]}</span>
      </div>`)
    .join("");
}

/* ---------- Orders ---------- */
function renderOrders(root) {
  root.innerHTML = headBlock("Orders", "Recent customer orders") + `
    <div class="card">
      <div class="card-head"><div><h2>All orders</h2><p class="card-sub">${ORDERS.length} orders</p></div>
      <button class="btn btn-primary" id="newOrderBtn">＋ New order</button></div>
      ${table(
        ["Order", "Customer", "Date", "Total", "Status", "Actions"],
        ORDERS.map((o) => {
          const p = STATUS_PILLS[o.status];
          return `
            <tr>
              <td class="mono cell-strong">${o.id}</td>
              <td class="cell-strong">${o.customer}</td>
              <td class="cell-muted">${o.date}</td>
              <td class="mono cell-strong">${money(o.total)}</td>
              <td>${pill(p[0], p[1])}</td>
              <td><button class="btn btn-ghost" data-act="view">View</button> <button class="btn btn-ghost" data-act="invoice">Invoice</button></td>
            </tr>`;
        }).join("")
      )}
    </div>`;
  el("newOrderBtn").addEventListener("click", () => showToast("New order form (demo)"));
  root.querySelectorAll("[data-act]").forEach((b) =>
    b.addEventListener("click", () =>
      showToast(b.dataset.act === "view" ? "Order details (demo)" : "Invoice (demo)"))
  );
}

/* ---------- Delivery ---------- */
function renderDelivery(root) {
  root.innerHTML = headBlock("Delivery", "Shipments and couriers") + `
    <div class="card">
      <div class="card-head"><div><h2>Active shipments</h2><p class="card-sub">Live tracking</p></div></div>
      ${table(
        ["Tracking", "Order", "Carrier", "City", "Status"],
        SHIPMENTS.map((s) => `
          <tr>
            <td class="mono cell-strong">${s.id}</td>
            <td class="mono cell-muted">${s.order}</td>
            <td class="cell-strong">${s.carrier}</td>
            <td class="cell-muted">${s.city}</td>
            <td>${pill(s.status, STATUS_STYLES[s.status])}</td>
          </tr>`).join("")
      )}
    </div>`;
}

/* ---------- Chat ---------- */
function renderChat(root) {
  root.innerHTML = headBlock("Chat", "Customer messages") + `
    <div class="card">
      <div class="card-head"><div><h2>Inbox</h2><p class="card-sub">${CHATS.filter((c) => c.unread).length} unread</p></div></div>
      ${table(
        ["Customer", "Message", "Received", ""],
        CHATS.map((c) => `
          <tr>
            <td class="cell-strong">${c.unread ? "🔵 " : ""}${c.name}</td>
            <td class="cell-muted">${c.topic}</td>
            <td class="cell-muted">${c.time}</td>
            <td><button class="btn btn-ghost" data-act="reply">Reply</button></td>
          </tr>`).join("")
      )}
    </div>`;
  root.querySelectorAll("[data-act]").forEach((b) =>
    b.addEventListener("click", () => showToast("Chat opened (demo)"))
  );
}

/* ---------- Products ---------- */
let editingIndex = null;
function renderProducts(root) {
  root.innerHTML = headBlock("Products", "Catalog you sell") + `
    <div class="card">
      <div class="card-head"><div><h2>All products</h2><p class="card-sub">${PRODUCTS.length} items</p></div>
      <button class="btn btn-primary" id="newProductBtn">＋ Add product</button></div>
      ${table(
        ["Product", "Category", "Price", "Stock", "State", "Actions"],
        PRODUCTS.map((p, i) => {
          const low = p.stock < 10;
          return `
            <tr>
              <td class="cell-strong"><span class="row-art">${p.icon || "📦"}</span>${p.name}</td>
              <td class="cell-muted">${p.cat}</td>
              <td class="mono cell-strong">${money(p.price)}</td>
              <td class="mono">${p.stock}</td>
              <td>${pill(low ? "low stock" : "healthy", low ? "red" : "green")}</td>
              <td><button class="btn btn-ghost" data-edit="${i}">Edit</button> <button class="btn btn-ghost" data-del="${i}">Delete</button></td>
            </tr>`;
        }).join("")
      )}
    </div>`;
  el("newProductBtn").addEventListener("click", () => openProductModal(null));
  root.querySelectorAll("[data-edit]").forEach((b) =>
    b.addEventListener("click", () => openProductModal(Number(b.dataset.edit)))
  );
  root.querySelectorAll("[data-del]").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.armed) {
        PRODUCTS.splice(Number(b.dataset.del), 1);
        saveProducts();
        showToast("Product deleted");
        refreshProductViews();
      } else {
        b.dataset.armed = "1";
        b.textContent = "Confirm?";
        setTimeout(() => {
          if (b.isConnected) { delete b.dataset.armed; b.textContent = "Delete"; }
        }, 3000);
      }
    })
  );
}

function openProductModal(index) {
  editingIndex = index;
  let modal = el("productModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "productModal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="pmTitle">
        <div class="modal-head">
          <h2 id="pmTitle">Add product</h2>
          <button class="modal-close" id="pmClose" aria-label="Close">✕</button>
        </div>
        <form id="pmForm" novalidate>
          <div class="form-grid">
            <label class="form-field form-span">Name
              <input type="text" id="pmName" placeholder="e.g. Ceramic Brake Pads — Front Set" />
            </label>
            <label class="form-field">Category
              <select id="pmCat">
                <option value="brakes">Brakes</option>
                <option value="engine">Engine</option>
                <option value="electric">Electric</option>
                <option value="suspension">Suspension</option>
                <option value="body">Body</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label class="form-field">Icon (emoji)
              <input type="text" id="pmIcon" maxlength="4" placeholder="📦" />
            </label>
            <label class="form-field">Price ($)
              <input type="number" id="pmPrice" min="0" step="0.01" />
            </label>
            <label class="form-field">Stock
              <input type="number" id="pmStock" min="0" step="1" />
            </label>
          </div>
          <p class="form-error" id="pmError" hidden></p>
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" id="pmCancel">Cancel</button>
            <button type="submit" class="btn btn-primary" id="pmSave">Save product</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(modal);
    const closeModal = () => (modal.hidden = true);
    el("pmClose").addEventListener("click", closeModal);
    el("pmCancel").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
    el("pmForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = el("pmName").value.trim();
      const price = Number(el("pmPrice").value);
      const stock = Number(el("pmStock").value);
      const fail = (msg) => { el("pmError").textContent = msg; el("pmError").hidden = false; };
      if (!name) return fail("Product name is required.");
      if (!Number.isFinite(price) || price < 0) return fail("Enter a valid price (0 or more).");
      if (!Number.isInteger(stock) || stock < 0) return fail("Enter a valid stock number (0 or more).");
      const data = {
        name,
        cat: el("pmCat").value,
        price: Math.round(price * 100) / 100,
        stock,
        icon: el("pmIcon").value.trim() || "📦",
      };
      if (editingIndex === null) {
        PRODUCTS.push(data);
        showToast("Product added");
      } else {
        Object.assign(PRODUCTS[editingIndex], data);
        showToast("Product updated");
      }
      saveProducts();
      modal.hidden = true;
      refreshProductViews();
    });
  } else {
    el("pmError").hidden = true;
  }
  el("pmTitle").textContent = index === null ? "Add product" : "Edit product";
  if (index === null) {
    el("pmName").value = "";
    el("pmCat").value = "brakes";
    el("pmIcon").value = "";
    el("pmPrice").value = "";
    el("pmStock").value = "";
  } else {
    const p = PRODUCTS[index];
    el("pmName").value = p.name;
    el("pmCat").value = ["brakes", "engine", "electric", "suspension", "body"].includes(p.cat) ? p.cat : "other";
    el("pmIcon").value = p.icon || "";
    el("pmPrice").value = p.price;
    el("pmStock").value = p.stock;
  }
  modal.hidden = false;
  el("pmName").focus();
}

/* ---------- Inventory ---------- */
function renderInventory(root) {
  root.innerHTML = headBlock("Inventory", "Stock levels") + `
    <div class="card">
      <div class="card-head"><div><h2>Stock levels</h2><p class="card-sub">Low stock highlights &lt; 10 units</p></div></div>
      ${table(
        ["Product", "Stock", "Level", "State"],
        PRODUCTS.map((p) => {
          const pct = Math.min(100, p.stock * 3);
          const low = p.stock < 10;
          return `
            <tr>
              <td class="cell-strong">${p.name}</td>
              <td class="mono">${p.stock}</td>
              <td><div class="progress"><span style="width:${pct}%"></span></div></td>
              <td>${pill(low ? "low stock" : "healthy", low ? "red" : "green")}</td>
            </tr>`;
        }).join("")
      )}
    </div>`;
}

/* ---------- Catalogue / Slider / Reporting / Marketing ---------- */
function renderCatalogue(root) {
  root.innerHTML = headBlock("Catalogue", "Storefront product display") + `
    <div class="card">
      <div class="card-head"><div><h2>Catalogue status</h2><p class="card-sub">Products visible on the storefront</p></div>
      <button class="btn btn-ghost">↻ Rebuild catalogue</button></div>
      ${table(
        ["Category", "Products", "Visibility"],
        `
          <tr><td class="cell-strong">Brakes</td><td class="mono">2</td><td>${pill("visible", "green")}</td></tr>
          <tr><td class="cell-strong">Engine</td><td class="mono">2</td><td>${pill("visible", "green")}</td></tr>
          <tr><td class="cell-strong">Electric</td><td class="mono">2</td><td>${pill("visible", "green")}</td></tr>
          <tr><td class="cell-strong">Suspension</td><td class="mono">1</td><td>${pill("visible", "green")}</td></tr>
          <tr><td class="cell-strong">Body</td><td class="mono">1</td><td>${pill("visible", "green")}</td></tr>
        `
      )}
    </div>`;
}
