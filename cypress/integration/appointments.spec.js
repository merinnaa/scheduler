
describe("Appointments", () => {

  beforeEach(() => {
    /*

     If we run the test a second time,
      it will fail because there will already be an appointment in the slot
       that we try to click. We should use the cy.request(method, url) command
        to "GET" to "/api/debug/reset" at the beginning of the test function.
    */

    cy.request("GET", "/api/debug/reset");

    //visit the root of the web server, and confirm that the DOM contains the text "Monday"
    cy.visit("/");
    cy.contains("Monday");


  });

  it("should book an interview", () => {

    //Clicks on the "Add" button in the second appointment
    cy.get("[alt=Add]")
      .first()
      .click();

    //Enters their name
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    // chooses an interviewer
    cy.get("[alt='Sylvia Palmer']").click();

    //clicks the save button
    cy.contains("Save").click();

    //verify that we show the student and interviewer names within
    //an element that has the ".appointment__card--show" class.
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    // 1. Find and hover over the appointment to reveal the edit button
    //cy.contains(".appointment__card--show", "Archie Cohen").trigger("mouseover");

    // 2. Clicks the edit button for the existing appointment with force option
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });

    // 3. Clears the input and Changes the name
    cy.get('[data-testid=student-name-input]')
      .clear()
      .type("Lydia Miller-Jones");

    // 4. Select another interviewer
    cy.get("[alt='Tori Malcolm']").click();

    // 5. Clicks the save button
    cy.contains("Save").click();
    // 6. Verify that the edit to the appointment is successful
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");

  });

  it.only("should cancel an interview", () => {
    //1. vists the root of our web server

    //2. Clicks the delete button for the existing appointment
    cy.get("[alt=Delete]")
      .click({ force: true });

    //3. Clicks the confirm button
    cy.contains("Confirm").click();

    /* 4. Sees that the appointment slot is empty
         First, check that the "Deleting" indicator should exist.
         Cypress will make sure that we show the "Deleting" indicator before moving to the next command.*/
    cy.contains("Deleting").should("exist");

    /*Then check that the "Deleting" indicator should not exist.
     Cypress will keep checking until we remove the indicator, or reach a timeout.
      In this case, it waits until we remove the indicator to move on. */

    cy.contains("Deleting").should("not.exist");

    /*Last check that the .appointment__card--show element
     that contains the text "Archie Cohen" should not exist. */

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });

});