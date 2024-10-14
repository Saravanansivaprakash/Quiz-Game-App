import Header from '../Header'
import './index.css'

const HomeRoute = props => {
  const onClickStart = () => {
    const {history} = props
    history.replace('/quiz-game')
  }
  return (
    <>
      <Header />
      <div className="home-route-container">
        <div className="responsive-home-container">
          <div className="image-text-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-start-the-quiz-img.png"
              alt="start quiz game"
              className="start-quiz-image"
            />
            <h1 className="home-heading">
              How Many Of These Questions Do You Actually Know?
            </h1>
            <p className="home-description">
              Test yourself with these easy quiz questions and answers
            </p>
            <button type="button" className="start-btn" onClick={onClickStart}>
              Start Quiz
            </button>
            <div className="warning-msg">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-error-img.png"
                alt="warning icon"
                className="warning-icon"
              />
              <p className="caution-message">
                All the progress will be lost, if you reload during the quiz
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeRoute
