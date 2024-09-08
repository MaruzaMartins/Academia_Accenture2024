import moment from 'moment'

const VEHICLE_DATA_TAB = '#nav_automobile'
const INSURANT_DATA_TAB = '#nav_insurantdata'
const PRODUCT_DATA_TAB = '#nav_productdata'
const PRICE_OPTION_SELECT = '#selectpriceoption'
const SEND_QUOTE_BUTTON = '#nextsendquote'
const VEHICLE_DATE_INPUT = '#dateofmanufacture'
const NEXT_BUTTON_PRODUCT_DATA = '#nextselectpriceoption'

// Comando para navegar entre as abas
Cypress.Commands.add('navigateToTab', (tabName) => {
  cy.log(`Navegando para a aba: ${tabName}`)
  switch (tabName) {
    case 'Vehicle Data':
      cy.get('a:contains("Vehicle Data")', { timeout: 10000 })
        .should('exist')
        .and('be.visible')
        .click()
      break;
    case 'Insurant Data':
      cy.get('a:contains("Insurant Data")', { timeout: 10000 })
        .should('exist')
        .and('be.visible')
        .click()
      break;
    case 'Product Data':
      cy.get('a:contains("Product Data")', { timeout: 10000 })
        .should('exist')
        .and('be.visible')
        .click()
      break;
    default:
      cy.log('Nome de aba desconhecido')
      break;
  }
})

// Comando para preencher campos de data
Cypress.Commands.add('fillDateInput', (inputSelector, date) => {
  const formattedDate = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')
  cy.get(inputSelector).clear().type(formattedDate, { force: true })
})

// Comando para preencher dados do veículo
Cypress.Commands.add('fillVehicleData', (vehicleData) => { 
  cy.get('#make').select(vehicleData.make, { force: true })

  cy.get('body').then(($body) => {
    if ($body.find('#model').length) {
      cy.get('#model')
        .should('exist')
        .and('be.visible')
        .select(vehicleData.model, { force: true })
    } else {
      cy.log('Campo #model não encontrado no DOM')
    }
  })

  cy.get('body').then(($body) => {
    if ($body.find('#cylindercapacity').length) {
      cy.get('#cylindercapacity')
        .should('exist')
        .and('be.visible')
        .clear()
        .type(vehicleData.cylinderCapacity, { force: true })
    } else {
      cy.log('Campo #cylindercapacity não encontrado no DOM')
    }
  })

  cy.fillDateInput('#dateofmanufacture', vehicleData.dateOfManufacture)
})

// Comando para preencher dados do segurado
Cypress.Commands.add('fillInsurantData', (insurantData) => {
  if (!insurantData || !insurantData.firstName || !insurantData.lastName || !insurantData.birthdate) {
    cy.log('Dados do segurado não fornecidos ou incompletos')
    return
  }
  cy.log('Preenchendo dados do segurado', insurantData)

  // Formatar a data de nascimento para o formato DD/MM/YYYY
  const formattedBirthdate = moment(insurantData.birthdate, 'DD/MM/YYYY').format('DD/MM/YYYY')

  cy.get('#firstname').clear().type(insurantData.firstName, { force: true })
  cy.get('#lastname').clear().type(insurantData.lastName, { force: true })
  cy.get('#birthdate').clear().type(formattedBirthdate, { force: true })
})

// Comando para preencher dados do produto
Cypress.Commands.add('fillProductData', (productData) => {
  if (!productData || !productData.startDate || !productData.insuranceSum) {
    cy.log('Dados do produto não fornecidos ou incompletos')
    return
  }

  // Preencher a data de início no formato esperado
  cy.fillDateInput('#startdate', productData.startDate)
  
  // Esperar até que o seletor esteja visível e selecionar a opção desejada
  cy.get('#insurancesum', { timeout: 10000 }).should('be.visible').then($select => {
    const options = Array.from($select.find('option')).map(option => option.textContent.trim())
    cy.log('Opções disponíveis:', options)

    if (!options.includes(productData.insuranceSum)) {
      cy.log(`Opção ${productData.insuranceSum} não encontrada no seletor.`)
      throw new Error(`Opção ${productData.insuranceSum} não encontrada no seletor.`)
    }

    // Selecionar a opção desejada
    cy.get('#insurancesum').select(productData.insuranceSum, { force: true })
  })
})

Cypress.Commands.add('selectPriceOption', (option) => {  
  cy.intercept('GET', '/101/tables/pricetableclickhandler.js').as('loadPriceOptions')

  cy.wait(1000) 

  cy.get('#nextselectpriceoption').should('be.visible').click()
  
  cy.wait('@loadPriceOptions', { timeout: 30000 }).then((interception) => {
    cy.log('Requisição recebida:', interception)
    if (interception.response.statusCode !== 200) {
      throw new Error(`Requisição falhou com status ${interception.response.statusCode}`)
    }
    cy.log('Requisição recebida com sucesso.')
  })  
  
  cy.get('#insurancesum').should('be.visible').select(option, { force: true })
  cy.log(`Opção de preço "${option}" selecionada com sucesso.`)
})

Cypress.Commands.add('clickSendQuote', () => {  
  cy.get('#selectpriceoption', { timeout: 10000 }).should('be.visible').then($section => {
    if ($section.css('display') === 'none') {
      cy.log('Seção pricePlans ainda está oculta. Forçando clique no botão.')
    }
  })
  cy.get('#nextsendquote', { timeout: 10000 }).click({ force: true })
})
