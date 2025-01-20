class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        const cartIcon = document.querySelector('.cart-icon');
        const cartSidebar = document.querySelector('.cart-sidebar');
        const closeCart = document.querySelector('.close-cart');
        const checkoutBtn = document.querySelector('.checkout-btn');
        const checkoutModal = document.querySelector('.checkout-modal');

        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });

        const buyButtons = document.querySelectorAll('.buy-button');
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const product = e.target.closest('.product-card');
                const productData = {
                    id: product.dataset.id,
                    name: product.querySelector('h3').textContent,
                    price: parseFloat(product.dataset.price),
                    image: product.querySelector('img').src,
                    quantity: 1
                };
                this.addItem(productData);
            });
        });

        checkoutBtn.addEventListener('click', () => {
            if (this.items.length === 0) {
                this.showNotification('Vaša korpa je prazna');
                return;
            }
            checkoutModal.style.display = 'flex';
            cartSidebar.classList.remove('active');
        });

        const checkoutForm = document.getElementById('checkout-form');
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(checkoutForm);
            const orderData = {
                items: this.items,
                total: this.total,
                customer: Object.fromEntries(formData)
            };
            
            this.sendOrderEmail(orderData);

            this.items = [];
            this.updateCart();
            checkoutModal.style.display = 'none';
            this.showNotification('Uspešno ste poslali porudžbinu!');
            checkoutForm.reset();
        });

        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.style.display = 'none';
            }
        });
    }

    async sendOrderEmail(orderData) {
        try {
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderData })
            });
    
            if (response.ok) {
                window.location.href = 'success.html';
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Došlo je do greške prilikom slanja porudžbine.');
        }
    }
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(product);
        }
        this.updateCart();
        this.showNotification('Proizvod dodat u korpu');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCart();
        this.showNotification('Proizvod uklonjen iz korpe');
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.updateCart();
        }
    }

    updateCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalAmount = document.querySelector('.total-amount');

        const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalQuantity;

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price} RSD</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `).join('');

        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `${this.total.toFixed(2)} RSD`;

        this.addCartItemListeners();
    }

    addCartItemListeners() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                this.removeItem(productId);
            });
        });

        document.querySelectorAll('.quantity-controls').forEach(control => {
            const input = control.querySelector('.quantity-input');
            const minusBtn = control.querySelector('.minus');
            const plusBtn = control.querySelector('.plus');
            const productId = control.closest('.cart-item').dataset.id;

            minusBtn.addEventListener('click', () => {
                const newQuantity = parseInt(input.value) - 1;
                if (newQuantity >= 1) {
                    this.updateQuantity(productId, newQuantity);
                }
            });

            plusBtn.addEventListener('click', () => {
                const newQuantity = parseInt(input.value) + 1;
                this.updateQuantity(productId, newQuantity);
            });

            input.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity >= 1) {
                    this.updateQuantity(productId, newQuantity);
                }
            });
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

const cart = new ShoppingCart();
