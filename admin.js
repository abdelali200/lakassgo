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
  try {
    localStorage.setItem("lkg_admin_products", JSON.stringify(PRODUCTS));
    return true;
  } catch {
    showToast("Storage full — remove some photos");
    return false;
  }
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
              <td class="cell-strong"><span class="row-art">${(p.photos && p.photos.length) ? `<img class="row-thumb" src="${p.photos[0]}" alt="" />` : (p.icon || "📦")}</span>${p.name}</td>
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

let modalPhotos = [];
function paintPmGallery() {
  const g = el("pmGallery");
  if (!g) return;
  g.innerHTML = modalPhotos.length
    ? modalPhotos.map((src, i) => `
        <div class="pm-thumb"><img src="${src}" alt="" /><button type="button" data-rm="${i}" aria-label="Remove photo">✕</button></div>`).join("")
    : `<span class="pm-empty">No photos yet — add some below</span>`;
}
function fileToPhotoDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      let settled = false;
      const fallback = () => {
        if (!settled) { settled = true; resolve(dataUrl); }
      };
      img.onload = () => {
        if (settled) return;
        settled = true;
        try {
          const max = 480;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("no canvas");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = fallback;
      setTimeout(fallback, 1200);
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}
function openProductModal(index) {
  editingIndex = index;
  modalPhotos = index === null ? [] : [...(PRODUCTS[index].photos || [])];
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
            <label class="form-field">Price ($)
              <input type="number" id="pmPrice" min="0" step="0.01" />
            </label>
            <label class="form-field">Stock
              <input type="number" id="pmStock" min="0" step="1" />
            </label>
            <div class="form-field form-span">Photos
              <div class="pm-gallery" id="pmGallery"></div>
              <div class="pm-add-row">
                <label class="btn btn-ghost pm-upload">📷 Add photos
                  <input type="file" id="pmFiles" accept="image/*" multiple hidden />
                </label>
                <input type="url" id="pmUrl" placeholder="…or paste an image URL" />
                <button type="button" class="btn btn-ghost" id="pmUrlAdd">Add URL</button>
              </div>
            </div>
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
    el("pmFiles").addEventListener("change", async (e) => {
      const files = [...e.target.files];
      e.target.value = "";
      for (const f of files) {
        if (f.size > 5 * 1024 * 1024) { showToast("Too large (max 5 MB): " + (f.name || "file")); continue; }
        try {
          modalPhotos.push(await fileToPhotoDataUrl(f));
        } catch {
          showToast("Could not read " + (f.name || "file"));
        }
      }
      paintPmGallery();
    });
    el("pmUrlAdd").addEventListener("click", () => {
      const url = el("pmUrl").value.trim();
      if (!/^(https?:\/\/|data:image\/)/.test(url)) {
        el("pmError").textContent = "Enter a valid image URL (https://…).";
        el("pmError").hidden = false;
        return;
      }
      modalPhotos.push(url);
      el("pmUrl").value = "";
      el("pmError").hidden = true;
      paintPmGallery();
    });
    el("pmGallery").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-rm]");
      if (!btn) return;
      modalPhotos.splice(Number(btn.dataset.rm), 1);
      paintPmGallery();
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
        photos: [...modalPhotos],
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
    el("pmPrice").value = "";
    el("pmStock").value = "";
  } else {
    const p = PRODUCTS[index];
    el("pmName").value = p.name;
    el("pmCat").value = ["brakes", "engine", "electric", "suspension", "body"].includes(p.cat) ? p.cat : "other";
    el("pmPrice").value = p.price;
    el("pmStock").value = p.stock;
  }
  paintPmGallery();
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

function renderSlider(root) {
  root.innerHTML = headBlock("Slider", "Homepage hero banners") + `
    <div class="card">
      <div class="card-head"><div><h2>Homepage slider</h2><p class="card-sub">Hero banner slides</p></div>
      <button class="btn btn-primary" id="newSlideBtn">＋ Add slide</button></div>
      ${table(
        ["Slide", "Title", "Order", "Visible", "Actions"],
        `
          <tr><td class="cell-strong">Slide 1</td><td class="cell-muted">Genuine parts, delivered fast</td><td class="mono">1</td><td>${pill("active", "green")}</td><td><button class="btn btn-ghost" data-act="edit">Edit</button></td></tr>
          <tr><td class="cell-strong">Slide 2</td><td class="cell-muted">Brakes &amp; suspension up to -40%</td><td class="mono">2</td><td>${pill("active", "green")}</td><td><button class="btn btn-ghost" data-act="edit">Edit</button></td></tr>
          <tr><td class="cell-strong">Slide 3</td><td class="cell-muted">New: batteries in stock</td><td class="mono">3</td><td>${pill("hidden", "gray")}</td><td><button class="btn btn-ghost" data-act="edit">Edit</button></td></tr>
        `
      )}
    </div>`;
  el("newSlideBtn").addEventListener("click", () => showToast("Slide editor (demo)"));
  root.querySelectorAll("[data-act]").forEach((b) =>
    b.addEventListener("click", () => showToast("Edit slide (demo)"))
  );
}

function renderReporting(root) {
  root.innerHTML = headBlock("Reporting", "Sales reports") + `
    <div class="stat-grid">
      <div class="card stat-card stat-green"><div class="stat-label">Orders (30d)</div><div class="stat-value">118</div><div class="stat-delta up">↑ 9.2%</div><div class="stat-note">vs 108 previous</div></div>
      <div class="card stat-card stat-blue"><div class="stat-label">Items sold</div><div class="stat-value">246</div><div class="stat-delta up">↑ 11.7%</div><div class="stat-note">2.1 per order</div></div>
      <div class="card stat-card stat-dark"><div class="stat-label">Avg order</div><div class="stat-value">$ 29.74</div><div class="stat-delta down">↓ 1.8%</div><div class="stat-note">per checkout</div></div>
      <div class="card stat-card stat-red"><div class="stat-label">Refunds</div><div class="stat-value">3</div><div class="stat-note">2.5% of orders</div></div>
    </div>
    <div class="card">
      <div class="card-head"><div><h2>Sales by category</h2><p class="card-sub">Last 30 days</p></div></div>
      ${table(
        ["Category", "Orders", "Revenue"],
        `
          <tr><td class="cell-strong">Brakes</td><td class="mono">51</td><td class="mono cell-strong">$ 1,690</td></tr>
          <tr><td class="cell-strong">Electric</td><td class="mono">38</td><td class="mono cell-strong">$ 1,204</td></tr>
          <tr><td class="cell-strong">Engine</td><td class="mono">22</td><td class="mono cell-strong">$ 486</td></tr>
        `
      )}
    </div>`;
}

function renderMarketing(root) {
  root.innerHTML = headBlock("Marketing", "Promo codes and campaigns") + `
    <div class="card">
      <div class="card-head"><div><h2>Promo codes</h2><p class="card-sub">Applied at storefront checkout</p></div>
      <button class="btn btn-primary" id="newCodeBtn">＋ New code</button></div>
      ${table(
        ["Code", "Discount", "Scope", "Used", "State"],
        `
          <tr><td class="cell-strong mono">WELCOME10</td><td class="cell-strong">-10%</td><td class="cell-muted">all products</td><td class="mono">23</td><td>${pill("active", "green")}</td></tr>
          <tr><td class="cell-strong mono">BRAKE15</td><td class="cell-strong">-15%</td><td class="cell-muted">brakes category</td><td class="mono">8</td><td>${pill("active", "green")}</td></tr>
          <tr><td class="cell-strong mono">SUMMER25</td><td class="cell-strong">-25%</td><td class="cell-muted">all products</td><td class="mono">0</td><td>${pill("scheduled", "amber")}</td></tr>
          <tr><td class="cell-strong mono">OLD5</td><td class="cell-strong">-5%</td><td class="cell-muted">all products</td><td class="mono">41</td><td>${pill("expired", "gray")}</td></tr>
        `
      )}
    </div>`;
  el("newCodeBtn").addEventListener("click", () => showToast("Promo code editor (demo)"));
}

/* ---------- Channels / Google Shopping ---------- */
function renderChannels(root) {
  root.innerHTML = headBlock("Channels", "Sales channels") + `
    <div class="card">
      <div class="card-head"><div><h2>Connected channels</h2><p class="card-sub">Where your catalog is sold</p></div></div>
      ${table(
        ["Channel", "State", "Products", "Notes"],
        `
          <tr><td class="cell-strong">🌐 lakassGo storefront</td><td>${pill("connected", "green")}</td><td class="mono">14</td><td class="cell-muted">primary</td></tr>
          <tr><td class="cell-strong">facebook.com</td><td>${pill("connected", "green")}</td><td class="mono">14</td><td class="cell-muted">via catalog feed</td></tr>
          <tr><td class="cell-strong">instagram.com</td><td>${pill("connected", "green")}</td><td class="mono">14</td><td class="cell-muted">shop tab</td></tr>
          <tr><td class="cell-strong">Google Shopping</td><td>${pill("connected", "green")}</td><td class="mono">14</td><td class="cell-muted">merchant center</td></tr>
        `
      )}
    </div>`;
}

function renderGshopping(root) {
  root.innerHTML = headBlock("Google Shopping", "Product feed & Merchant Center") + `
    <div class="card">
      <div class="card-head"><div><h2>Merchant Center sync</h2><p class="card-sub">Feed lakassgo.com/data/products.xml</p></div>
      <button class="btn btn-ghost">↻ Sync now</button></div>
      ${table(
        ["Product", "ID", "Price", "Approval"],
        PRODUCTS.slice(0, 5).map((p, i) => `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td class="mono cell-muted">LKG-${100 + i}</td>
            <td class="mono cell-strong">${money(p.price)}</td>
            <td>${pill(p.stock ? "approved" : "disapproved — no stock", p.stock ? "green" : "red")}</td>
          </tr>`).join("")
      )}
    </div>
    <div class="stat-grid">
      <div class="card stat-card stat-green"><div class="stat-label">Approved items</div><div class="stat-value">13</div><div class="stat-note">of 14 submitted</div></div>
      <div class="card stat-card stat-blue"><div class="stat-label">Impressions (7d)</div><div class="stat-value">24,318</div><div class="stat-delta up">↑ 31%</div></div>
      <div class="card stat-card stat-dark"><div class="stat-label">Clicks (7d)</div><div class="stat-value">617</div><div class="stat-delta up">↑ 22%</div></div>
      <div class="card stat-card stat-red"><div class="stat-label">Disapprovals</div><div class="stat-value">1</div><div class="stat-note">fix stock or hide</div></div>
    </div>`;
}

function renderFeed(root) {
  root.innerHTML = headBlock("Daily catalogue feed", "Automated catalog export to marketplaces") + `
    <div class="card">
      <div class="card-head"><div><h2>Run history</h2><p class="card-sub">Last executions</p></div>
      <button class="btn btn-primary" id="runFeedBtn">▶ Run feed now</button></div>
      ${table(
        ["Run", "Started", "Items", "Result"],
        `
          <tr><td class="cell-strong">#412</td><td class="cell-muted">Today 03:00</td><td class="mono">14</td><td>${pill("success", "green")}</td></tr>
          <tr><td class="cell-strong">#411</td><td class="cell-muted">Yesterday 03:00</td><td class="mono">14</td><td>${pill("success", "green")}</td></tr>
          <tr><td class="cell-strong">#410</td><td class="cell-muted">Nov 24 03:00</td><td class="mono">13</td><td>${pill("partial — 1 skipped", "amber")}</td></tr>
          <tr><td class="cell-strong">#409</td><td class="cell-muted">Nov 23 03:00</td><td class="mono">14</td><td>${pill("success", "green")}</td></tr>
        `
      )}
    </div>
    <ul class="list-clean">
      <li>🔗 <strong>Feed URL:</strong> <span class="mono cell-muted" id="feedUrl">https://www.lakassgo.com/data/products.xml</span>${pill("copy on click", "blue")}</li>
      <li>🕒 <strong>Schedule:</strong> daily 03:00 GMT+1 ${pill("active", "green")}</li>
    </ul>`;
  el("runFeedBtn").addEventListener("click", (e) => {
    e.target.textContent = "✓ Feeder queued (demo)";
    e.target.disabled = true;
  });
  el("feedUrl").addEventListener("click", () => showToast("Feed URL copied (demo)"));
}

function renderIntelligence(root) {
  root.innerHTML = headBlock("Intelligence", "Automatic insights from store data") + `
    <div class="tile-grid">
      <div class="card tile"><span class="tile-ico">🔥</span><div><h3>Trending: brake pads</h3><p>Searches ↑ 47% this week — consider extra stock</p></div>${pill("opportunity", "green")}</div>
      <div class="card tile"><span class="tile-ico">⚠️</span><div><h3>Stock risk: shock absorbers</h3><p>6 left • weekly sales ×1.8 — restock now</p></div>${pill("urgent", "red")}</div>
      <div class="card tile"><span class="tile-ico">💤</span><div><h3>Dormant: phone mounts</h3><p>0 sales in 30 days — consider promo</p></div>${pill("review", "amber")}</div>
      <div class="card tile"><span class="tile-ico">🏆</span><div><h3>Best bundle: pads + discs</h3><p>Bought together in 62% of brake orders</p></div>${pill("bundle idea", "blue")}</div>
      <div class="card tile"><span class="tile-ico">📍</span><div><h3>Demand zone: Casa → Rabat</h3><p>68% of orders — beta delivery lane proposed</p></div>${pill("ops", "blue")}</div>
      <div class="card tile"><span class="tile-ico">💰</span><div><h3>Margin watch: batteries</h3><p>Supplier price ↑ 6% — margin now 31%</p></div>${pill("monitor", "amber")}</div>
    </div>`;
}

function renderStrategy(root) {
  root.innerHTML = headBlock("360 Strategy Engine", "Suggested actions from the strategy engine") + `
    <div class="card">
      <div class="card-head"><div><h2>This week's strategy queue</h2><p class="card-sub">Accept or dismiss suggestions</p></div></div>
      ${table(
        ["Action", "Expected impact", "Effort", "Decision"],
        `
          <tr><td class="cell-strong">Promote tire-set bundle before summer</td><td class="cell-muted">+15% tire revenue</td><td class="mono">low</td>
            <td><button class="btn btn-ghost" data-act="accept">Accept</button> <button class="btn btn-ghost" data-act="dismiss">Dismiss</button></td></tr>
          <tr><td class="cell-strong">Add APIs for Renault car-part numbers</td><td class="cell-muted">vehicle-match on 40% more cars</td><td class="mono">medium</td>
            <td><button class="btn btn-ghost" data-act="accept">Accept</button> <button class="btn btn-ghost" data-act="dismiss">Dismiss</button></td></tr>
          <tr><td class="cell-strong">Open second depot in Rabat</td><td class="cell-muted">-12h avg delivery for 68% of buyers</td><td class="mono">high</td>
            <td><button class="btn btn-ghost" data-act="accept">Accept</button> <button class="btn btn-ghost" data-act="dismiss">Dismiss</button></td></tr>
        `
      )}
    </div>`;
  root.querySelectorAll("[data-act]").forEach((b) =>
    b.addEventListener("click", () => (b.textContent = "✓ done (demo)"))
  );
}

function renderFinance(root) {
  root.innerHTML = headBlock("Finance", "Revenue, costs and payouts") + `
    <div class="stat-grid">
      <div class="card stat-card stat-green"><div class="stat-label">Revenue (30d)</div><div class="stat-value">$ 1,844</div><div class="stat-delta up">↑ 12.4%</div></div>
      <div class="card stat-card stat-blue"><div class="stat-label">Cost of goods</div><div class="stat-value">$ 1,102</div><div class="stat-note">59.8% of revenue</div></div>
      <div class="card stat-card stat-dark"><div class="stat-label">Margin</div><div class="stat-value">40.2%</div><div class="stat-delta up">↑ 1.1 pts</div></div>
      <div class="card stat-card stat-red"><div class="stat-label">Pending payout</div><div class="stat-value">$ 431</div><div class="stat-note">next batch Friday</div></div>
    </div>
    <div class="card">
      <div class="card-head"><div><h2>Payouts</h2><p class="card-sub">Seller settlements</p></div></div>
      ${table(
        ["Batch", "Period", "Net", "Method", "Status"],
        `
          <tr><td class="cell-strong">PO-1121</td><td class="cell-muted">Nov 17 – Nov 23</td><td class="mono cell-strong">$ 431</td><td class="cell-muted">Bank transfer</td><td>${pill("pending", "amber")}</td></tr>
          <tr><td class="cell-strong">PO-1114</td><td class="cell-muted">Nov 10 – Nov 16</td><td class="mono cell-strong">$ 388</td><td class="cell-muted">Bank transfer</td><td>${pill("paid", "green")}</td></tr>
          <tr><td class="cell-strong">PO-1107</td><td class="cell-muted">Nov 3 – Nov 9</td><td class="mono cell-strong">$ 352</td><td class="cell-muted">Rpay wallet</td><td>${pill("paid", "green")}</td></tr>
        `
      )}
    </div>`;
}

function renderRpay(root) {
  root.innerHTML = headBlock("Rpay", "Online payment transactions") + `
    <div class="card">
      <div class="card-head"><div><h2>Transactions</h2><p class="card-sub">Card &amp; wallet payments via Rpay</p></div></div>
      ${table(
        ["Transaction", "Order", "Amount", "Method", "Result"],
        `
          <tr><td class="cell-strong mono">TX-88213</td><td class="cell-muted">#LKG-1042</td><td class="mono cell-strong">$ 34.90</td><td class="cell-muted">VISA •• 4417</td><td>${pill("captured", "green")}</td></tr>
          <tr><td class="cell-strong mono">TX-88197</td><td class="cell-muted">#LKG-1038</td><td class="mono cell-strong">$ 29.90</td><td class="cell-muted">Mastercard •• 2203</td><td>${pill("captured", "green")}</td></tr>
          <tr><td class="cell-strong mono">TX-88170</td><td class="cell-muted">#LKG-1036</td><td class="mono cell-strong">$ 44.90</td><td class="cell-muted">Wallet</td><td>${pill("refunded", "gray")}</td></tr>
          <tr><td class="cell-strong mono">TX-88144</td><td class="cell-muted">#LKG-1034</td><td class="mono cell-strong">$ 17.90</td><td class="cell-muted">VISA •• 9081</td><td>${pill("captured", "green")}</td></tr>
          <tr><td class="cell-strong mono">TX-88120</td><td class="cell-muted">#LKG-1031</td><td class="mono cell-strong">$ 58.90</td><td class="cell-muted">VISA •• 3356</td><td>${pill("declined", "red")}</td></tr>
        `
      )}
    </div>
    <div class="stat-grid">
      <div class="card stat-card stat-green"><div class="stat-label">Captured (30d)</div><div class="stat-value">$ 1,312</div><div class="stat-note">31 transactions</div></div>
      <div class="card stat-card stat-blue"><div class="stat-label">Auth rate</div><div class="stat-value">94%</div><div class="stat-note">of attempts</div></div>
      <div class="card stat-card stat-dark"><div class="stat-label">Chargebacks</div><div class="stat-value">0</div><div class="stat-note">nothing open</div></div>
      <div class="card stat-card stat-red"><div class="stat-label">Fees (30d)</div><div class="stat-value">$ 27.90</div><div class="stat-note">1.9% + fixed</div></div>
    </div>`;
}

function renderProcurement(root) {
  root.innerHTML = headBlock("Procurement", "Supplier orders and restocks") + `
    <div class="card">
      <div class="card-head"><div><h2>Supplier purchase orders</h2><p class="card-sub">Inbound stock</p></div>
      <button class="btn btn-primary" id="newPoBtn">＋ New PO</button></div>
      ${table(
        ["PO", "Supplier", "Items", "Total", "Status"],
        `
          <tr><td class="cell-strong">PO-2201</td><td class="cell-muted">Mecadis SARL</td><td class="mono">bushings ×40</td><td class="mono cell-strong">$ 612</td><td>${pill("in transit", "blue")}</td></tr>
          <tr><td class="cell-strong">PO-2200</td><td class="cell-muted">AutoParts Atlas</td><td class="mono">shocks ×24</td><td class="mono cell-strong">$ 742</td><td>${pill("confirmed", "green")}</td></tr>
          <tr><td class="cell-strong">PO-2199</td><td class="cell-muted">Batterie Plus</td><td class="mono">batteries ×12</td><td class="mono cell-strong">$ 690</td><td>${pill("draft", "gray")}</td></tr>
          <tr><td class="cell-strong">PO-2198</td><td class="cell-muted">Mecadis SARL</td><td class="mono">pads ×60</td><td class="mono cell-strong">$ 1,104</td><td>${pill("received", "green")}</td></tr>
        `
      )}
    </div>
    <ul class="list-clean">
      <li>🏭 <strong>Mecadis SARL</strong> — lead time 4 days, 96% fill rate ${pill("preferred", "green")}</li>
      <li>🏭 <strong>AutoParts Atlas</strong> — lead time 6 days, 89% fill rate ${pill("backup", "gray")}</li>
      <li>🏭 <strong>Batterie Plus</strong> — lead time 3 days, warranty 24 mo ${pill("specialty", "blue")}</li>
    </ul>`;
  el("newPoBtn").addEventListener("click", () => showToast("New purchase order (demo)"));
}

function renderStore(root) {
  root.innerHTML = headBlock("Public store", "Your live storefront") + `
    <div class="card card-pad">
      <h2>lakassGo storefront</h2>
      <p class="card-sub">Opens the public site in a new tab</p>
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;">
        <a class="btn btn-primary" href="https://www.lakassgo.com" target="_blank" rel="noopener">🌐 www.lakassgo.com</a>
        <a class="btn btn-ghost" href="index.html" target="_blank" rel="noopener">Preview locally →</a>
      </div>
    </div>
    <div class="stat-grid">
      <div class="card stat-card stat-green"><div class="stat-label">Store status</div><div class="stat-value">Live</div><div class="stat-note">HTTPS enforced</div></div>
      <div class="card stat-card stat-blue"><div class="stat-label">Uptime (30d)</div><div class="stat-value">99.98%</div><div class="stat-note">static hosting</div></div>
      <div class="card stat-card stat-dark"><div class="stat-label">Catalog on site</div><div class="stat-value">14</div><div class="stat-note">parts live</div></div>
      <div class="card stat-card stat-red"><div class="stat-label">Incidents</div><div class="stat-value">0</div><div class="stat-note">nothing open</div></div>
    </div>`;
}

/* ---------- Render dispatch ---------- */
const RENDERERS = {
  dashboard: () => renderDashboard(),
  orders: (root) => renderOrders(root),
  delivery: (root) => renderDelivery(root),
  chat: (root) => renderChat(root),
  products: (root) => renderProducts(root),
  inventory: (root) => renderInventory(root),
  catalogue: (root) => renderCatalogue(root),
  slider: (root) => renderSlider(root),
  reporting: (root) => renderReporting(root),
  marketing: (root) => renderMarketing(root),
  channels: (root) => renderChannels(root),
  gshopping: (root) => renderGshopping(root),
  feed: (root) => renderFeed(root),
  intelligence: (root) => renderIntelligence(root),
  strategy: (root) => renderStrategy(root),
  finance: (root) => renderFinance(root),
  rpay: (root) => renderRpay(root),
  procurement: (root) => renderProcurement(root),
  store: (root) => renderStore(root),
};
function renderView(name) {
  const root = el("view-" + name);
  if (!root || !RENDERERS[name]) return;
  RENDERERS[name](root);
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  let t = el("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText =
      "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);" +
      "background:#2c3e50;color:#fff;padding:11px 22px;border-radius:999px;font-size:13.5px;" +
      "font-weight:700;z-index:200;box-shadow:0 12px 30px rgba(21,33,46,.3);";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 2400);
}

/* ---------- Range selector ---------- */
function initRanges() {
  el("rangeSel").addEventListener("change", (e) => {
    const days = Number(e.target.value);
    const scale = days / 7;
    const total = Math.round(DATA_RANGES.base.reduce((s, v) => s + v, 0) * scale);
    el("stSessions").textContent = total.toLocaleString("en-US");
    el("stViews").textContent = (total * 12).toLocaleString("en-US");
    el("stViewsNote").textContent = "12 pages per session";
    const ordered = Math.max(1, Math.round(total * 0.002));
    el("stConv").textContent = "0.2%";
    el("stConvNote").textContent = ordered + " sessions that ordered";
    el("stRev").textContent = "$ " + (ordered * 29.74).toFixed(2);
  });
}

/* ---------- Boot ---------- */
initAuth();
initNav();
initRanges();
el("year").textContent = new Date().getFullYear();
