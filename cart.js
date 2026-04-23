// cart.js — full cart logic

const Cart = (() => {
  let items = JSON.parse(localStorage.getItem('ojimesi-cart') || '[]');

  function save() {
    localStorage.setItem('ojimesi-cart', JSON.stringify(items));
  }

  function render() {
    const emptyMsg   = document.querySelector('.cart-empty');
    const cartList   = document.querySelector('.cart-items');
    const totalEl    = document.querySelector('.cart-summary__total');

    if (!cartList) return;

    cartList.innerHTML = '';

    if (items.length === 0) {
      emptyMsg?.style && (emptyMsg.style.display = '');
      cartList.style.display = 'none';
      if (totalEl) totalEl.textContent = 'K0.00';
      return;
    }

    emptyMsg?.style && (emptyMsg.style.display = 'none');
    cartList.style.display = '';

    let total = 0;

    items.forEach((item, index) => {
      total += item.price * item.qty;

      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <img src="${item.img || 'plant-thumb.jpg'}" alt="${item.name}" class="cart-item__img" />
        <div class="cart-item__details">
          <span class="cart-item__name">${item.name}</span>
          <span class="cart-item__price">K${(item.price * item.qty).toFixed(2)}</span>
        </div>
        <div class="cart-item__qty">
          <button aria-label="Decrease quantity" data-action="dec" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button aria-label="Increase quantity" data-action="inc" data-index="${index}">+</button>
        </div>
        <button class="cart-item__remove" aria-label="Remove ${item.name}" data-action="remove" data-index="${index}">✕</button>
      `;
      cartList.appendChild(li);
    });

    if (totalEl) totalEl.textContent = `K${total.toFixed(2)}`;
    updateBadge();
  }

  function updateBadge() {
    // Optional: show item count on nav Cart link
    const cartLink = document.querySelector('a[href="#Cart"], a[href="#cart"]');
    if (!cartLink) return;
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    cartLink.textContent = count > 0 ? `Cart (K{count})` : 'Cart';
  }

  function addItem(id, name, price, img = '') {
    const existing = items.find(i => i.id === id);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ id, name, price: parseFloat(price), img, qty: 1 });
    }
    save();
    cartAlert('add', name);
    render();
  }

  function handleCartClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const index  = parseInt(btn.dataset.index, 10);
    const action = btn.dataset.action;

    if (action === 'inc') {
      items[index].qty++;
    } else if (action === 'dec') {
      items[index].qty--;
      if (items[index].qty <= 0) items.splice(index, 1);
    } else if (action === 'remove') {
      items.splice(index, 1);
    }

    save();
    render();
  }

  function init() {
    const cartList = document.querySelector('.cart-items');
    cartList?.addEventListener('click', handleCartClick);

    document.querySelector('.cart-checkout')?.addEventListener('click', () => {
      alert('Checkout coming soon!');
    });

    render(); // render on page load (restores from localStorage)
  }

  return { init, addItem };
})();

document.addEventListener('DOMContentLoaded', () => Cart.init());