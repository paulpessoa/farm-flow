describe("Farm Management", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should show empty list message when no farms are available", () => {
    cy.contains("No farms registered.").should("be.visible");
  });

  it("should create a new farm", () => {
    cy.get('[data-testid="button-new-farm"]').click(); 
    cy.get('[data-testid="input-farm-name"]').type("Quixadá Farm"); 
    cy.get('[data-testid="input-address"]').type("Quixadá Ceará"); 
    cy.get('[data-testid="button-search-address"]').click(); 
    cy.get('[data-testid="select-land-unit"]').select("hectares"); 
    cy.get('[data-testid="button-add-crop"]').click(); 
    cy.get('[data-testid="select-crop-type-0"]').select("1"); 
    cy.get('[data-testid="input-crop-area-0"]').type("10"); 
    cy.get('[data-testid="select-crop-unit-0"]').select("hectares"); 
    cy.get('[data-testid="button-submit-farm"]').click(); 
    cy.contains("Farm created successfully!").should("be.visible");
    cy.contains("Quixadá Farm").should("be.visible"); 
  });

  it("should list farms", () => {
    cy.contains("Farm List").should("be.visible");
    cy.get("ul").children().should("have.length.greaterThan", 0);
  });

  it("should edit a farm", () => {
    cy.get('[data-testid="button-edit-farm-0"]').click();
    cy.get('[data-testid="input-farm-name"]').clear().type("Updated Farm");
    cy.get('[data-testid="select-crop-type-0"]').select("2");
    cy.get('[data-testid="input-crop-area-0"]').clear().type("15");
    cy.get('[data-testid="select-crop-unit-0"]').select("acres");
    cy.get('[data-testid="button-submit-farm"]').click();
    cy.contains("Farm updated successfully!").should("be.visible");
  });

  it("should delete a farm", () => {
    cy.get('[data-testid="button-delete-farm-0"]').click();
    cy.get('[data-testid="button-confirm-delete"]').click();
    cy.contains("Farm deleted successfully!").should("be.visible");
    cy.contains("Updated Farm").should("not.exist");
  });
});
