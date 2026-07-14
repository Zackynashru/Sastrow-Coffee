// 1. Data Produk dengan tambahan kategori (Coffee, Kopi Bijian)
const products = [
    // --- COFFEE ---
    { id: 1, name: "Kopi Susu Aren", price: 22000, category: "Coffee", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80", description: "Paduan espresso khas Sastrow dengan gula aren asli pilihan yang creamy dan legit." },
    { id: 2, name: "Caramel Macchiato", price: 22000, category: "Coffee", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80", description: "Espresso, steamed milk, dan sirup karamel manis yang cocok untuk menemani harimu." },
    { id: 3, name: "Americano", price: 17000, category: "Coffee", image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=80", description: "Kopi hitam klasik tanpa ampas dengan cita rasa bold yang menyegarkan." },
    { id: 4, name: "Caffe Latte", price: 21000, category: "Coffee", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80", description: "Kombinasi sempurna antara espresso dan kelembutan susu yang dominan." },
    { id: 5, name: "Butterscotch Latte", price: 22000, category: "Coffee", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80", description: "Rasa manis gurih dari butterscotch menyatu dengan espresso kualitas terbaik kami." },
    
    // --- KOPI BIJIAN ---
    { id: 6, name: "Arabica Gayo (250g)", price: 75000, category: "Kopi Bijian", image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80", description: "Biji kopi Arabica Gayo yang di-roast sedemikian rupa untuk menonjolkan aroma floral dan fruity." },
    { id: 7, name: "Robusta Dampit (250g)", price: 45000, category: "Kopi Bijian", image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&q=80", description: "Biji kopi Robusta Dampit dengan body tebal dan rasa earthy, cocok untuk penikmat kopi pekat." },
    { id: 8, name: "Sastrow House Blend (250g)", price: 65000, category: "Kopi Bijian", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80", description: "Campuran rahasia khas Sastrow yang seimbang antara rasa manis, asam, dan pahit coklat." }
];

let cart = JSON.parse(localStorage.getItem('sastrow_cart')) || [];
const menuContainer = document.getElementById('menu-container');

// 2. Logika untuk memisahkan menu berdasarkan kategori
const categories = ["Coffee", "Kopi Bijian"];

function renderMenu(searchTerm = "") {
    menuContainer.innerHTML = ''; 
    categories.forEach(category => {
        const categoryProducts = products.filter(product => 
            product.category === category && 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (categoryProducts.length > 0) {
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.innerText = category;
            menuContainer.appendChild(categoryTitle);

            const grid = document.createElement('div');
            grid.className = 'menu-grid';

            categoryProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" style="cursor: pointer;" onclick="openProductModal(${product.id})">
                    <div class="card-content">
                        <h3 style="cursor: pointer;" onclick="openProductModal(${product.id})">${product.name}</h3>
                        <div class="price">Rp ${product.price.toLocaleString('id-ID')}</div>
                        <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
                    </div>
                `;
                grid.appendChild(card);
            });
            menuContainer.appendChild(grid);
        }
    });
}

// Panggil fungsi awal
renderMenu();
updateCartUI();

function onSearchInput(event) {
    renderMenu(event.target.value);
}

function saveCart() {
    localStorage.setItem('sastrow_cart', JSON.stringify(cart));
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('detail-modal-img').src = product.image;
    document.getElementById('detail-modal-title').innerText = product.name;
    document.getElementById('detail-modal-desc').innerText = product.description;
    document.getElementById('detail-modal-price').innerText = `Rp ${product.price.toLocaleString('id-ID')}`;
    
    document.getElementById('detail-add-btn').onclick = () => {
        addToCart(product.id);
        closeProductModal();
    };
    
    document.getElementById('product-detail-modal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-detail-modal').classList.remove('active');
}

// --- Fungsi Keranjang & Checkout (Tetap Sama) ---
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = message;
        toast.className = 'toast show';
        setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
    }
}

function addToCart(productId, isFromCart = false) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) { existingItem.quantity++; } 
    else { cart.push({ ...product, quantity: 1 }); }
    saveCart();
    updateCartUI();
    if (!isFromCart) showToast(`${product.name} ditambahkan!`);
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('total-price');
    cartContainer.innerHTML = ''; 
    let total = 0;
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Belum ada pesanan.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity; 
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-start';
            div.style.gap = '0.5rem';
            
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <span>${item.name}</span>
                    <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%;">
                    <button onclick="decreaseQuantity(${item.id})" style="width: auto; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; background: #e63946;">-</button>
                    <span style="font-weight: 800;">${item.quantity}</span>
                    <button onclick="addToCart(${item.id}, true)" style="width: auto; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; background: #1a1a1a;">+</button>
                    <button onclick="removeFromCart(${item.id})" style="width: auto; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; background: #999; margin-left: auto;">Hapus</button>
                </div>
            `;
            cartContainer.appendChild(div);
        });
    }
    totalContainer.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

function decreaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity--;
        if (item.quantity === 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) { alert('Keranjang kosong!'); return; }
    document.getElementById('modal-total-price').innerText = document.getElementById('total-price').innerText;
    document.getElementById('checkout-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

function processPayment(event) {
    event.preventDefault();
    const name = document.getElementById('cust-name').value;
    const orderType = document.getElementById('order-type').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const finalTotal = document.getElementById('total-price').innerText;

    let message = `*PESANAN SASTROW COFFEE BATURETNO*%0A`;
    message += `Nama: ${name}%0AOrder: ${orderType}%0ABy: ${paymentMethod}%0A%0A`;
    cart.forEach(item => { message += `- ${item.name} (x${item.quantity})%0A`; });
    message += `%0A*TOTAL: ${finalTotal}*`;

    window.open(`https://wa.me/628123456789?text=${message}`, '_blank');
    cart = []; saveCart(); updateCartUI(); closeModal();
}

function kirimPesan(event) {
    event.preventDefault(); 
    alert('Pesan terkirim ke Sastrow Coffee Baturetno!');
    event.target.reset(); 
}

function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}

function toggleQRIS() {
    const paymentMethod = document.getElementById('payment-method').value;
    const qrisContainer = document.getElementById('qris-container');
    if (paymentMethod === 'QRIS') {
        qrisContainer.style.display = 'block';
    } else {
        qrisContainer.style.display = 'none';
    }
}