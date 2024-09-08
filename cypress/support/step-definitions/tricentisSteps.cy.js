import { Given, When, And, Then } from 'cypress-cucumber-preprocessor/steps'

Given('que acesso o portal Tricentis', () => {
    cy.visit('http://sampleapp.tricentis.com/101/app.php')
})

When('preencho os dados do veículo', () => {
    cy.fixture('tricentisData').then((data) => {
        cy.navigateToTab('Vehicle Data')
        cy.fillVehicleData(data.vehicleData)
    })
})

And('preencho os dados do segurado', () => {
    cy.fixture('tricentisData').then((data) => {
        cy.navigateToTab('Insurant Data')
        cy.fillInsurantData(data.insurantData)
    })
})

And('preencho os dados do produto', () => {
    cy.fixture('tricentisData').then((data) => {
        cy.navigateToTab('Product Data')
        cy.fillProductData(data.productData)
    })
})

And('seleciono a opção de preço {string}', (priceOption) => {
    cy.selectPriceOption(priceOption)
})  

Then('clico em {string}', (buttonLabel) => {
    if (buttonLabel === 'Send Quote') {
        cy.clickSendQuote()
    }
})
