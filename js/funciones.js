// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initCartSidebar();
    initProductActions();
    initTestimonialSlider();
    initCountdown();
    initNewsletterForm();
});

// Función para inicializar el menú móvil
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.overlay');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Cerrar menú al hacer clic en el overlay
        overlay.addEventListener('click', function() {
            menu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            cartSidebar.classList.remove('active');
        });

        // Cerrar menú al hacer clic en un enlace del menú
        const menuLinks = document.querySelectorAll('.menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

// Función para inicializar el carrito lateral
function initCartSidebar() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const viewCartBtn = document.querySelector('.view-cart-btn');

    if (cartIcon && cartSidebar) {
        // Abrir carrito
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });

        // Cerrar carrito
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });

        // Botones del carrito
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.items.length > 0) {
                    alert('Procesando el pago...');
                    // Aquí iría la redirección a la página de checkout
                } else {
                    alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
                }
            });
        }

        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', function() {
                alert('Redirigiendo a la página del carrito...');
                // Aquí iría la redirección a la página del carrito completo
            });
        }
    }
}

// Objeto para gestionar el carrito
const cart = {
    items: [],
    total: 0,
    
    // Añadir un producto al carrito
    addItem: function(id, name, price, image, quantity = 1) {
        // Comprobar si el producto ya está en el carrito
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: id,
                name: name,
                price: price,
                image: image,
                quantity: quantity
            });
        }
        
        this.updateCart();
    },
    
    // Eliminar un producto del carrito
    removeItem: function(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateCart();
    },
    
    // Actualizar la cantidad de un producto
    updateQuantity: function(id, quantity) {
        const item = this.items.find(item => item.id === id);
        
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                this.removeItem(id);
            }
            
            this.updateCart();
        }
    },
    
    // Calcular el total del carrito
    calculateTotal: function() {
        this.total = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        return this.total;
    },
    
    // Actualizar la visualización del carrito
    updateCart: function() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalAmount = document.querySelector('.total-amount');
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        
        // Actualizar contador del carrito
        const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
        cartCount.textContent = itemCount;
        
        // Mostrar mensaje de carrito vacío si no hay productos
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Tu carrito está vacío</div>';
            totalAmount.textContent = '$0.00';
            return;
        }
        
        // Ocultar mensaje de carrito vacío
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'none';
        }
        
        // Generar HTML para los productos del carrito
        let cartHTML = '';
        
        this.items.forEach(item => {
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-times"></i></button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        
        // Actualizar total
        totalAmount.textContent = '$' + this.calculateTotal().toFixed(2);
        
        // Añadir eventos a los botones de cantidad y eliminar
        this.addCartItemEvents();
    },
    
    // Añadir eventos a los elementos del carrito
    addCartItemEvents: function() {
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(item => {
            const id = item.dataset.id;
            const decreaseBtn = item.querySelector('.decrease');
            const increaseBtn = item.querySelector('.increase');
            const removeBtn = item.querySelector('.remove-item');
            
            decreaseBtn.addEventListener('click', () => {
                const currentItem = this.items.find(i => i.id === id);
                if (currentItem) {
                    this.updateQuantity(id, currentItem.quantity - 1);
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                const currentItem = this.items.find(i => i.id === id);
                if (currentItem) {
                    this.updateQuantity(id, currentItem.quantity + 1);
                }
            });
            
            removeBtn.addEventListener('click', () => {
                this.removeItem(id);
            });
        });
    },
    
    // Vaciar el carrito
    clearCart: function() {
        this.items = [];
        this.updateCart();
    }
};

// Función para inicializar las acciones de los productos
function initProductActions() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    
    // Eventos para añadir al carrito
    addToCartButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const id = productCard.dataset.id || Math.random().toString(36).substr(2, 9); // Generar ID si no existe
                const name = productCard.querySelector('h3').textContent;
                const priceText = productCard.querySelector('.price').textContent;
                const price = parseFloat(priceText.replace('$', ''));
                const image = productCard.querySelector('img').src;
                
                // Añadir al carrito con animación
                cart.addItem(id, name, price, image);
                
                // Feedback visual
                button.innerHTML = '<i class="fas fa-check"></i> Añadido';
                setTimeout(() => {
                    button.innerHTML = 'Añadir al carrito';
                }, 1500);
            });
        }
    });
    
    // Eventos para añadir a favoritos
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            icon.classList.toggle('text-danger');
        });
    });
}

// Función para inicializar el slider de testimonios
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    let currentIndex = 0;
    
    if (testimonials.length > 0 && prevButton && nextButton) {
        // Función para mostrar un testimonio específico
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.transform = `translateX(${100 * (i - index)}%)`;
            });
        }
        
        // Inicializar posición
        showTestimonial(currentIndex);
        
        // Evento para el botón anterior
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
            showTestimonial(currentIndex);
        });
        
        // Evento para el botón siguiente
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
            showTestimonial(currentIndex);
        });
        
        // Cambio automático cada 5 segundos
        setInterval(() => {
            currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
            showTestimonial(currentIndex);
        }, 5000);
    }
}

// Función para inicializar la cuenta regresiva
function initCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (daysElement && hoursElement && minutesElement && secondsElement) {
        // Fecha objetivo (7 días a partir de ahora)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7);
        
        function updateCountdown() {
            const currentDate = new Date();
            const difference = targetDate - currentDate;
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Actualizar cada segundo
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// Función para inicializar el formulario de newsletter
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Aquí iría la lógica para enviar el email al servidor
                alert(`¡Gracias por suscribirte! Te mantendremos informado en ${email}`);
                emailInput.value = '';
            }
        });
    }
}

// Función para manejar el desplazamiento suave a las secciones
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId !== '#') {
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para el header fijo
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Función para detectar cuando un elemento está en el viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animación de elementos al hacer scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('animated');
        }
    });
}

// Añadir evento de scroll para las animaciones
window.addEventListener('scroll', animateOnScroll);

// Inicializar animaciones al cargar la página
document.addEventListener('DOMContentLoaded', animateOnScroll);