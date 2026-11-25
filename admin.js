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

/* ---------- Slider manager ---------- */
const SLIDES_KEY = "lkg_site_slides";

function slideDefaults() {
  return [
    {
      id: "slide-1", enabled: true, productId: "brk-101", image: "",
      eyebrow: "Free delivery • New & inspected used parts",
      title: "Save more, get back on the road faster — every spare part in one place",
      subtitle: "lakassGo is the marketplace for buying and selling auto spare parts: engines, brakes, filters, oils, tires, batteries and accessories.",
      ctaText: "Shop today's deals", ctaUrl: "#deals",
      bg1: "#7c3aed", bg2: "#2563eb", color: "#ffffff",
    },
    {
      id: "slide-2", enabled: true, productId: "tir-104", image: "",
      eyebrow: "Brakes & suspension",
      title: "Stopping power you can trust — brakes & tires up to −30%",
      subtitle: "Ceramic pads, discs and shocks for the most common makes — fitted right, first time.",
      ctaText: "Shop brakes & tires", ctaUrl: "#deals",
      bg1: "#0f172a", bg2: "#1d4ed8", color: "#ffffff",
    },
    {
      id: "slide-3", enabled: true, productId: "bat-103", image: "",
      eyebrow: "Batteries & electrical",
      title: "Dead battery? Fresh 12V power delivered to your door",
      subtitle: "Maintenance-free batteries sized to OEM spec, with free fitting advice from our mechanics.",
      ctaText: "Shop batteries", ctaUrl: "#deals",
      bg1: "#065f46", bg2: "#22c55e", color: "#ffffff",
    },
  ];
}

function loadSlides() {
  try {
    const raw = localStorage.getItem(SLIDES_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch { /* ignore */ }
  return slideDefaults();
}

function saveSlidesToStore(slides) {
  try {
    localStorage.setItem(SLIDES_KEY, JSON.stringify(slides));
    return true;
  } catch {
    showToast("⚠️ Storage full — use a smaller image");
    return false;
  }
}

let slidesDraft = [];

function slField(i, key, label, value, type = "text") {
  return `
    <label class="sl-field" data-key="${key}" data-i="${i}">${label}
      <input type="${type}" data-f="${key}" data-i="${i}" value="${esc(value)}" />
    </label>`;
}

function renderSlider(root) {
  slidesDraft = loadSlides().map((s) => ({ ...s }));
  const opts = PRODUCTS.map((p) =>
    `<option value="${esc(p.id)}">${esc((p.name || "Untitled") + " — " + money(Number(p.price) || 0))}</option>`
  ).join("");

  root.innerHTML = headBlock("Slider", "Homepage hero banners — shown under the header on the storefront") + `
    <div class="card">
      <div class="card-head"><div><h2>Homepage slider</h2><p class="card-sub">Three featured slides — pick the product, image, texts and colors</p></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-ghost" id="resetSlidesBtn">↺ Reset</button>
        <button class="btn btn-primary" id="saveSlidesBtn">💾 Save slider</button>
      </div></div>
      <div class="sl-editor">
        ${slidesDraft.map((s, i) => `
        <div class="sl-card${s.enabled === false ? " disabled" : ""}" data-card="${i}">
          <div class="sl-card-top">
            <h2>■ Slide ${i + 1}</h2>
            <label class="sl-toggle"><input type="checkbox" data-f="enabled" data-i="${i}" ${s.enabled === false ? "" : "checked"} /> Visible on site</label>
          </div>
          <div class="sl-grid">
            <div>
              <label class="sl-field">Featured product
                <select data-f="productId" data-i="${i}">${opts}</select>
              </label>
              <div style="margin-top:12px">
                <label class="sl-field">Product <select> shows the product's own photo — or use a custom slide image below</label>
              </div>
              ${slField(i, "eyebrow", "Eyebrow badge", s.eyebrow || "")}
              ${slField(i, "title", "Headline", s.title || "")}
              ${slField(i, "subtitle", "Subtext", s.subtitle || "")}
              <div class="sl-grid" style="grid-template-columns:1fr 1fr">
                ${slField(i, "ctaText", "Button text", s.ctaText || "")}
                ${slField(i, "ctaUrl", "Button link", s.ctaUrl || "")}
              </div>
            </div>
            <div>
              <div class="sl-colors">
                <label class="sl-field">Background from
                  <input type="color" data-f="bg1" data-i="${i}" value="${esc(s.bg1 || "#7c3aed")}" />
                </label>
                <label class="sl-field">Background to
                  <input type="color" data-f="bg2" data-i="${i}" value="${esc(s.bg2 || "#2563eb")}" />
                </label>
                <label class="sl-field">Text color
                  <input type="color" data-f="color" data-i="${i}" value="${esc(s.color || "#ffffff")}" />
                </label>
              </div>
              <div style="margin-top:12px">
                <label class="sl-field">Custom slide image (optional)</label>
                <div class="sl-img-row">
                  <div class="pm-add-row" style="flex:1">
                    <input type="url" data-f="image" data-i="${i}" placeholder="https://… or upload" value="${esc(s.image || "")}" />
                  </div>
                </div>
                <div class="pm-add-row">
                  <button class="btn btn-ghost pm-upload" data-slupload="${i}">📤 Upload photo</button>
                  <input type="file" accept="image/*" data-slfile="${i}" hidden />
                  ${s.image ? `<img class="sl-thumb" src="${esc(s.image)}" alt="slide image" />` : `<span class="pm-empty">No custom image — using product photo / icon</span>`}
                  ${s.image ? `<button class="btn btn-ghost" data-slclear="${i}">✕ Remove</button>` : ""}
                </div>
              </div>
            </div>
          </div>
          <div class="sl-preview" data-preview="${i}" style="background:linear-gradient(120deg, ${esc(s.bg1 || "#7c3aed")}, ${esc(s.bg2 || "#2563eb")});color:${esc(s.color || "#ffffff")}">
            <strong data-pv-title="${i}">${esc(s.title || "Untitled slide")}</strong>
          </div>
          <div class="sl-save">
            <button class="btn btn-primary" data-slsave="${i}">✔ Save slide ${i + 1}</button>
          </div>
        </div>`).join("")}
      </div>
    </div>`;

  const num = (v, def) => (/^#[0-9a-fA-F]{6}$/.test(v) ? v : def);

  const onField = (input) => {
    const i = Number(input.dataset.i);
    const key = input.dataset.f;
    if (!slidesDraft[i]) return;
    if (key === "enabled") {
      slidesDraft[i].enabled = input.checked;
      const card = root.querySelector(`[data-card="${i}"]`);
      if (card) card.classList.toggle("disabled", !input.checked);
    } else {
      slidesDraft[i][key] = input.value;
      if (["bg1", "bg2", "color"].includes(key)) {
        const pv = root.querySelector(`[data-preview="${i}"]`);
        if (pv) {
          pv.style.background = "linear-gradient(120deg, " +
            num(slidesDraft[i].bg1, "#7c3aed") + ", " + num(slidesDraft[i].bg2, "#2563eb") + ")";
          pv.style.color = num(slidesDraft[i].color, "#ffffff");
        }
      }
    }
  };
  root.querySelectorAll("[data-f]").forEach((input) => {
    input.addEventListener("input", () => onField(input));
    input.addEventListener("change", () => onField(input));
  });

  root.querySelectorAll("[data-slupload]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = btn.dataset.slupload;
      const file = root.querySelector(`[data-slfile="${i}"]`);
      if (file) file.click();
    })
  );
  root.querySelectorAll("[data-slfile]").forEach((inp) =>
    inp.addEventListener("change", async () => {
      const i = Number(inp.dataset.slfile);
      const f = inp.files && inp.files[0];
      if (!f || !slidesDraft[i]) return;
      const data = await fileToPhotoDataUrl(f);
      slidesDraft[i].image = data;
      renderSlider(root);
      showToast("✅ Image added — remember to Save");
    })
  );
  root.querySelectorAll("[data-slclear]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.slclear);
      if (!slidesDraft[i]) return;
      slidesDraft[i].image = "";
      renderSlider(root);
    })
  );
  root.querySelectorAll("[data-slsave]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.slsave);
      const s = slidesDraft[i];
      if (!s) return;
      if (!s.title || !String(s.title).trim()) {
        showToast("⚠️ Add a headline first");
        const input = root.querySelector(`input[data-f="title"][data-i="${i}"]`);
        if (input) input.focus();
        return;
      }
      const all = loadSlides();
      all[i] = { ...s, enabled: s.enabled !== false };
      if (saveSlidesToStore(all)) showToast("✅ Slide " + (i + 1) + " saved — check the storefront");
    })
  );
  el("saveSlidesBtn").addEventListener("click", () => {
    for (let i = 0; i < slidesDraft.length; i++) {
      if (!String(slidesDraft[i].title || "").trim()) {
        showToast("⚠️ Slide " + (i + 1) + " needs a headline");
        return;
      }
    }
    const all = slidesDraft.map((s) => ({ ...s, enabled: s.enabled !== false }));
    if (saveSlidesToStore(all)) showToast("✅ Slider saved — open the storefront to see it");
  });
  el("resetSlidesBtn").addEventListener("click", () => {
    if (el("resetSlidesBtn").dataset.armed === "1") {
      delete el("resetSlidesBtn").dataset.armed;
      const defs = slideDefaults();
      saveSlidesToStore(defs);
      slidesDraft = defs.map((s) => ({ ...s }));
      renderSlider(root);
      showToast("↺ Slider reset to defaults");
    } else {
      el("resetSlidesBtn").dataset.armed = "1";
      el("resetSlidesBtn").textContent = "Sure? Click again";
      showToast("Click again to confirm reset");
      setTimeout(() => {
        const b = el("resetSlidesBtn");
        if (b) { delete b.dataset.armed; b.textContent = "↺ Reset"; }
      }, 3000);
    }
  });
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
