const initialDataEl = document.getElementById("initial-data");
const categories = JSON.parse(initialDataEl.dataset.categories || "[]");
const durations = JSON.parse(initialDataEl.dataset.durations || "[]");
const plans = JSON.parse(initialDataEl.dataset.plans || "[]");
function renderCategories() {
  const container = document.getElementById("categories");
  if (categories.length === 0) {
    container.innerHTML = '<p class="dash-text-gray" style="text-align:center;padding:24px;">Belum ada kategori. Klik tombol di bawah untuk menambah.</p>';
    return;
  }
  container.innerHTML = categories.map((cat, i) => `
        <div style="display:flex;gap:12px;margin-bottom:12px;align-items:center;padding:12px;background:#f9fafb;border-radius:8px;">
          <input type="text" value="${cat.name}" placeholder="Nama Kategori" class="dash-form-input" style="flex:1"
            oninput="categories[${i}].name = this.value" />
          <select class="dash-form-input dash-form-select" style="width:160px" onchange="categories[${i}].icon = this.value">
            <option value="system" ${cat.icon === "system" ? "selected" : ""}>System</option>
            <option value="omnichannel" ${cat.icon === "omnichannel" ? "selected" : ""}>Omnichannel</option>
            <option value="whatsapp" ${cat.icon === "whatsapp" ? "selected" : ""}>WhatsApp</option>
            <option value="maintenance" ${cat.icon === "maintenance" ? "selected" : ""}>Maintenance</option>
          </select>
          <button type="button" onclick="removeCategory(${i})" class="dash-btn dash-btn-danger dash-btn-sm">Hapus</button>
        </div>
      `).join("");
}
function renderDurations() {
  const container = document.getElementById("durations");
  if (durations.length === 0) {
    container.innerHTML = '<p class="dash-text-gray" style="text-align:center;padding:24px;">Belum ada durasi. Klik tombol di bawah untuk menambah.</p>';
    return;
  }
  container.innerHTML = durations.map((dur, i) => `
        <div style="display:flex;gap:12px;margin-bottom:12px;align-items:center;padding:12px;background:#f9fafb;border-radius:8px;">
          <input type="text" value="${dur.label}" placeholder="Label (e.g., 6 Bulan)" class="dash-form-input" style="flex:1"
            oninput="durations[${i}].label = this.value" />
          <input type="number" value="${dur.months}" placeholder="Bulan" class="dash-form-input" style="width:120px" min="1"
            oninput="durations[${i}].months = parseInt(this.value) || 1" />
          <button type="button" onclick="removeDuration(${i})" class="dash-btn dash-btn-danger dash-btn-sm">Hapus</button>
        </div>
      `).join("");
}
function renderPlans() {
  const container = document.getElementById("plans");
  if (plans.length === 0) {
    container.innerHTML = '<p class="dash-text-gray" style="text-align:center;padding:24px;">Belum ada paket. Klik tombol di bawah untuk menambah.</p>';
    return;
  }
  container.innerHTML = plans.map((plan, i) => `
        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:16px;background:#fafafa;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h4 style="font-weight:600;font-size:16px;">Paket ${i + 1}</h4>
            <button type="button" onclick="removePlan(${i})" class="dash-btn dash-btn-danger dash-btn-sm">Hapus</button>
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
          <div style="border-top:1px solid #e5e7eb;padding-top:16px;margin-top:8px;">
            <label class="dash-form-label" style="font-weight:600;">Fitur Paket</label>
            ${plan.features.map((feat, fi) => `
              <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
                <input type="text" value="${feat.category}" placeholder="Kategori Fitur" class="dash-form-input" style="width:180px"
                  oninput="plans[${i}].features[${fi}].category = this.value" />
                <input type="text" value="${feat.name}" placeholder="Nama Fitur" class="dash-form-input" style="flex:1"
                  oninput="plans[${i}].features[${fi}].name = this.value" />
                <button type="button" onclick="removeFeature(${i}, ${fi})" class="dash-btn dash-btn-danger dash-btn-sm">✕</button>
              </div>
            `).join("")}
            <button type="button" onclick="addFeature(${i})" class="dash-btn dash-btn-secondary dash-btn-sm">+ Tambah Fitur</button>
          </div>
        </div>
      `).join("");
}
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Menyimpan...";
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
    const response = await fetch("/api/pricing/{id}", {
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
      submitBtn.textContent = "Update Pricing Page";
    }
  } catch (err) {
    alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Update Pricing Page";
  }
});
renderCategories();
renderDurations();
renderPlans();
