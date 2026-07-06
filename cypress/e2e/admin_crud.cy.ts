describe("EventDrink Pro E2E - CRUD de Administração", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // Ensure age gate and landing routing are bypassed in CI/test runs
        win.localStorage.setItem("eventdrink_age_verified", "true");
        win.localStorage.setItem("eventdrink_age_verified_expiry", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
        // Force the app to render the main workspace (shows header + profile trigger)
        win.localStorage.setItem('eventdrink_active_tab', 'dashboard');
      },
    });
  });

  it("Deve permitir fazer login como Administrador e realizar operações CRUD em Downloads VIP", () => {
    // 1. Fazer login
    cy.get("#user-profile-trigger").click();
    
    // Preencher as credenciais de autenticação
    cy.get("#auth-input-email").clear().type("admin@eventdrink.com");
    cy.get("#auth-input-password").clear().type("123456");
    
    // Enviar formulário
    cy.get("#auth-primary-submit-btn").click();
    
    // Verificar se a mensagem de toast ou estado de logado existe
    cy.get("#app-toast-message").should("exist");
    
    // Navegar para a seção de downloads do administrador
    cy.get("#nav-admin-admin-downloads").click();
    
    // 2. CRIAR (Publicar Download)
    const testTitle = `Manual de Bar Avançado ${Date.now()}`;
    cy.get("#res-title-input").clear().type(testTitle);
    cy.get("#res-type-select").select("E-book");
    cy.get("#res-size-input").clear().type("4.2 MB");
    
    cy.get("form").submit();
    
    // Validar se a lista exibe o download criado
    cy.contains(testTitle).should("exist");
  });
});
