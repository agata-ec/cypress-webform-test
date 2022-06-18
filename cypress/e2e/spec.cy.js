const path = require('path')

describe('form input testing for 2i', () => {
  const downloadsFolder = Cypress.config('downloadsFolder')

  //Use the cy.fixture() method to pull data from fixture file
  beforeEach(function(){
    //access fixture data
    cy.fixture('user').then(function(testUser){
      this.testUser=testUser
    })
  })

  it('Can populate and submit form from CSV test data', function() {
    //arrange - set up initional app state
    //visit a web page
    //act - take an action
   
    //visit web page('http://localhost:3000/')
    cy.visit('http://localhost:3000/')
     //select first name
    cy.get('#select-key-drop-basic').select('firstName').should('have.value', 'firstName')
    //add first name
    cy.get('#btn-add-prop').click()
    //select last name
    cy.get('#select-key-drop-basic').select('lastName').should('have.value', 'lastName')
    //add last name
    cy.get('#btn-add-prop').click()
    //select address
    cy.get('#select-key-drop-basic').select('address').should('have.value', 'address')
    //add address
    cy.get('#btn-add-prop').click()
    //select email address
    cy.get('#select-key-drop-basic').select('email').should('have.value', 'email')
    //add email
    cy.get('#btn-add-prop').click()
    //select phone number
    cy.get('#select-key-drop-basic').select('phoneNo').should('have.value', 'phoneNo')
    //add phone number
    cy.get('#btn-add-prop').click()

    // enter number to entries
    cy.get('#entries-input')
    .type('5')
    .should('have.value', '5')

    // generate CSV
    cy.get('#btn-resCSV-data').click()
    cy.get('#btn-get-data').click()
    cy.get('#btn-arr-data').click()
    cy.get('#btn-download-data').click()

    //loading data from a file

    // file path is relative to the working folder
    const filename = path.join(downloadsFolder, 'generatedBy_react-csv.csv')

    cy.readFile(filename, { timeout: 15000 })
      .then((data) => {
        cy.task('csvToJson', data).then((data) => { // call custom CSV to JSON parser
          
          // visit test form
          cy.visit('http://localhost:3000/form.html')

          cy.get('input[name=first_name]')
            .type(data[0].firstName)
            .should('have.value', data[0].firstName)

          cy.get('input[name=surname]')
            .type(data[0].lastName)
            .should('have.value', data[0].lastName)

          cy.get('textarea[name=address]')
            .type(data[0].address)
            .should('have.value', data[0].address)

          cy.get('input[name=email]')
            .type(data[0].email)  
            .should('have.value', data[0].email)    

          cy.get('input[name=phone_no]')
            .type(data[0].phoneNo)
            .should('have.value', data[0].phoneNo)
        
          cy.get('#submit_button').click()

          cy.url().should('include', 'submitted.html')
        })
      })
  })

  it('Form will not submit when missing first name', function() {
    cy.visit('http://localhost:3000/form.html')

    cy.get('input[name=surname]')
      .type(this.testUser.lastName)
      .should('have.value', this.testUser.lastName)

    cy.get('textarea[name=address]')
      .type(this.testUser.address)
      .should('have.value', this.testUser.address)

    cy.get('input[name=email]')
      .type(this.testUser.email)
      .should('have.value', this.testUser.email)
      
    cy.get('input[name=phone_no]')
      .type(this.testUser.phoneNo)
      .should('have.value', this.testUser.phoneNo)

    cy.get('#submit_button').click()

    cy.url().should('not.include', 'submitted.html')
  })

  it('Form will not submit when email address is invalid', function() {
    cy.visit('http://localhost:3000/form.html')
   
    var invalidEmail = "invalid";

    cy.get('input[name=first_name]')
      .type(this.testUser.firstName)
      .should('have.value', this.testUser.firstName)

    cy.get('input[name=surname]')
      .type(this.testUser.lastName)
      .should('have.value', this.testUser.lastName)

    cy.get('textarea[name=address]')
      .type(this.testUser.address)
      .should('have.value', this.testUser.address)

    cy.get('input[name=email]')
      .type(invalidEmail)
      .should('have.value', invalidEmail)
      
    cy.get('input[name=phone_no]')
      .type(this.testUser.phoneNo)
      .should('have.value', this.testUser.phoneNo)

    cy.get('#submit_button').click()

    cy.url().should('not.include', 'submitted.html')
  })

})
