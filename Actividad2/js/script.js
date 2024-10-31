// Variables globales
let cart = [];
let subtotal = 0;

// Mostrar/Ocultar carrito
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
}
// Función para agregar al carrito
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

// Función para actualizar la interfaz del carrito
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    subtotal = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div>
                <h5>${item.title}</h5>
                <p>$${item.price.toLocaleString('en-US')}</p>
                <div>
                    <button class="btn-decrease" onclick="decreaseQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-increase" onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>
            <button class="btn-danger" onclick="confirmRemoval(${item.id})">Eliminar</button>
        `;
        cartItemsContainer.appendChild(cartItem);
        subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    document.getElementById('subtotal-price').innerText = `$${subtotal.toLocaleString('en-US')}`;
    document.getElementById('tax-price').innerText = `$${tax.toLocaleString('en-US')}`;
    document.getElementById('total-price').innerText = `$${total.toLocaleString('en-US')}`;

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;
}

// Agregar evento a los botones de agregar al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productElement = button.closest('.item');
        const product = {
            id: parseInt(productElement.dataset.id),
            title: productElement.querySelector('.titulo-item').innerText,
            price: parseFloat(
                productElement.querySelector('.precio-item strong').innerText.replace('$', '').replace(',', '')
            ),
            image: productElement.querySelector('.img-item').src,
        };
        addToCart(product);
    });
});

// Animación para reordenamiento de productos
document.getElementById('search-bar').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const items = Array.from(document.querySelectorAll('.item'));
    const itemsContainer = document.querySelector('.contenedor-items');

    const filteredItems = items
        .map(item => {
            const title = item.querySelector('.titulo-item').innerText.toLowerCase();
            return { element: item, matches: title.includes(searchTerm) };
        })
        .sort((a, b) => b.matches - a.matches);

    // Agregar animación con `opacity` y `transform`
    itemsContainer.innerHTML = '';
    filteredItems.forEach(({ element, matches }) => {
        element.classList.add('fade-in');
        element.classList.toggle('hidden', !matches); // Oculta los no coincidentes
        itemsContainer.appendChild(element);
    });
});

// Funciones para aumentar/disminuir la cantidad
function decreaseQuantity(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            removeFromCart(productId);
        }
        updateCartUI();
    }
}

function increaseQuantity(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart[index].quantity++;
        updateCartUI();
    }
}

function confirmRemoval(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        removeFromCart(productId);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Evento para aplicar descuento
document.getElementById('apply-discount').addEventListener('click', function () {
    const discountCode = document.getElementById('discount-code').value;
    if (discountCode === 'DESCUENTO10') {
        const discountAmount = subtotal * 0.10;
        subtotal -= discountAmount;
        updateCartUI();
        alert('Código de descuento aplicado');
    } else {
        alert('Código de descuento no válido');
    }
});

// Función de checkout
function proceedToCheckout() {
    alert('Procediendo a la compra...');
}
