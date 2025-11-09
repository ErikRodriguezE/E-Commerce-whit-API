const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.querySelector('.login-btn'); 
const closeLoginBtn = document.querySelector('.close-btn'); 
const loginBtn = document.getElementById('login-btn');
const divUser = document.getElementById('divUser');
const btnLogin = document.getElementById('btnLogin');

let LoginConfirm = false;
const cart = new Map();
//logica de ligin de usuario
async function loginUser() {
  try {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const data = await response.json();

    if (data.accessToken) {
    localStorage.setItem('authToken', data.accessToken);
    LoginConfirm = true;
    setUserNameCard(data.firstName,data.image);
    if (typeof closeModal === 'function') closeModal();
    } else {
    console.error('Inicio de sesión fallido, sin token recibido.', data);
    }

  } catch (error) {
    console.error('Error con el API:', error);
  }
}
//muestra el nombre y foto de perfil del usuario y muestra el icono del carro
function setUserNameCard(userName, imgUser){
    btnLogin.remove();
    divUser.innerHTML = `
    <div class="carrito-contenedor">
        <img src="media/carrito.png" alt="" class="carrito">
        <span id="cart-counter" class="contador-carrito">${obtenerTotalArticulos()}</span>

        ${getCartDropdownHTML()}
    </div>

    <h3>${userName}</h3>
    <img src="${imgUser}" alt="" class="carrito">
    `;
    setupCartListeners();
}
//boton para logearse
if (loginBtn) {
  loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    loginUser();
  });
}
//el dropDown del carrito
function getCartDropdownHTML() {
    return `
        <div id="cart-dropdown" class="cart-dropdown">
            <div class="cart-arrow"></div> 
            <div class="cart-items-container">
                <p class="empty-name-message">${carProducts()}</p>
                <p class="cantidad">${carTotal()}</p>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span class="totalCarrito">Total:</span>
                    <strong class="totalPagar" id="cart-total-value">$${totalPriceCart()}</strong>
                </div>
                <button id="checkout-btn" class="checkout-btn">Ir a Pagar</button>
            </div>
        </div>
    `;
}



//carrito y descripciones




const closeProductModalBtn = document.querySelector('.close-btn.product-close-btn');
const btnAgregar = document.getElementById('add-to-cart-modal-btn');
const productModal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-product-title');
const modalImage = document.getElementById('modal-product-image');
const modalPrice = document.getElementById('modal-product-price');
const modalDescription = document.getElementById('modal-product-description');
const qtyDisplay = document.getElementById('modal-product-qty');
const qtyWrapper = document.querySelector('.quantity-wrapper');
let currentQty = 1; 
let currentProductId = null;
let productId = 0;

//agrega al map de cart
function addToCart(productId, cantidad) {
    if(cart.has(productId)){
        const cantidadActual = cart.get(productId);
        cart.set(productId, cantidadActual + cantidad);
    }
    else{
        cart.set(productId, cantidad);
    }
    actualizarContadorCarrito();
}
//calcula el total de objetos del carrito
function obtenerTotalArticulos() {
    let total = 0;
    for (const cantidad of cart.values()) {
        total += cantidad;
    }
    return total;
}
//calcula el total a pagar
function totalPriceCart(){
    let total = 0;
    cart.forEach((cantidad, productId) => {
        const price = pricesElements.get(productId);
        total += cantidad * price;
    });
    return total.toFixed(2);
}
//guarda la lista de elentos
function carProducts(){
    if(cart.size ===0){
        return "Tu carrito está vacío.";
    }
    const productNamesInCart = [];
    cart.forEach((cantidad,productId) => {
        const name = productsName.get(productId);
        if (name) {
            productNamesInCart.push(name);
        }
    })
    const productString = productNamesInCart.join('\n\n')
    return productString;
}
//calcula la cantidad de cada elemento
function carTotal(){
    if(cart.size ===0){
        return "";
    }
    const limite = 59;
    const carQuantities = [];   
    cart.forEach((cantidad, productId) => {
        const name = productsName.get(productId);       
        const cantidadString = String(cantidad);         
        if (name && name.length > limite) {
            carQuantities.push(cantidadString + '\n');
            
        } else {
            carQuantities.push(cantidadString);
        }
    });
    
    const productString = carQuantities.join('\n\n');
    
    return productString;
}
function actualizarContadorCarrito() {
    const counterElement = document.getElementById('cart-counter');
    const cartItemsContainer = document.querySelector('.totalPagar');
    const nameElements = document.querySelector('.empty-name-message');
    const cantidadElements = document.querySelector('.cantidad');
    if (counterElement) {
        nameElements.textContent = carProducts();
        cantidadElements.textContent = carTotal();
        counterElement.textContent = obtenerTotalArticulos(); 
        cartItemsContainer.textContent = totalPriceCart();
    }
}


//muestra el carro
function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cart-dropdown');
    if (cartDropdown) {
        cartDropdown.classList.toggle('visible'); 
    }
}
//llama el metodo de mostrar el carro
function setupCartListeners() {
    const carritoIcono = divUser.querySelector('.carrito-contenedor');    
    if (carritoIcono) {
        carritoIcono.addEventListener('click', () => {
             toggleCartDropdown();
        });
    }
}
//logica de apretar el boton de agregar
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('product-btn')) {
        if(!LoginConfirm){
            return openModal();
        }
        modalTitle.textContent = productsName.get(Number(event.target.dataset.productId));
        modalImage.src = productsImage.get(Number(event.target.dataset.productId));
        modalPrice.textContent = pricesElements.get(Number(event.target.dataset.productId));
        productModal.classList.add('active');
        modalDescription.textContent = customDescriptions.get(Number(event.target.dataset.productId));
        productId = event.target.dataset.productId;
    }
});
// Logica para sumar o restar la cantidad
if (qtyWrapper) {
    qtyWrapper.addEventListener('click', (event) => {
        const target = event.target;
        
        // Verifica que el clic fue en un botón de cantidad
        if (target.classList.contains('qty-btn')) {
            const action = target.dataset.action;
            
            if (action === 'increase') {
                currentQty++;
            } else if (action === 'decrease' && currentQty > 1) {
                // No permitir cantidades negativas o cero en la vista
                currentQty--;
            }

            // 4. Actualizar el número en la pantalla
            qtyDisplay.textContent = currentQty;
        }
    });
}
//logica que agrega al carrito
if (btnAgregar) {
    btnAgregar.addEventListener('click', () => {
        addToCart(Number(productId), Number(qtyDisplay.textContent));
        closeProductModal();
    });
}
//cierra la ventana de descripciones
function closeProductModal() {
    productModal.classList.remove('active');
    qtyDisplay.textContent = 1;
}
if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener('click', closeProductModal);
}


// Función para abrir el modal del login
function openModal() {
    loginModal.classList.add('active');
}
// Función para cerrar el modal de login
function closeModal() {
    loginModal.classList.remove('active');
}

//Abrir modal al hacer clic en el botón del login
if (openLoginBtn) {
    openLoginBtn.addEventListener('click', openModal);
}

//Cerrar modal al hacer clic en la 'x'
if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', closeModal);
}
