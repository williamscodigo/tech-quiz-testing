describe('Tech Quiz End-to-End Tests', () => {
  beforeEach(() => {
    // Intercept API call and provide mock data
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    cy.visit('http://localhost:3000'); // Adjust if the URL changes
  });

  it('displays the start button and starts the quiz', () => {
    cy.contains('button', 'Start Quiz').should('exist');
    cy.contains('button', 'Start Quiz').click();
    cy.wait('@getQuestions');
    cy.get('.card h2').should('exist'); // First question should be displayed
  });

  it('navigates through questions and completes the quiz', () => {
    cy.contains('button', 'Start Quiz').click();
    cy.wait('@getQuestions');

    cy.fixture('questions.json').then((questions) => {
      questions.forEach((_: any, index: number) => {
        cy.get('.btn').first().click(); // Answer first option
        if (index < questions.length - 1) {
          cy.get('.card h2').should('exist'); // Ensure new question loads
        }
      });
    });

    cy.contains('Quiz Completed').should('exist');
    cy.contains('Your score:').should('exist');
  });

  it('restarts the quiz after completion', () => {
    cy.contains('button', 'Start Quiz').click();
    cy.wait('@getQuestions');

    cy.fixture('questions.json').then((questions) => {
      questions.forEach(() => {
        cy.get('.btn').first().click(); // Answer first option
      });
    });

    cy.contains('Quiz Completed').should('exist');
    cy.contains('button', 'Take New Quiz').click();
    cy.wait('@getQuestions');
    cy.get('.card h2').should('exist'); // First question should be displayed - quiz restarted verified by first question displayed 
  });
});
