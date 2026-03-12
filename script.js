 const navbar = document.getElementById('navbar');
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const navLinksList = document.getElementById('nav-links');
        const navItems = document.querySelectorAll('.nav-item');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        mobileMenuBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if(navLinksList.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinksList.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            });
        });

        // --- 2. Scroll to Top Button ---
        const btnTopo = document.getElementById('btn-topo');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) btnTopo.classList.add('show');
            else btnTopo.classList.remove('show');
        });
        btnTopo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // --- 3. IMC Form Logic ---
        function selectRadio(element, group) {
            const siblings = element.parentElement.querySelectorAll('.radio-btn');
            siblings.forEach(el => el.classList.remove('active'));
            element.classList.add('active');
        }

        const formIMC = document.getElementById('imcForm');
        formIMC.addEventListener('submit', function(e) {
            e.preventDefault();
            const pesoInput = document.getElementById('peso').value;
            const alturaInput = document.getElementById('altura').value;
            
            // Clean numbers (replace comma with dot if user typed comma)
            const peso = parseFloat(pesoInput.replace(',', '.'));
            const altura = parseFloat(alturaInput.replace(',', '.'));
            
            const resultBox = document.getElementById('imcResult');
            const valorSpan = document.getElementById('valor-imc');
            const msgSpan = document.getElementById('mensagem-imc');

            if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
                valorSpan.textContent = "—";
                msgSpan.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> Por favor, insira valores numéricos válidos.";
                msgSpan.style.borderLeft = "5px solid var(--color-accent)";
            } else {
                const imc = peso / (altura * altura);
                valorSpan.textContent = imc.toFixed(2);
                
                let titulo = "";
                let dieta = "";
                let cor = "var(--color-text)";
                
                if (imc < 18.5) {
                    titulo = "Abaixo do peso ideal";
                    dieta = "<strong>Dieta sugerida:</strong> Aumente gradualmente a ingestão de carboidratos complexos e proteínas saudáveis (frangos, peixes, ovos) para promover o ganho seguro de massa magra.";
                    cor = "#00f0ff";
                    msgSpan.style.borderLeft = "5px solid #00f0ff";
                } else if (imc < 24.9) {
                    titulo = "Peso Normal (Adequado)";
                    dieta = "<strong>Dieta sugerida:</strong> Excelente! Mantenha uma alimentação perfeitamente equilibrada e focada em performance para bater seus PRs (Personal Records).";
                    cor = "#00ff88";
                    msgSpan.style.borderLeft = "5px solid #00ff88";
                } else if (imc < 29.9) {
                    titulo = "Sobrepeso";
                    dieta = "<strong>Dieta sugerida:</strong> Considere uma ligeira reeducação alimentar (leve déficit calórico). Reduza açúcares simples, frituras e alimentos ultraprocessados.";
                    cor = "#ffd700";
                    msgSpan.style.borderLeft = "5px solid #ffd700";
                } else if (imc < 34.9) {
                    titulo = "Obesidade Grau I";
                    dieta = "<strong>Dieta sugerida:</strong> Priorize fortemente alimentos ricos em fibras e proteínas magras. Recomendamos o acompanhamento contínuo dos nossos Nutricionistas da Elite.";
                    cor = "#ff9900";
                    msgSpan.style.borderLeft = "5px solid #ff9900";
                } else {
                    titulo = "Obesidade Grau II / III";
                    dieta = "<strong>Ação Recomendada:</strong> Foco prioritário na sua saúde. Busque acompanhamento médico e nutricional rigoroso presencial para montar um plano infalível e seguro para você.";
                    cor = "var(--color-accent)";
                    msgSpan.style.borderLeft = "5px solid var(--color-accent)";
                }

                msgSpan.innerHTML = `<strong style="font-size: 1.2rem; color: ${cor}; display:block; margin-bottom: 8px;">${titulo}</strong> ${dieta}`;
                valorSpan.style.color = cor;
            }
            resultBox.classList.add('show');
            
            // Scroll a bit to show result clearly
            setTimeout(() => {
                const y = resultBox.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({top: y, behavior: 'smooth'});
            }, 100);
        });

        // --- 4. Password Visibility Toggle ---
        const toggleBtn = document.getElementById('togglePasswordBtn');
        const senhaInput = document.getElementById('senha');
        toggleBtn.addEventListener('click', () => {
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text';
                toggleBtn.classList.replace('fa-eye', 'fa-eye-slash');
                toggleBtn.style.color = 'var(--color-secondary)';
            } else {
                senhaInput.type = 'password';
                toggleBtn.classList.replace('fa-eye-slash', 'fa-eye');
                toggleBtn.style.color = '#888';
            }
        });

        // --- 5. Registration Form Submission ---
        const registerForm = document.getElementById('registerForm');
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const pNome = document.getElementById('primeiroNome').value.trim();
            const sNome = document.getElementById('segundoNome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = senhaInput.value;
            
            if (senha.length < 6) {
                alert('Sua senha deve conter no mínimo 6 caracteres para segurança.');
                senhaInput.focus();
                return;
            }

            // Save basic data just like in the original code
            const usuario = {
                nomeCompleto: `${pNome} ${sNome}`,
                email: email,
                senha: senha
            };
            localStorage.setItem("usuarioSportZone", JSON.stringify(usuario));

            // UI Feedback
            const btn = document.getElementById('btn-submit-form');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';
            btn.style.opacity = '0.8';
            
            setTimeout(() => {
                alert(`Cadastro realizado com sucesso, ${pNome}!\nSeja muito bem-vindo(a) à SportZone+!`);
                btn.innerHTML = '<i class="fa-solid fa-check"></i> CONTA CRIADA!';
                btn.style.background = 'linear-gradient(135deg, #00ff88, #00b35f)';
                btn.style.color = '#000';
                btn.style.opacity = '1';
                
                // Clear inputs
                this.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });

        // Input masks (auto-format)
        document.getElementById('altura').addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 2) {
                this.value = v.substring(0, 1) + '.' + v.substring(1, 3);
            }
        });