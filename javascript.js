let cart = [];
let discount = 0;
let userLocation = ""; // متغير لحفظ رابط الموقع

function displayProducts(items) {
  const grid = document.getElementById("main-grid");
  grid.innerHTML = items
    .map(
      (p) => `
        <div class="card">
            <img src="${p.image}" alt="${p.title}">
            <div style="padding:15px; text-align:center;">
                <h3>${p.title}</h3>
                <p style="color:var(--noir-gold); font-weight:bold;">${p.price}$</p>
                <button class="btn" style="background:var(--noir-black); color:#fff;" onclick="addToCart(${p.id})">إضافة للحقيبة</button>
            </div>
        </div>
    `,
    )
    .join("");
}

function addToCart(id) {
  const p = products.find((x) => x.id === id);
  const item = cart.find((x) => x.id === id);
  item ? item.qty++ : cart.push({ ...p, qty: 1 });

  // اهتزاز السلة السفلية
  const bar = document.getElementById("cart-bar");
  bar.classList.add("shake");
  setTimeout(() => bar.classList.remove("shake"), 400);

  updateUI();
}

function updateUI() {
  const list = document.getElementById("cart-items-list");
  let subtotal = 0,
    count = 0;

  list.innerHTML = cart
    .map((i) => {
      subtotal += i.price * i.qty;
      count += i.qty;
      return `
            <div class="cart-item">
                <img src="${i.image}">
                <div style="flex:1"><h4>${i.title}</h4><p>${i.price}$</p></div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button class="qty-btn btn-minus" onclick="changeQty(${i.id}, -1)">-</button>
                    <span>${i.qty}</span>
                    <button class="qty-btn btn-plus" onclick="changeQty(${i.id}, 1)">+</button>
                </div>
            </div>`;
    })
    .join("");

  const final = (subtotal * (1 - discount)).toFixed(2);
  document.getElementById("total-amount").innerText = final;
  document.getElementById("cart-bar-total").innerText = final;
  document.getElementById("cart-count").innerText = count;
}

function changeQty(id, v) {
  const i = cart.find((x) => x.id === id);
  i.qty += v;
  if (i.qty < 1) cart = cart.filter((x) => x.id !== id);
  updateUI();
}

// ميزة مشاركة الموقع
function getLocation() {
  const btn = document.getElementById("location-btn");
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحديد موقعك...';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        userLocation = `https://www.google.com/maps?q=${lat},${lon}`;
        btn.innerHTML =
          '<i class="fas fa-check-circle"></i> تم تحديد الموقع بنجاح';
        btn.classList.add("success");
      },
      () => {
        alert("تعذر الوصول للموقع، يرجى تفعيل الـ GPS");
        btn.innerHTML =
          '<i class="fas fa-location-arrow"></i> تحديد موقع التوصيل';
      },
    );
  } else {
    alert("متصفحك لا يدعم خاصية تحديد الموقع");
  }
}

function checkoutWhatsApp() {
  if (cart.length === 0) return alert("السلة فارغة!");

  let msg = "🛒 *طلب جديد من متجر NOIR*\n━━━━━━━━━━━━━━\n";
  cart.forEach(
    (i) => (msg += `• ${i.title} (x${i.qty}) = ${i.price * i.qty}$\n`),
  );
  msg += `━━━━━━━━━━━━━━\n💰 *الإجمالي النهائي:* ${document.getElementById("total-amount").innerText}$`;

  // إضافة رابط الموقع إذا وجد
  if (userLocation) {
    msg += `\n📍 *موقع التوصيل:* ${userLocation}`;
  } else {
    msg += `\n⚠️ _لم يتم تحديد الموقع_`;
  }

  window.open(`https://wa.me/96176648215?text=${encodeURIComponent(msg)}`);

  // تصفير السلة بعد الإرسال
  setTimeout(() => {
    cart = [];
    userLocation = ""; // تصفير الموقع لطلب جديد
    const btn = document.getElementById("location-btn");
    btn.innerHTML = '<i class="fas fa-location-arrow"></i> تحديد موقع التوصيل';
    btn.classList.remove("success");
    updateUI();
    toggleCart();
  }, 1500);
}

function applyCoupon() {
  if (
    document.getElementById("couponInput").value.toUpperCase() === "DDNOIR20"
  ) {
    discount = 0.2;
    alert("🎁 مبروك! حصلت على خصم 20%");
  } else {
    discount = 0;
    alert("الكود غير صحيح");
  }
  updateUI();
}

function toggleCart() {
  document.getElementById("side-cart").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("active");
}

function searchProducts() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  displayProducts(products.filter((p) => p.title.toLowerCase().includes(term)));
}

function filterData(cat, b) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((t) => t.classList.remove("active"));
  b.classList.add("active");
  displayProducts(
    cat === "all" ? products : products.filter((p) => p.category === cat),
  );
}

function clearCart() {
  if (confirm("هل تريد إفراغ سلة المشتريات؟")) {
    cart = [];
    updateUI();
  }
}

window.onload = () => displayProducts(products);
