describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should navigate to Tuesday", () => {
    //visit home page
    cy.visit("/");

    //Refactor the test to use a single command chain that finds the list item,
    // clicks it and checks it for the correct background colour.
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");

    
  });


});