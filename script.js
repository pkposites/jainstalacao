document.getElementById('year').textContent = new Date().getFullYear();

window.dataLayer = window.dataLayer || [];

const WHATSAPP_NUMBER = '551150922446';

function trackConversion(eventName, extra) {
  window.dataLayer.push(Object.assign({ event: eventName }, extra || {}));
}

// Cliques diretos em links de WhatsApp e telefone (hero, fab, contatos diretos)
document.querySelectorAll('a[href*="wa.me"]:not(#modalCta):not(#reviewsCta)').forEach(link => {
  link.addEventListener('click', () => trackConversion('whatsapp_click', { link_location: link.closest('section, header, .fab-whatsapp')?.id || link.className }));
});
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => trackConversion('phone_click', { link_location: link.closest('section, header')?.id || link.className }));
});

const services = [
  {
    icon: '🚨',
    title: 'Encanador urgente',
    text: 'Atendimento de emergência para vazamentos, entupimentos e problemas hidráulicos que não podem esperar. Nossa equipe se desloca rapidamente até residências e prédios em São Paulo para resolver o problema com agilidade e segurança.'
  },
  {
    icon: '🔧',
    title: 'Consertos urgentes',
    text: 'Reparos em torneiras, registros, caixas d\'água, aquecedores e tubulações. Diagnóstico rápido e conserto feito com peças de qualidade, evitando retrabalho e novos problemas no futuro.'
  },
  {
    icon: '🚿',
    title: 'Desentupimentos',
    text: 'Desentupimento de pias, ralos, vasos sanitários, caixas de gordura e tubulações em geral. Usamos equipamentos adequados para resolver o entupimento sem danificar a estrutura hidráulica.'
  },
  {
    icon: '💧',
    title: 'Detecção de vazamentos',
    text: 'Localização precisa de vazamentos ocultos em paredes, pisos e tubulações, sem necessidade de quebra-quebra desnecessário. Economize tempo e dinheiro com um diagnóstico certeiro.'
  }
];

const carousel = document.getElementById('carousel');
const dotsWrap = document.getElementById('dots');
const cards = Array.from(carousel.querySelectorAll('.card'));

cards.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => {
    cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.children);

function updateActiveDot() {
  const center = carousel.scrollLeft + carousel.offsetWidth / 2;
  let closest = 0;
  let minDist = Infinity;
  cards.forEach((card, i) => {
    const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - center);
    if (dist < minDist) { minDist = dist; closest = i; }
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === closest));
}
carousel.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateActiveDot);
});

document.querySelector('.car-prev').addEventListener('click', () => {
  carousel.scrollBy({ left: -280, behavior: 'smooth' });
});
document.querySelector('.car-next').addEventListener('click', () => {
  carousel.scrollBy({ left: 280, behavior: 'smooth' });
});

const modalOverlay = document.getElementById('modalOverlay');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalCta = document.getElementById('modalCta');

function openModal(index) {
  const s = services[index];
  modalIcon.textContent = s.icon;
  modalTitle.textContent = s.title;
  modalText.textContent = s.text;
  const msg = encodeURIComponent(`Olá! Gostaria de solicitar o serviço: ${s.title}`);
  modalCta.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  modalOverlay.classList.add('open');
  trackConversion('service_modal_open', { service_name: s.title });
}
function closeModal() {
  modalOverlay.classList.remove('open');
}

cards.forEach(card => {
  card.addEventListener('click', () => openModal(Number(card.dataset.service)));
});
modalCta.addEventListener('click', () => trackConversion('whatsapp_click', { link_location: 'service_modal' }));
document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

const reviewsOverlay = document.getElementById('reviewsOverlay');
document.getElementById('openReviews').addEventListener('click', () => {
  reviewsOverlay.classList.add('open');
  trackConversion('reviews_modal_open');
});
document.getElementById('reviewsClose').addEventListener('click', () => reviewsOverlay.classList.remove('open'));
reviewsOverlay.addEventListener('click', (e) => {
  if (e.target === reviewsOverlay) reviewsOverlay.classList.remove('open');
});
document.getElementById('reviewsCta').addEventListener('click', () => trackConversion('whatsapp_click', { link_location: 'reviews_modal' }));

function encodeFormData(data) {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const service = document.getElementById('fservice').value;
  const region = document.getElementById('fregion').value.trim();

  // Envia os dados para o Netlify Forms, para consulta rápida no painel do Netlify
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeFormData({ 'form-name': 'contato', fname: name, fphone: phone, fservice: service, fregion: region })
  }).catch(() => {});

  const message = `Olá! Gostaria de solicitar um atendimento.\n\nNome: ${name}\nTelefone: ${phone}\nServiço: ${service}\nRegião: ${region}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  trackConversion('form_submit', { service_type: service, region: region });

  window.open(url, '_blank', 'noopener');
});
