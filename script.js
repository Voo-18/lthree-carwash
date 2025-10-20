// Pembayaran Paket
document.querySelectorAll(".bayar-paket").forEach((btn) => {
  btn.addEventListener("click", function () {
    const paket = this.dataset.paket;
    document.getElementById("paket-nama").innerText = paket;
    document.getElementById("modal-paket").style.display = "flex";
  });
});

document.getElementById("close-modal-paket").onclick = function () {
  document.getElementById("modal-paket").style.display = "none";
};

document.getElementById("btn-bayar-paket").onclick = function () {
  document.getElementById("modal-paket").style.display = "none";
  alert(
    "✅ Pembayaran berhasil!\n\nTerima kasih, paket Anda sudah dikonfirmasi."
  );
};
// =====================
// SHINE & DRIVE WEBSITE
// =====================

// 🌙 Mode gelap otomatis (berdasarkan waktu)
const hour = new Date().getHours();
if (hour >= 18 || hour < 6) {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

// 🌈 Smooth Scroll untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.startsWith("#") && targetId.length > 1) {
      e.preventDefault();
      document.querySelector(targetId).scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// 🎉 Animasi saat scroll (fade in setiap section)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document
  .querySelectorAll("section")
  .forEach((section) => observer.observe(section));

// Booking form kembali ke alert sederhana
const bookingForm = document.querySelector("form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name =
      bookingForm.querySelector("input[placeholder='Brev Secencoiz']")?.value ||
      "";
    const date = bookingForm.querySelector("input[type='date']")?.value || "";
    const time = bookingForm.querySelector("input[type='time']")?.value || "";
    alert(
      `✅ Booking Berhasil!\n\nTerima kasih, ${name}.\nJadwal Anda: ${date} pukul ${time}.\n\nKami akan menghubungi Anda via WhatsApp untuk konfirmasi.`
    );
    bookingForm.reset();
  });
}

// 🔝 Tombol scroll ke atas
const scrollTopBtn = document.createElement("button");
scrollTopBtn.innerText = "⬆️";
scrollTopBtn.className = "scroll-top";
document.body.appendChild(scrollTopBtn);

window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 400 ? "block" : "none";
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =====================
// Toast & Quick Booking
// =====================

// Buat elemen toast sekali saja
const toast = document.createElement("div");
toast.className = "toast";
toast.innerHTML = `
  <div class="message"><strong>Booking</strong> — Mau langsung booking atau isi form?</div>
  <div class="actions">
    <button class="btn" data-action="open-form">Isi Form</button>
    <button class="btn" data-action="quick-book">Booking Cepat</button>
  </div>
`;
document.body.appendChild(toast);

let toastTimer = null;
function showToast(duration = 6000) {
  clearTimeout(toastTimer);
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
}

function hideToast() {
  clearTimeout(toastTimer);
  toast.classList.remove("show");
}

// Handler untuk tombol di header
const bookingNowBtn = document.querySelector("#booking-now");
if (bookingNowBtn) {
  bookingNowBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showToast();
  });
}

// Actions inside toast
toast.addEventListener("click", (e) => {
  const action = e.target.closest("button")?.dataset?.action;
  if (!action) return;

  if (action === "open-form") {
    hideToast();
    const formEl = document.querySelector("#booking");
    if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
  }

  if (action === "quick-book") {
    hideToast();
    // Prefill form (jika ada) dan submit
    if (bookingForm) {
      const nameInput = bookingForm.querySelector("input[type='text']");
      const dateInput = bookingForm.querySelector("input[type='date']");
      const timeInput = bookingForm.querySelector("input[type='time']");

      if (nameInput) nameInput.value = "Nama Pelanggan";
      if (dateInput) {
        const d = new Date();
        d.setDate(d.getDate() + 1); // default besok
        dateInput.valueAsDate = d;
      }
      if (timeInput) timeInput.value = "10:00";

      // Trigger submit programmatically
      bookingForm.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    } else {
      alert("Form booking tidak ditemukan.");
    }
  }
});

// =====================
// Maps actions
// =====================

// Business coordinates (contoh) — ganti ke koordinat bisnis Anda
const openGmapsBtn = document.querySelector("#open-gmaps");
if (openGmapsBtn) {
  openGmapsBtn.addEventListener("click", () => {
    // Buka Google Maps langsung ke link yang diberikan user
    window.open("https://maps.app.goo.gl/Ssdwj1xaXm42VJUFA", "_blank");
  });
}

const myLocationBtn = document.querySelector("#my-location");
if (myLocationBtn) {
  myLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung di browser ini.");
      return;
    }

    myLocationBtn.disabled = true;
    myLocationBtn.innerText = "Mencari...";

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${businessLat},${businessLng}&travelmode=driving`;
        window.open(url, "_blank");
        myLocationBtn.disabled = false;
        myLocationBtn.innerText = "Lokasi Saya";
      },
      (err) => {
        myLocationBtn.disabled = false;
        myLocationBtn.innerText = "Lokasi Saya";
        console.error("Geolocation error:", err);
        let msg = "Gagal mendapatkan lokasi.\n";
        if (err.code === 1) {
          msg += "Akses lokasi ditolak. Aktifkan izin lokasi di browser Anda.";
        } else if (err.code === 2) {
          msg +=
            "Lokasi tidak tersedia. Coba lagi di area dengan sinyal lebih baik.";
        } else if (err.code === 3) {
          msg += "Permintaan lokasi terlalu lama. Coba ulangi.";
        } else {
          msg += err.message;
        }
        msg +=
          "\nPastikan browser Anda mendukung geolocation dan izin lokasi diaktifkan.";
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// =====================
// 🕒 TOAST BOOKING DENGAN SUARA + PROGRESS BAR
// =====================
const bookingFormToast = document.querySelector("form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name =
      bookingForm.querySelector("input[type='text']")?.value || "Pelanggan";
    const date = bookingForm.querySelector("input[type='date']")?.value || "-";
    const time = bookingForm.querySelector("input[type='time']")?.value || "-";

    document.querySelectorAll(".toast-booking").forEach((t) => t.remove());

    const toast = document.createElement("div");
    toast.className = "toast toast-booking show";
    toast.innerHTML = `
      <div class="toast-icon">🕒</div>
      <div class="toast-body">
        <strong>Booking Berhasil!</strong>
        <p>Terima kasih, <b>${name}</b>.<br>
        Jadwal kamu: <b>${date}</b> pukul <b>${time}</b>.<br>
        Kami akan menghubungi kamu via WhatsApp 💬</p>
      </div>
      <button class="toast-close">&times;</button>
      <div class="toast-progress"></div>
    `;
    document.body.appendChild(toast);

    const sound = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_6d37c6617c.mp3?filename=notification-5-198273.mp3"
    );
    sound.volume = 0.4;
    sound.play().catch(() => {});

    const progress = toast.querySelector(".toast-progress");
    progress.style.width = "100%";
    setTimeout(() => {
      progress.style.width = "0%";
    }, 100);

    setTimeout(() => toast.classList.remove("show"), 6000);

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.classList.remove("show");
    });

    bookingForm.reset();
  });
}

// =====================
// ⭐ COUNT-UP ULASAN
// =====================
window.addEventListener("DOMContentLoaded", () => {
  const ratingEl = document.querySelector(".rating");
  const reviewsEl = document.querySelector(".reviews");

  if (!ratingEl || !reviewsEl) return;

  const targetRating = parseFloat(ratingEl.dataset.target);
  const targetReviews = parseInt(reviewsEl.dataset.target);
  let currentRating = 0;
  let currentReviews = 0;

  // Animasi rating (contoh: 0 → 4.9)
  const ratingInterval = setInterval(() => {
    currentRating += 0.05;
    if (currentRating >= targetRating) {
      currentRating = targetRating;
      clearInterval(ratingInterval);
    }
    ratingEl.textContent = currentRating.toFixed(1);
  }, 50);

  // Animasi reviews (contoh: 0 → 2500)
  const reviewsInterval = setInterval(() => {
    currentReviews += 40;
    if (currentReviews >= targetReviews) {
      currentReviews = targetReviews;
      clearInterval(reviewsInterval);
    }
    reviewsEl.textContent = currentReviews.toLocaleString("id-ID");
  }, 25);
});

// =====================
// 💳 PEMBAYARAN PAKET DENGAN TOAST
// =====================

// Ambil elemen modal dan komponennya
const modalPaket = document.getElementById("modal-paket");
const modalClose = document.getElementById("close-modal-paket");
const modalConfirm = document.getElementById("btn-bayar-paket");
const paketNama = document.getElementById("paket-nama");

// Buat elemen toast satu kali di DOM
const payToast = document.createElement("div");
payToast.className = "toast toast-success";
payToast.innerHTML = `
  <div class="toast-icon">💳</div>
  <div class="toast-body">
    <strong>Pembayaran Berhasil!</strong>
    <p>Terima kasih telah menggunakan layanan <b>L three Car Wash</b>. Pesanan Anda sedang diproses!</p>
  </div>
  <button class="toast-close">&times;</button>
`;
document.body.appendChild(payToast);

// Tampilkan modal pembayaran
function showModal(paket) {
  paketNama.innerText = paket;
  modalPaket.style.display = "flex";
  modalPaket.classList.add("fade-in");
  modalPaket.classList.remove("fade-out");
}

// Tutup modal dengan animasi
function hideModal() {
  modalPaket.classList.remove("fade-in");
  modalPaket.classList.add("fade-out");
  setTimeout(() => {
    modalPaket.style.display = "none";
  }, 300);
}

// Tampilkan toast sukses
function showPayToast() {
  payToast.classList.add("show");
  setTimeout(() => payToast.classList.remove("show"), 5000);
}

// Tutup toast manual
payToast.querySelector(".toast-close").addEventListener("click", () => {
  payToast.classList.remove("show");
});

// Klik tombol bayar paket → tampilkan modal
document.querySelectorAll(".bayar-paket").forEach((btn) => {
  btn.addEventListener("click", () => {
    const paket = btn.dataset.paket;
    showModal(paket);
  });
});

// Klik tombol close modal (X)
modalClose.addEventListener("click", hideModal);

// Klik “Konfirmasi Pembayaran” → tutup modal → tampilkan toast
modalConfirm.addEventListener("click", () => {
  hideModal();
  setTimeout(() => showPayToast(), 400); // tampil setelah modal tertutup
});

// Entrance animation: staggered reveal for hero + service cards
document.addEventListener('DOMContentLoaded', function () {
  // Jika user memilih reduced motion, langsung tampil tanpa animasi
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('is-loaded');
    return;
  }

  // set stagger delays for service cards
  var cards = document.querySelectorAll('.card.service');
  cards.forEach(function (card, i) {
    var delay = 220 + i * 80; // base 220ms + 80ms per card
    card.style.transitionDelay = delay + 'ms';
  });

  // optional: small delay for hero (handled by CSS default 120ms), ensure repaint then add class
  window.requestAnimationFrame(function () {
    // slight timeout so transitionDelay assignments take effect
    setTimeout(function () {
      document.documentElement.classList.add('is-loaded');
    }, 8);
  });
});
