Feature: Preenchimento do formulário Tricentis

  Scenario: Preenchimento com sucesso
    Given que acesso o portal Tricentis
    When preencho os dados do veículo
    And preencho os dados do segurado
    And preencho os dados do produto
    And seleciono a opção de preço 'Ultimate'
    Then clico em 'Send Quote'