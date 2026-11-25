/* ================= lakassGo — App ================= */

const PRODUCTS = [
  {
    id: "brk-101", cat: "Brakes", art: "🛑", discount: 26,
    name: "Front ceramic brake pad set",
    desc: "Low-dust ceramic brake pads with longer service life, suited for most American, Korean and Japanese cars.",
    price: 34.90, old: 46.90, stock: "In stock", best: true
  },
  {
    id: "flt-102", cat: "Filters & Oils", art: "🛢️",
    name: "Genuine high-filtration oil filter",
    desc: "OEM-specification oil filter that keeps the engine clean and traps impurities down to 25 microns.",
    price: 6.90, old: 8.90, stock: "In stock", best: true
  },
  {
    id: "bat-103", cat: "Batteries & Electrical", art: "🔋", discount: 22,
    name: "12V / 70Ah maintenance-free battery",
    desc: "Powerful cranking battery delivering a full maintenance-free cycle, sized to OEM specifications.",
    price: 89.90, old: 114.90, stock: "In stock", best: false
  },
  {
    id: "tir-104", cat: "Tires & Wheels", art: "🛞", discount: 25,
    name: "205/55 R16 summer tire",
    desc: "Tire with excellent wet-grip performance and long-lasting balance, suited for city roads and touring.",
    price: 58.90, old: 78.90, stock: "In stock", best: true
  },
  {
    id: "eng-105", cat: "Engine Parts", art: "⚙️",
    name: "Timing belt kit + tensioner",
    desc: "Complete timing belt kit with the tensioner pulley, built to OEM specifications and matched to your model when ordering.",
    price: 44.90, old: 59.90, stock: "In stock", best: false
  },
  {
    id: "sus-106", cat: "Suspension & Steering", art: "🔧", discount: 28,
    name: "Upgraded gas front shock absorber (each)",
    desc: "Gas shock absorber that dampens vibration and improves vehicle stability on corners and rough roads.",
    price: 41.90, old: 57.90, stock: "In stock", best: true
  },
  {
    id: "lig-107", cat: "Lighting", art: "💡", discount: 30,
    name: "H4 LED bulbs, white 6000K",
    desc: "Powerful, clear LED bulbs in 6000K white for better road coverage, with instant flicker-free start-up.",
    price: 20.90, old: 29.90, stock: "In stock", best: true
  },
  {
    id: "acc-108", cat: "Accessories", art: "📱", discount: 20,
    name: "Magnetic dashboard phone mount",
    desc: "Strong magnetic holder that mounts on the dashboard and rotates 360° for calls and navigation maps.",
    price: 7.90, old: 9.90, stock: "In stock", best: false
  },
  {
    id: "eng-109", cat: "Engine Parts", art: "🧯", discount: 24,
    name: "Complete radiator water pump",
    desc: "Cooling pump with rubber seals that keeps the engine at the right temperature and protects it from overheating.",
    price: 52.90, old: 69.90, stock: "In stock", best: false
  },
  {
    id: "flt-110", cat: "Filters & Oils", art: "🛢️", discount: 25,
    name: "Full synthetic 5W-30 engine oil (4L)",
    desc: "Full synthetic oil that protects the engine hot and cold, and reduces fuel consumption and evaporation.",
    price: 29.90, old: 39.90, stock: "In stock", best: true
  },
  {
    id: "ele-111", cat: "Batteries & Electrical", art: "🔍",
    name: "Genuine front ABS sensor",
    desc: "ABS sensor resistant to moisture and heat, sending accurate wheel-rotation readings to the braking system.",
    price: 17.90, old: 22.90, stock: "In stock", best: false
  },
  {
    id: "win-112", cat: "Accessories", art: "🌧️", discount: 35,
    name: "Silent silicone wiper blade set",
    desc: "Silicone wiper blades with a silent action, clearing windshields crisply and quietly, heat-resistant for summer.",
    price: 12.90, old: 19.90, stock: "In stock", best: false
  },
  {
    id: "brk-113", cat: "Brakes", art: "🛠️",
    name: "Brake master cylinder",
    desc: "Corrosion-resistant master cylinder delivering balanced, responsive brake pressure across the system.",
    price: 61.90, old: 79.90, stock: "In stock", best: false
  },
  {
    id: "sus-114", cat: "Suspension & Steering", art: "🔩", discount: 27,
    name: "Front control arm bushing kit",
    desc: "Firm rubber bushings that reduce noise and vibration and keep the front control arms stable.",
    price: 24.90, old: 33.90, stock: "In stock", best: false
  },
];

const state = {
  cart: [],
  cat: "all",
  query: "",
  sort: "featured",
  modalProduct: null,
};

/* ---------- Elements ---------- */
const el = (id) => document.getElementById(id);
const productsGrid = el("productsGrid");
const bestGrid = el("bestGrid");
const catNav = el("catNav");
const cartCount = el("cartCount");

/* ---------- Build category chips ---------- */
function buildCats() {
  const cats = [...new Set(PRODUCTS.map((p) => p.cat))];
  cats.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "cat-chip";
    btn.dataset.cat = cat;
    btn.textContent = cat;
    catNav.appendChild(btn);
  });
}

/* ---------- Render products ---------- */
function productCard(p) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-art" role="button" tabindex="0" aria-label="Quick view">
      ${p.discount ? `<span class="discount-badge">-${p.discount}%</span>` : ""}
      ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />` : (p.art || "📦")}
    </div>
    <span class="product-cat">${p.cat}</span>
    <h3>${p.name}</h3>
    <p class="product-desc">${p.desc}</p>
    <div class="price-row">
      <span class="price">$ ${p.price.toFixed(2)}</span>
      ${p.old ? `<span class="price-old">$ ${p.old.toFixed(2)}</span>` : ""}
    </div>
    <span class="product-stock">${p.stock}</span>
  `;

  const addBtn = document.createElement("button");
  addBtn.className = "btn btn-primary btn-block add-to-cart";
  addBtn.textContent = "Add to cart";
  addBtn.dataset.id = p.id;
  card.appendChild(addBtn);

  card.querySelector(".product-art").addEventListener("click", () => openModal(p));
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(p);
  });
  return card;
}

function renderGrids() {
  const cat = state.cat;
  const q = state.query.trim().toLowerCase();
  const sort = state.sort;

  let filtered = PRODUCTS.filter((p) => {
    const inCat = cat === "all" || p.cat === cat;
    const inQ = !q || (p.name + " " + p.desc + " " + p.cat).toLowerCase().includes(q);
    return inCat && inQ;
  });

  const sorters = {
    "discount": (a, b) => (b.discount || 0) - (a.discount || 0),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "featured": (a, b) => Number(!!b.discount) - Number(!!a.discount),
  };
  filtered.sort(sorters[sort] || sorters.featured);

  productsGrid.replaceChildren(
    ...filtered.map((p) => productCard(p))
  );
  el("emptyMsg").hidden = filtered.length > 0;

  const best = PRODUCTS.filter((p) => p.best);
  bestGrid.replaceChildren(...best.map((p) => productCard(p)));
}

/* ---------- Hero slider ---------- */
const SLIDES_KEY = "lkg_site_slides";

const DEFAULT_SLIDES = [
  {
    id: "slide-1", enabled: true, productId: "brk-101", image: "",
    eyebrow: "Free delivery • New & inspected used parts",
    title: "Save more, get back on the road faster — every spare part in one place",
    subtitle: "lakassGo is the marketplace for buying and selling auto spare parts: engines, brakes, filters, oils, tires, batteries and accessories.",
    ctaText: "Shop today's deals", ctaUrl: "#deals",
    bg1: "#7c3aed", bg2: "#2563eb",
  },
  {
    id: "slide-2", enabled: true, productId: "tir-104", image: "",
    eyebrow: "Brakes & suspension",
    title: "Stopping power you can trust — brakes & tires up to −30%",
    subtitle: "Ceramic pads, discs and shocks for the most common makes — fitted right, first time.",
    ctaText: "Shop brakes & tires", ctaUrl: "#deals",
    bg1: "#0f172a", bg2: "#1d4ed8",
  },
  {
    id: "slide-3", enabled: true, productId: "bat-103", image: "",
    eyebrow: "Batteries & electrical",
    title: "Dead battery? Fresh 12V power delivered to your door",
    subtitle: "Maintenance-free batteries sized to OEM spec, with free fitting advice from our mechanics.",
    ctaText: "Shop batteries", ctaUrl: "#deals",
    bg1: "#065f46", bg2: "#22c55e",
  },
];

function loadStoreAdminProducts() {
  try {
    const raw = localStorage.getItem("lkg_admin_products");
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map((p) => ({
      id: p.id,
      cat: p.cat || "Parts",
      art: p.icon || p.art || "",
      image: (p.photos && p.photos[0]) || p.image || "",
      name: p.name || "Part",
      desc: p.desc || "",
      price: Number(p.price) || 0,
      old: p.old ? Number(p.old) : 0,
      discount: p.discount || 0,
      stock: p.stock || "In stock",
      best: !!p.best,
    }));
  } catch { return []; }
}

function findAnyProduct(id) {
  return (
    PRODUCTS.find((p) => p.id === id) ||
    loadStoreAdminProducts().find((p) => p.id === id) ||
    null
  );
}

function loadSlides() {
  try {
    const raw = localStorage.getItem(SLIDES_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch { /* ignore */ }
  return DEFAULT_SLIDES;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

const slider = {
  index: 0,
  count: 0,
  timer: null,
};

function paintSlider() {
  const track = el("slidesTrack");
  const dots = el("slideDots");
  if (!track || !slider.count) return;
  track.style.transform = "translateX(-" + slider.index * 100 + "%)";
  dots.querySelectorAll(".slider-dot").forEach((d, i) =>
    d.classList.toggle("active", i === slider.index)
  );
}

function goToSlide(i) {
  if (!slider.count) return;
  slider.index = (i + slider.count) % slider.count;
  paintSlider();
  restartAutoplay();
}

function restartAutoplay() {
  clearInterval(slider.timer);
  slider.timer = setInterval(() => goToSlide(slider.index + 1), 6000);
}

function initHeroSlider() {
  const section = el("sliderSection");
  const track = el("slidesTrack");
  const dots = el("slideDots");
  const all = loadSlides().filter((s) => s.enabled !== false);
  if (!track || !all.length) {
    if (section) section.hidden = true;
    return;
  }

  track.innerHTML = all.map((s) => {
    const p = findAnyProduct(s.productId);
    const style =
      "background: linear-gradient(120deg, " + (s.bg1 || "#7c3aed") + ", " + (s.bg2 || "#2563eb") + ");" +
      (s.color ? " color: " + s.color + ";" : "");
    const art = s.image
      ? `<img src="${esc(s.image)}" alt="${esc(p ? p.name : "")}" />`
      : (p ? (p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" />` : (p.art || "📦")) : "📦");
    const cat = p ? esc(p.cat) : "";
    const name = p ? esc(p.name) : esc(s.title || "Featured part");
    const price = p ? "$ " + p.price.toFixed(2) : "";
    const oldPrice = p && p.old ? `<span class="price-old">$ ${p.old.toFixed(2)}</span>` : "";
    const pct = p && p.old && p.old > p.price ? Math.round((1 - p.price / p.old) * 100) : (p ? p.discount || 0 : 0);
    const badge = p && pct > 0 ? `<span class="discount-badge">-${pct}%</span>` : "";
    return `
      <div class="slide" style="${style}">
        <div class="slide-copy">
          ${s.eyebrow ? `<p class="slide-eyebrow">${esc(s.eyebrow)}</p>` : ""}
          <h2 class="slide-title">${esc(s.title || "")}</h2>
          ${s.subtitle ? `<p class="slide-sub">${esc(s.subtitle)}</p>` : ""}
          ${s.ctaText ? `<a class="slide-cta" href="${esc(s.ctaUrl || "#deals")}">${esc(s.ctaText)} →</a>` : ""}
        </div>
        ${p ? `
        <div class="slide-product">
          <div class="sp-art">${badge}${art}</div>
          <p class="sp-cat">${cat}</p>
          <h3>${name}</h3>
          <div class="price-row">
            <span class="price">${price}</span>${oldPrice}
          </div>
          <button class="btn btn-primary btn-block slide-add" data-id="${esc(p.id)}">Add to cart</button>
        </div>` : ""}
      </div>`;
  }).join("");

  dots.innerHTML = all.map((_, i) =>
    `<button class="slider-dot${i === 0 ? " active" : ""}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`
  ).join("");

  slider.count = all.length;
  slider.index = 0;
  track.style.transform = "translateX(0)";

  const box = el("heroSlider");
  box.addEventListener("mouseenter", () => clearInterval(slider.timer));
  box.addEventListener("mouseleave", restartAutoplay);
  el("slidePrev").addEventListener("click", () => goToSlide(slider.index - 1));
  el("slideNext").addEventListener("click", () => goToSlide(slider.index + 1));
  dots.addEventListener("click", (e) => {
    const d = e.target.closest(".slider-dot");
    if (d) goToSlide(Number(d.dataset.i));
  });

  let touchX = null;
  box.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) goToSlide(slider.index + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  restartAutoplay();
}

/* ---------- Cart ---------- */
function addToCart(p) {
  const found = state.cart.find((i) => i.id === p.id);
  if (found) found.qty++;
  else state.cart.push({ ...p, qty: 1 });
  renderCart();
  showToast("✓ \"" + p.name + "\" added to cart");
  cartCount.classList.add("bump");
  setTimeout(() => cartCount.classList.remove("bump"), 200);
}

function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  renderCart();
}

function changeQty(id, delta) {
  const item = state.cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else renderCart();
}

function renderCart() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const total = state.cart.reduce((s, i) => s + i.qty * i.price, 0);
  cartCount.textContent = count;
  el("cartDrawerCount").textContent = count;
  el("cartTotal").textContent = "$ " + total.toFixed(2);

  const items = el("cartItems");
  items.replaceChildren();
  if (!state.cart.length) {
    const p = document.createElement("p");
    p.className = "cart-empty";
    p.id = "cartEmpty";
    p.textContent = "Your cart is empty — add a part and enjoy free delivery 🚚";
    items.appendChild(p);
    return;
  }
  state.cart.forEach((i) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-art">${i.image ? `<img src="${i.image}" alt="" />` : (i.art || "📦")}</div>
      <div>
        <h4>${i.name}</h4>
        <span class="price">$ ${i.price.toFixed(2)}</span>
        <div class="qty-row">
          <button class="qty-btn minus" aria-label="Decrease quantity">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn plus" aria-label="Increase quantity">+</button>
          <button class="item-remove">Remove</button>
        </div>
      </div>
    `;
    div.querySelector(".minus").addEventListener("click", () => changeQty(i.id, -1));
    div.querySelector(".plus").addEventListener("click", () => changeQty(i.id, +1));
    div.querySelector(".item-remove").addEventListener("click", () => removeFromCart(i.id));
    items.appendChild(div);
  });
}

/* ---------- Cart drawer ---------- */
function openCart() {
  el("cartDrawer").hidden = false;
  el("overlay").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeCart() {
  el("cartDrawer").hidden = true;
  el("overlay").hidden = true;
  document.body.style.overflow = "";
}
function closeAll() {
  closeCart();
  el("productModal").hidden = true;
}

/* ---------- Product modal ---------- */
function openModal(p) {
  state.modalProduct = p;
  el("modalArt").innerHTML = p.image
    ? `<img src="${p.image}" alt="${p.name}" />`
    : (p.art || "📦");
  el("modalCat").textContent = p.cat;
  el("modalName").textContent = p.name;
  el("modalDesc").textContent = p.desc;
  el("modalStock").textContent = p.stock;
  el("modalPrice").textContent = "$ " + p.price.toFixed(2);
  el("modalOldPrice").textContent = p.old ? "$ " + p.old.toFixed(2) : "";
  el("productModal").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal() {
  el("productModal").hidden = true;
  document.body.style.overflow = "";
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const t = el("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

/* ---------- Events ---------- */
function init() {
  buildCats();
  renderGrids();
  renderCart();
  initHeroSlider();
  el("year").textContent = new Date().getFullYear();

  document.addEventListener("click", (e) => {
    const slideAdd = e.target.closest(".slide-add");
    if (slideAdd) {
      const p = findAnyProduct(slideAdd.dataset.id);
      if (p) addToCart(p);
      return;
    }
    const chip = e.target.closest(".cat-chip");
    if (chip) {
      document.querySelectorAll(".cat-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.cat = chip.dataset.cat;
      state.query = "";
      el("searchInput").value = "";
      renderGrids();
      el("deals").scrollIntoView({ behavior: "smooth" });
    }
  });

  el("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.query = el("searchInput").value;
    state.cat = "all";
    document.querySelectorAll(".cat-chip").forEach((c) =>
      c.classList.toggle("active", c.dataset.cat === "all")
    );
    renderGrids();
    el("deals").scrollIntoView({ behavior: "smooth" });
  });

  el("searchInput").addEventListener("input", () => {
    state.query = el("searchInput").value;
    renderGrids();
  });

  el("sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrids();
  });

  el("cartOpen").addEventListener("click", openCart);
  el("cartClose").addEventListener("click", closeCart);
  el("overlay").addEventListener("click", closeAll);

  el("modalClose").addEventListener("click", closeModal);
  el("productModal").addEventListener("click", (e) => {
    if (e.target.id === "productModal") closeModal();
  });
  el("modalAdd").addEventListener("click", () => {
    if (state.modalProduct) {
      addToCart(state.modalProduct);
      closeModal();
      openCart();
    }
  });

  el("checkoutBtn").addEventListener("click", () => {
    if (!state.cart.length) {
      showToast("Your cart is empty — add a part first 🛒");
      return;
    }
    state.cart = [];
    renderCart();
    closeCart();
    const banner = el("checkoutBanner");
    banner.hidden = false;
    setTimeout(() => (banner.hidden = true), 4200);
  });

  el("announceClose").addEventListener("click", () => {
    el("announceBar").remove();
  });

  el("newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    el("newsMsg").hidden = false;
    e.target.reset();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

init();
