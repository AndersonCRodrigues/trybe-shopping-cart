// Esse tipo de comentário que estão antes de todas as funções são chamados de JSdoc,
// experimente passar o mouse sobre o nome das funções e verá que elas possuem descrições!
// Fique a vontade para modificar o código já escrito e criar suas próprias funções!
const cartItems = document.querySelector('.cart__items');
const cartBtn = document.querySelector('.empty-cart');

/**
 * Função responsável por criar e retornar o elemento de imagem do produto.
 * @param {string} imageSource - URL da imagem.
 * @returns {Element} Elemento de imagem do produto.
 */
const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

function loadingFetchItems() {
  const items = document.querySelector('.items');
  const load = document.createElement('span');
  load.className = 'loading';
  load.innerText = 'carregando...';
  items.appendChild(load);
}

function loadedFetchItems() {
  const items = document.querySelector('.items');
  const load = document.querySelector('.loading');
  items.removeChild(load);
}

/**
 * Função responsável por criar e retornar qualquer elemento.
 * @param {string} element - Nome do elemento a ser criado.
 * @param {string} className - Classe do elemento.
 * @param {string} innerText - Texto do elemento.
 * @returns {Element} Elemento criado.
 */
const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

/**
 * Função responsável por criar e retornar o elemento do produto.
 * @param {Object} product - Objeto do produto.
 * @param {string} product.id - ID do produto.
 * @param {string} product.title - Título do produto.
 * @param {string} product.thumbnail - URL da imagem do produto.
 * @returns {Element} Elemento de produto.
 */
const createProductItemElement = ({ id, title, thumbnail }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item_id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

/**
 * Função que recupera o ID do produto passado como parâmetro.
 * @param {Element} product - Elemento do produto.
 * @returns {string} ID do produto.
 */
const getIdFromProductItem = (product) => product.querySelector('span.id').innerText;

/**
 * Função responsável por criar e retornar um item do carrinho.
 * @param {Object} product - Objeto do produto.
 * @param {string} product.id - ID do produto.
 * @param {string} product.title - Título do produto.
 * @param {string} product.price - Preço do produto.
 * @returns {Element} Elemento de um item do carrinho.
 */
function totalPrice() {
  const total = document.querySelector('.total-price');
  let value = 0;
  for (let i = 0; i < cartItems.children.length; i += 1) {
    value += Number.parseFloat(cartItems.children[i].dataset.price, 10);
  }
  total.innerHTML = value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

cartBtn.addEventListener('click', () => {
  cartItems.innerHTML = '';
  saveCartItems(cartItems.innerHTML);
  totalPrice();
});

 function cartItemClickListener(e) {
  cartItems.removeChild(e.target);
  totalPrice();
  saveCartItems(cartItems.innerHTML);
}

cartItems.addEventListener('click', cartItemClickListener);

const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.dataset.price = price;
  li.innerText = `ID: ${id} | TITLE: ${title} | PRICE: $${price}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
};

const loadCartFetch = async (prodId) => {
  const prod = createCartItemElement(await fetchItem(prodId));
  cartItems.appendChild(prod);
  saveCartItems(cartItems.innerHTML);
  totalPrice();
  // console.log(cartItems.children.length);
};

function getIdEvent(btns) {
  for (let i = 0; i < btns.length; i += 1) {
    btns[i].addEventListener('click', async (e) => {
      const id = (e.target.parentNode.firstChild.innerText);
      loadCartFetch(id);
    });
  }
}

const loadFetch = async () => {
  const { results } = await fetchProducts('computador');
  const items = document.querySelector('.items');
  results.forEach((product) => {
  items.appendChild(createProductItemElement(product));
  });
  loadedFetchItems();
  const itemBtn = document.querySelectorAll('.item__add');
  getIdEvent(itemBtn);
};

loadingFetchItems();

window.onload = () => {
  loadFetch();
  cartItems.innerHTML = getSavedCartItems();
  totalPrice();
};
