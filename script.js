
let cart = [];
let currentUser = JSON.parse(localStorage.getItem('sportzone_user')) || null;
let isLoginMode = false;

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinksList = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('btn-topo').classList.toggle('show', window.scrollY > 400);
});

mobileMenuBtn.addEventListener('click', () => {
    navLinksList.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinksList.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
    }
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        navLinksList.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.replace('fa-xmark', 'fa-bars');
    });
});


document.getElementById('btn-topo').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const badgeMobile = document.getElementById('cart-badge-mobile');
    const itemsEl = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    const totalEl = document.getElementById('cart-total');

    [badge, badgeMobile].forEach(b => {
        if (cart.length > 0) {
            b.style.display = 'flex';
            b.textContent = cart.length;
        } else {
            b.style.display = 'none';
        }
    });

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
        footer.style.display = 'none';
    } else {
        const total = cart.reduce((s, i) => s + i.price, 0);
        itemsEl.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">R$ ${item.price}/mês</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `).join('');
        totalEl.textContent = `R$ ${total}/mês`;
        footer.style.display = 'block';
    }
}

function addToCart(id, name, price) {
    if (cart.find(i => i.id === id)) {
        showToast('Este plano já está no carrinho.', 'error');
        return;
    }
    cart.push({ id, name, price });
    updateCartUI();
    showToast(`${name} adicionado ao carrinho!`);
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function openCart() {
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
}

function checkout() {
    cart = [];
    updateCartUI();
    closeCart();
    showToast('🎉 Compra efetuada com sucesso!');
}


let selectedGender = 'm';

function selectGender(el, gender) {
    selectedGender = gender;
    el.parentElement.querySelectorAll('.radio-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

document.getElementById('imcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const peso = parseFloat(document.getElementById('peso').value.replace(',', '.'));
    const altura = parseFloat(document.getElementById('altura').value.replace(',', '.'));
    const resultBox = document.getElementById('imcResult');
    const valorEl = document.getElementById('valor-imc');
    const msgEl = document.getElementById('mensagem-imc');

    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
        showToast('Insira valores válidos para peso e altura.', 'error');
        return;
    }

    const imc = peso / (altura * altura);
    valorEl.textContent = imc.toFixed(2);

    let title = '', diet = '', color = '';
    if (imc < 18.5) {
        title = 'Abaixo do peso'; diet = 'Aumente carboidratos complexos e proteínas saudáveis.'; color = '#00f0ff';
    } else if (imc < 24.9) {
        title = 'Peso Normal'; diet = 'Excelente! Mantenha uma alimentação equilibrada.'; color = '#00ff88';
    } else if (imc < 29.9) {
        title = 'Sobrepeso'; diet = 'Considere uma reeducação alimentar com leve déficit calórico.'; color = '#ffd700';
    } else if (imc < 34.9) {
        title = 'Obesidade Grau I'; diet = 'Priorize alimentos ricos em fibras e proteínas magras.'; color = '#ff9900';
    } else {
        title = 'Obesidade Grau II/III'; diet = 'Busque acompanhamento médico e nutricional.'; color = '#ff007f';
    }

    valorEl.style.color = color;
    msgEl.innerHTML = `<p class="imc-title" style="color:${color}">${title}</p><p class="imc-diet">${diet}</p>`;
    resultBox.classList.add('show');

    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
});


function updateAuthUI() {
    const authItem = document.getElementById('nav-auth-item');
    const userInfo = document.getElementById('nav-user-info');
    const formView = document.getElementById('auth-form-view');
    const loggedView = document.getElementById('logged-in-view');

    if (currentUser) {
        authItem.style.display = 'none';
        userInfo.style.display = 'flex';
        userInfo.querySelector('.nav-user-name').innerHTML =
            `<i class="fa-solid fa-user"></i> ${currentUser.name.split(' ')[0]}`;
        formView.style.display = 'none';
        loggedView.style.display = 'block';
        document.getElementById('user-avatar-big').textContent = currentUser.name.charAt(0).toUpperCase();
        document.getElementById('welcome-name').textContent = `Olá, ${currentUser.name.split(' ')[0]}! 👋`;
    } else {
        authItem.style.display = 'list-item';
        userInfo.style.display = 'none';
        formView.style.display = 'block';
        loggedView.style.display = 'none';
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const nameFields = document.getElementById('name-fields');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleLink = document.getElementById('auth-toggle');

    if (isLoginMode) {
        nameFields.style.display = 'none';
        title.textContent = 'Acessar Conta';
        subtitle.textContent = 'Entre com seus dados para continuar.';
        submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> ENTRAR';
        toggleLink.textContent = 'Não tem conta? Cadastre-se';
    } else {
        nameFields.style.display = 'grid';
        title.textContent = 'Crie sua Conta';
        subtitle.textContent = 'Junte-se à nossa comunidade.';
        submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> COMEÇAR AGORA';
        toggleLink.textContent = 'Já tem conta? Faça login';
    }
}

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (isLoginMode) {
        const stored = JSON.parse(localStorage.getItem('sportzone_user'));
        if (stored && stored.email === email && stored.password === senha) {
            currentUser = stored;
            updateAuthUI();
            showToast(`Bem-vindo de volta, ${currentUser.name.split(' ')[0]}!`);
        } else {
            showToast('E-mail ou senha incorretos.', 'error');
        }
    } else {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        if (senha.length < 6) {
            showToast('A senha deve ter no mínimo 6 caracteres.', 'error');
            return;
        }
        currentUser = { name: `${firstName} ${lastName}`, email, password: senha };
        localStorage.setItem('sportzone_user', JSON.stringify(currentUser));
        updateAuthUI();
        showToast(`Cadastro realizado com sucesso, ${firstName}!`);
        this.reset();
    }
});

function logout() {
    currentUser = null;
    localStorage.removeItem('sportzone_user');
    updateAuthUI();
    showToast('Você saiu da sua conta.');
}


document.getElementById('togglePasswordBtn').addEventListener('click', function() {
    const senha = document.getElementById('senha');
    const icon = this.querySelector('i');
    if (senha.type === 'password') {
        senha.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        senha.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


updateAuthUI();
