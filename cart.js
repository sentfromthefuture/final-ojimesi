// cart.js — full cart logic

const Cart = (() => {
  let items = JSON.parse(localStorage.getItem('ojimesi-cart') || '[]');

  function save() {
    localStorage.setItem('ojimesi-cart', JSON.stringify(items));
  }

  function render() {
    const emptyMsg = document.querySelector('.cart-empty');
    const cartList = document.querySelector('.cart-items');
    const totalEl  = document.querySelector('.cart-summary__total');

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
    const cartLink = document.querySelector('a[href="#Cart"], a[href="#cart"]');
    if (!cartLink) return;
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    cartLink.textContent = count > 0 ? `Cart (${count})` : 'Cart';
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
    const removedName = items[index].name;

    if (action === 'inc') {
      items[index].qty++;
    } else if (action === 'dec') {
      items[index].qty--;
      if (items[index].qty <= 0) {
        cartAlert('remove', removedName);
        items.splice(index, 1);
      }
    } else if (action === 'remove') {
      cartAlert('remove', removedName);
      items.splice(index, 1);
    }

    save();
    render();
  }

  function init() {
    const cartList = document.querySelector('.cart-items');
    cartList?.addEventListener('click', handleCartClick);
    render();
  }

  return { init, addItem };
})();

// Checkout — on document so it only attaches once, never duplicates
document.addEventListener('click', async (e) => {
  if (!e.target.matches('.cart-checkout')) return;

  const items = JSON.parse(localStorage.getItem('ojimesi-cart') || '[]');
  if (items.length === 0) return alert('Your cart is empty!');

  const contact = prompt('Enter your phone number to place order:');
  if (!contact) return;

  const payload = {
    contact,
    items: items.map(i => ({ id: i.id, qty: i.qty }))
  };

  try {
    const res = await fetch('https://wbmcbtgmnolubmmximhe.supabase.co/functions/v1/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndibWNidGdtbm9sdWJtbXhpbWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODA2NjEsImV4cCI6MjA5MjM1NjY2MX0.AZ1dfatnaouNww81-uII7ZZZWMqtwGYGaAGbuo87wfc`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      alert(`✅ Order placed! Total: K${data.order.total}`);
      localStorage.setItem('ojimesi-cart', '[]');
      Cart.init();
    } else {
      alert(`❌ Order failed: ${data.error}`);
    }
  } catch (err) {
    alert('Something went wrong. Please try again.');
  }
});

document.addEventListener('DOMContentLoaded', () => Cart.init());