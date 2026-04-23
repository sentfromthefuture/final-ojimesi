const SUPABASE_URL = "https://wbmcbtgmnolubmmximhe.supabase.co";
const SUPABASE_KEY = "sb_publishable_FLQYoCXqT_s9cYscvty_2A_2nd0c5I4";

async function loadProducts() {
  const productsContainer = document.getElementById("products");

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/items?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    const products = await res.json();
    console.log(products);

    displayProducts(products);
    renderExoticTrees(products);
    renderFruit_trees(products);
    renderShade_trees(products);
    renderNative_trees(products);
    renderConiferous_trees(products);
    renderOrnamental_trees(products);
    renderFlowering_trees(products);
    renderEvergreen_trees(products);
  } catch (error) {
    console.error("Failed to load or render products:", error);

    if (productsContainer) {
      productsContainer.innerHTML = `<p>Items failed to load: ${error.message}</p>`;
    }
  }
}

function displayProducts(products) {
  const container = document.getElementById("products");

  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <div class ="card">
        <img src="${product.image_url}"  width="150" />
        <h3>${product.name}</h3>
        <p>K${product.price}</p>
        <button onclick='addToCart(${JSON.stringify(product)})'>
          Add to Cart
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

function renderExoticTrees(products) {
  const container = document.getElementById("exotic-container");

  if (!container) return;

  const exotic = products.filter((p) => p.category === "exotic_trees");

  container.innerHTML = exotic
    .map(
      (p) => `
        <div class="card">
          <img src="${p.image_url}"  />
          <h4>${p.name}</h4>
          <p>K${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `
    )
    .join("");
}

function renderFruit_trees(products) {
  const container = document.getElementById("Fruit_trees-container");

  if (!container) return;

  const fruitTrees = products.filter((p) => p.category === "fruit_trees");

  container.innerHTML = fruitTrees
    .map(
      (p) => `
        <div class="card">
          <img src="${p.image_url}"  />
          <h4>${p.name}</h4>
          <p>K${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `
    )
    .join("");
}

function renderShade_trees(products) {
  const container = document.getElementById("shade_trees-container");

  if (!container) return;

  const Shade_trees = products.filter((p) => p.category === "shade_trees");

  container.innerHTML = Shade_trees
    .map(
      (p) => `
        <div class="card">
          <img src="${p.image_url}"  />
          <h4>${p.name}</h4>
          <p>K${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `
    )
    .join("");
}
function renderNative_trees(products) {
  const container = document.getElementById("native-container");

  if (!container) return;

  const nativeTrees = products.filter((p) => p.category === "native_trees");

  container.innerHTML = nativeTrees
    .map(
      (p) => `
        <div class="card">
          <img src="${p.image_url}"  />
          <h4>${p.name}</h4>
          <p>K${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `
    )
    .join("");
}
function renderConiferous_trees(products) {
  const container = document.getElementById("coniferous_trees-container");

  if (!container) return;

  const coniferousTrees = products.filter((p) => p.category === "coniferous_trees");

  container.innerHTML = coniferousTrees
    .map(
      (p) => `
        <div class="card">
          <img src="${p.image_url}"  />
          <h4>${p.name}</h4>
          <p>K${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `
    )
    .join("");
}
function renderOrnamental_trees(products) {
  const container = document.getElementById("ornamental_trees-container");

  if (!container) return;

  const OrnamentalTrees = products.filter((p) => p.category === "ornamental_trees");

  container.innerHTML = OrnamentalTrees
    .map(
      (p) => `
        <div class="card">
          <img src="${p.image_url}"  />
          <h4>${p.name}</h4>
          <p>K${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `
    )
    .join("");
}
function renderEvergreen_trees(products) {
  const container = document.getElementById("evergreen_trees-container");

  if (!container) return;

  const EvergreenTrees = products.filter((p) => p.category === "evergreen_trees");

  container.innerHTML = EvergreenTrees
    .map(
      (p) => `
        <div class="card">
          <img src="${p.image_url}" />
          <h4>${p.name}</h4>
          <p>K${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `
    )
    .join("");
}
function renderFlowering_trees(products) {
  const container = document.getElementById("flowering_trees-container");

  if (!container) return;

  const FloweringTrees = products.filter((p) => p.category === "flowering_trees");

  container.innerHTML = FloweringTrees
    .map(
      (p) => `
        <div class="card">
          <img src="${p.image_url}"/>
          <h4>${p.name}</h4>
          <p>K${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `
    )
    .join("");
}
function addToCart(product) {
  Cart.addItem(product.id, product.name, product.price, product.image_url);
}
function cartAlert(action, name) {
  const msg = action === 'add' ? `✅ ${name} added to cart!` : `🗑️ ${name} removed from cart.`;
  const alert = document.createElement('div');
  alert.textContent = msg;
  alert.style.cssText = `
    position:fixed; bottom:20px; right:20px; z-index:9999;
    background:${action === 'add' ? '#2d6a4f' : '#9b2226'};
    color:#fff; padding:12px 20px; border-radius:8px;
    font-size:14px; box-shadow:0 4px 12px rgba(0,0,0,0.2);
    transition: opacity 0.4s ease;
  `;
  document.body.appendChild(alert);
  setTimeout(() => { alert.style.opacity = '0'; }, 2000);
  setTimeout(() => { alert.remove(); }, 2400);
}
loadProducts();
