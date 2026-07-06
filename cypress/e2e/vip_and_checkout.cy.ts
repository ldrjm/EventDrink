describe('EventDrink Pro E2E - VIP lock, sign-up and checkout', () => {
  // Credenciais de administrador usadas nos testes locais/fallback.
  const adminEmail = 'admin@eventdrink.com';
  const adminPassword = '123456';

  beforeEach(() => {
    // Reseta o estado do localStorage para garantir testes independentes.
    cy.clearLocalStorage();
  });

  it('should show age gate and allow entry with a valid birthdate', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // Remove flags de maioridade e aba ativa para forçar o age gate.
        win.localStorage.removeItem('eventdrink_age_verified');
        win.localStorage.removeItem('eventdrink_age_verified_expiry');
        win.localStorage.removeItem('eventdrink_active_tab');
      },
    });

    // Preenche o campo de data de nascimento e confirma o age gate.
    cy.get('#birthdate-input').should('be.visible').type('1990-01-01');
    cy.get('#age-gate-confirm-btn').click();

    // O botão principal do hero deve aparecer e avançar para o app.
    cy.get('#hero-planner-cta').should('be.visible');
    cy.get('#hero-planner-cta').click();

    // Confirma que o perfil ficou visível no header do workspace.
    cy.get('#user-profile-trigger').should('be.visible');
    cy.contains(/dashboard|painel/i).should('exist');
  });

  it('should allow VIP users to access premium content when already authenticated', () => {
    const vipSession = {
      name: 'E2E VIP User',
      email: `e2e.vip.${Date.now()}@example.com`,
      avatarInitials: 'EV',
      isLoggedIn: true,
      badge: 'VIP Member',
      role: 'VIP',
      eventsCount: 1,
      phone: '',
      birthDate: '1990-01-01'
    };

    cy.visit('/', {
      onBeforeLoad(win) {
        // Prepara um usuário VIP já autenticado no localStorage para o teste.
        win.localStorage.setItem('eventdrink_age_verified', 'true');
        win.localStorage.setItem('eventdrink_age_verified_expiry', String(Date.now() + 30 * 24 * 60 * 60 * 1000));
        win.localStorage.setItem('eventdrink_user_session', JSON.stringify(vipSession));
        win.localStorage.setItem('eventdrink_active_tab', 'landing');
      },
    });

    // Abre a área VIP e valida se o conteúdo premium está acessível.
    cy.get('#hero-club-cta').should('be.visible').click();
    cy.get('#app-sidebar-vip', { timeout: 10000 }).should('exist');
    cy.contains(/Receitas Premium|Premium Recipes/i).should('exist');
  });

  it('should add a drink to the cart and complete checkout as a logged-in VIP', () => {
    const vipSession = {
      name: 'E2E Checkout User',
      email: `e2e.checkout.${Date.now()}@example.com`,
      avatarInitials: 'EC',
      isLoggedIn: true,
      badge: 'VIP Member',
      role: 'VIP',
      eventsCount: 1,
      phone: '',
      birthDate: '1990-01-01'
    };

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDate = deliveryDate.toISOString().split('T')[0];

    cy.visit('/', {
      onBeforeLoad(win) {
        // Define um usuário VIP autenticado e navega diretamente para o menu.
        win.localStorage.setItem('eventdrink_age_verified', 'true');
        win.localStorage.setItem('eventdrink_age_verified_expiry', String(Date.now() + 30 * 24 * 60 * 60 * 1000));
        win.localStorage.setItem('eventdrink_user_session', JSON.stringify(vipSession));
        win.localStorage.setItem('eventdrink_active_tab', 'menu');
      },
    });

    // Adiciona o primeiro drink disponível ao carrinho.
    cy.get('[id^="add-to-cart-btn-"]')
      .first()
      .should('be.visible')
      .click();

    // Avança para o checkout e preenche os dados de entrega.
    cy.get('#header-prominent-cart-btn').click();
    cy.get('#checkout-delivery-address').type('Rua Teste, 123');
    cy.get('#checkout-delivery-date').type(formattedDate);
    cy.get('#payment-method-pix').click();
    cy.get('#checkout-finalize-btn').click();

    cy.contains(/Pedido finalizado|Order finalized/i).should('exist');
  });

  it('should allow admin login and access admin downloads console', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // Simula acesso de administrador com age gate já aprovado.
        win.localStorage.setItem('eventdrink_age_verified', 'true');
        win.localStorage.setItem('eventdrink_age_verified_expiry', String(Date.now() + 30 * 24 * 60 * 60 * 1000));
        win.localStorage.setItem('eventdrink_active_tab', 'dashboard');
      },
    });

    // Abre o modal de login e faz login com a credencial de admin.
    cy.get('#user-profile-trigger').click();
    cy.get('#auth-input-email').type(adminEmail);
    cy.get('#auth-input-password').type(adminPassword);
    cy.get('#auth-primary-submit-btn').click();

    // Valida que o toast apareceu e que a aba de downloads do admin está acessível.
    cy.get('#app-toast-message').should('exist');
    cy.get('#nav-admin-admin-downloads').click();
    cy.contains(/Downloads|downloads/i).should('exist');
  });
});
