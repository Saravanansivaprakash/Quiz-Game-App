import {useLocation} from 'react-router-dom'
import UnattemptedQuestion from '../UnattemptedQuestion'
import Header from '../Header'
import './index.css'

const GameReportsRoute = () => {
  const location = useLocation()
  const {questions = [], ttlQns = 0} = location.state || {}

  const getUnattemptedQuestions = () =>
    questions.filter(question => question.slctOptId === null)

  const getCorrectAnswersCount = () =>
    questions.filter(question => question.slctOptId === question.crctOptId)
      .length

  const getIncorrectQuestionsCount = () =>
    questions.filter(
      question =>
        question.slctOptId !== null &&
        question.slctOptId !== question.crctOptId,
    ).length

  const renderUnattemptedQuestions = () => {
    const unattemptedQuestions = getUnattemptedQuestions()
    if (unattemptedQuestions.length === 0) {
      return (
        <div className="unattempted-questions-container">
          <h1 className="display-report-heading">
            Attempted all the questions
          </h1>
        </div>
      )
    }
    return (
      <div className="unattempted-questions-container">
        <h2>Unattempted Questions</h2>
        {unattemptedQuestions.map(eachQuestion => (
          <UnattemptedQuestion
            questionOption={eachQuestion}
            key={eachQuestion.id}
          />
        ))}
      </div>
    )
  }

  const CorrectAnswers = getCorrectAnswersCount()
  const IncorrectAnswers = getIncorrectQuestionsCount()
  const Unattempted = getUnattemptedQuestions().length

  return (
    <div className="page-container">
      <Header />
      <div className="report-container">
        <div className="score-board">
          <div className="score-container">
            <div className="score-circle">
              <p>
                <span className="score">{CorrectAnswers}</span>/{ttlQns}
              </p>
            </div>
            <div className="score-details">
              <div className="score-item">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/quiz-game-right-check-img.png"
                  alt="correct answer icon"
                  className="score-icon"
                />{' '}
                <p className="count">{CorrectAnswers} Correct answers</p>
              </div>
              <div className="score-item">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/quiz-game-wrong-check-img.png"
                  alt="incorrect answer icon"
                  className="score-icon"
                />
                <p className="count">{IncorrectAnswers} Incorrect answers</p>
              </div>
              <div className="score-item">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/quiz-game-un-answered-img.png"
                  alt="unattempted icon"
                  className="score-icon"
                />
                <p className="count">{Unattempted} Unattempted answers</p>
              </div>
            </div>
          </div>
          {renderUnattemptedQuestions()}
        </div>
      </div>
    </div>
  )
}

export default GameReportsRoute
