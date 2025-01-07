import Quiz from '../../client/src/components/Quiz';

describe('Quiz Component', () => {
  beforeEach(() => {
    // Intercept API request and mock data
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    cy.mount(<Quiz />);
  });

  it('should display the Start Quiz button', () => {
    cy.contains('Start Quiz').should('exist');
  });

  it('should display the first question after clicking Start Quiz', () => {
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
    cy.get('.card h2').should('contain.text', 'What is 2 + 2?');
  });
  
  it('should handle quiz completion and reset', () => {
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
    cy.fixture('questions.json').then((questions) => {
      questions.forEach(() => {
        cy.get('.btn').first().click(); // Answer questions
      });
    });
    cy.contains('Quiz Completed').should('exist');
    cy.contains('button', 'Take New Quiz').click();
    cy.wait('@getQuestions');
    cy.get('.card h2').should('exist'); // First question after restart
  });
});
