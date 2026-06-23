const initialDataEl = document.getElementById("initial-data");
const categories = JSON.parse(initialDataEl.dataset.categories || "[]");
const durations = JSON.parse(initialDataEl.dataset.durations || "[]");
const plans = JSON.parse(initialDataEl.dataset.plans || "[]");
function renderCategories() {
  const container = document.getElementById("categories");
  if (categories.length === 0) {
    container.innerHTML = `
          <div style="text-align:center;padding:48px 20px;border:2px dashed #e2e8f0;border-radius:12px;background:#fafbfc;">
            <svg width="40" height="40" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style="margin:0 auto 12px;display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            <p style="color:#64748b;margin:0 0 4px 0;font-size:14px;font-weight:500;">Belum ada kategori</p>
            <p style="color:#94a3b8;margin:0;font-size:13px;">Klik tombol "Tambah Kategori" di atas untuk memulai</p>
          </div>`;
    return;
  }
  container.innerHTML = categories.map((cat, i) => `
        <div style="display:flex;gap:12px;margin-bottom:12px;align-items:center;padding:14px;background:#fafbfc;border:1px solid #e2e8f0;border-radius:10px;">
          <div style="flex:1;">
            <input type="text" value="${cat.name}" placeholder="Nama Kategori" class="dash-form-input"
              oninput="categories[${i}].name = this.value" />
          </div>
          <div style="width:180px;">
            <select class="dash-form-input dash-form-select" onchange="categories[${i}].icon = this.value">
              <option value="system" ${cat.icon === "system" ? "selected" : ""}>System</option>
              <option value="omnichannel" ${cat.icon === "omnichannel" ? "selected" : ""}>Omnichannel</option>
              <option value="whatsapp" ${cat.icon === "whatsapp" ? "selected" : ""}>WhatsApp</option>
              <option value="maintenance" ${cat.icon === "maintenance" ? "selected" : ""}>Maintenance</option>
            </select>
          </div>
          <button type="button" onclick="removeCategory(${i})" class="dash-btn dash-btn-danger dash-btn-sm">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      `).join("");
}
function renderDurations() {
  const container = document.getElementById("durations");
  if (durations.length === 0) {
    container.innerHTML = `
          <div style="text-align:center;padding:48px 20px;border:2px dashed #e2e8f0;border-radius:12px;background:#fafbfc;">
            <svg width="40" height="40" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style="margin:0 auto 12px;display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p style="color:#64748b;margin:0 0 4px 0;font-size:14px;font-weight:500;">Belum ada durasi</p>
            <p style="color:#94a3b8;margin:0;font-size:13px;">Klik tombol "Tambah Durasi" di atas untuk memulai</p>
          </div>`;
    return;
  }
  container.innerHTML = durations.map((dur, i) => `
        <div style="display:flex;gap:12px;margin-bottom:12px;align-items:center;padding:14px;background:#fafbfc;border:1px solid #e2e8f0;border-radius:10px;">
          <div style="flex:1;">
            <input type="text" value="${dur.label}" placeholder="Label (e.g., 6 Bulan)" class="dash-form-input"
              oninput="durations[${i}].label = this.value" />
          </div>
          <div style="width:140px;">
            <input type="number" value="${dur.months}" placeholder="Bulan" class="dash-form-input" min="1"
              oninput="durations[${i}].months = parseInt(this.value) || 1" />
          </div>
          <button type="button" onclick="removeDuration(${i})" class="dash-btn dash-btn-danger dash-btn-sm">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      `).join("");
}
function renderPlans() {
  const container = document.getElementById("plans");
  if (plans.length === 0) {
    container.innerHTML = `
          <div style="text-align:center;padding:48px 20px;border:2px dashed #e2e8f0;border-radius:12px;background:#fafbfc;">
            <svg width="40" height="40" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style="margin:0 auto 12px;display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            <p style="color:#64748b;margin:0 0 4px 0;font-size:14px;font-weight:500;">Belum ada paket</p>
            <p style="color:#94a3b8;margin:0;font-size:13px;">Klik tombol "Tambah Paket" di atas untuk memulai</p>
          </div>`;
    return;
  }
  container.innerHTML = plans.map((plan, i) => `
        <div style="border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px;background:#fafbfc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #e2e8f0;">
            <h4 style="font-weight:700;font-size:15px;color:#0f172a;margin:0;">Paket ${i + 1}</h4>
            <button type="button" onclick="removePlan(${i})" class="dash-btn dash-btn-danger dash-btn-sm">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Hapus
            </button>
          </div>
          <div class="dash-grid dash-grid-2 dash-mb-4">
            <div class="dash-form-group">
              <label class="dash-form-label">Kategori</label>
              <select class="dash-form-input dash-form-select" onchange="plans[${i}].categoryIndex = parseInt(this.value)">
                ${categories.map((cat, ci) => `<option value="${ci}" ${plan.categoryIndex === ci ? "selected" : ""}>${cat.name || "Kategori " + (ci + 1)}</option>`).join("")}
              </select>
            </div>
            <div class="dash-form-group">
              <label class="dash-form-label">Durasi</label>
              <select class="dash-form-input dash-form-select" onchange="plans[${i}].durationIndex = parseInt(this.value)">
                ${durations.map((dur, di) => `<option value="${di}" ${plan.durationIndex === di ? "selected" : ""}>${dur.label || "Durasi " + (di + 1)}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="dash-grid dash-grid-2 dash-mb-4">
            <div class="dash-form-group">
              <label class="dash-form-label">Nama Paket</label>
              <input type="text" value="${plan.name}" class="dash-form-input" placeholder="Basic Plan" oninput="plans[${i}].name = this.value" />
            </div>
            <div class="dash-form-group">
              <label class="dash-form-label">Harga (kosongkan = Hubungi Kami)</label>
              <input type="number" value="${plan.price}" class="dash-form-input" placeholder="500000" oninput="plans[${i}].price = this.value" />
            </div>
          </div>
          <div class="dash-form-group dash-mb-4">
            <label class="dash-form-label">Deskripsi</label>
            <textarea class="dash-form-input dash-form-textarea" placeholder="Deskripsi paket..." oninput="plans[${i}].description = this.value">${plan.description}</textarea>
          </div>
          <div class="dash-grid dash-grid-2 dash-mb-4">
            <div class="dash-form-group">
              <label class="dash-form-label">CTA Text</label>
              <input type="text" value="${plan.ctaText}" class="dash-form-input" oninput="plans[${i}].ctaText = this.value" />
            </div>
            <div class="dash-form-group">
              <label class="dash-form-label">CTA URL (opsional)</label>
              <input type="text" value="${plan.ctaUrl}" class="dash-form-input" placeholder="https://wa.me/..." oninput="plans[${i}].ctaUrl = this.value" />
            </div>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <label class="dash-form-label" style="margin:0;font-weight:700;">Fitur Paket</label>
              <button type="button" onclick="addFeature(${i})" class="dash-btn dash-btn-secondary dash-btn-sm">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Tambah Fitur
              </button>
            </div>
            ${plan.features.map((feat, fi) => `
              <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
                <input type="text" value="${feat.category}" placeholder="Kategori Fitur" class="dash-form-input" style="width:200px"
                  oninput="plans[${i}].features[${fi}].category = this.value" />
                <input type="text" value="${feat.name}" placeholder="Nama Fitur" class="dash-form-input" style="flex:1"
                  oninput="plans[${i}].features[${fi}].name = this.value" />
                <button type="button" onclick="removeFeature(${i}, ${fi})" class="dash-btn dash-btn-danger dash-btn-sm">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("");
}
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<svg style="width:16px;height:16px;animation:spin 1s linear infinite;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Menyimpan...';
  try {
    const data = {
      client_name: formData.get("client_name"),
      company_name: formData.get("company_name"),
      slug: formData.get("slug"),
      status: formData.get("status"),
      header_title: formData.get("header_title"),
      valid_until: formData.get("valid_until") || null,
      categories: categories.map((c) => ({ name: c.name, icon: c.icon })),
      durations: durations.map((d) => ({ label: d.label, months: d.months })),
      plans: plans.map((p) => ({
        categoryIndex: p.categoryIndex,
        durationIndex: p.durationIndex,
        name: p.name,
        description: p.description,
        price: p.price ? parseInt(p.price) : null,
        priceSuffix: p.priceSuffix,
        ctaText: p.ctaText,
        ctaUrl: p.ctaUrl,
        features: p.features
      }))
    };
    const response = await fetch(`/api/pricing/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      const errorData = await response.json();
      alert("Error: " + (errorData.error || "Gagal mengupdate pricing page"));
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Update Pricing Page';
    }
  } catch (err) {
    alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Update Pricing Page';
  }
});
renderCategories();
renderDurations();
renderPlans();
