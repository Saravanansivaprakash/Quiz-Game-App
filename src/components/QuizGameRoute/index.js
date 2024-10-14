import {useState, useEffect, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'
import Header from '../Header'
import './index.css'

const QuizGameRoute = () => {
  const [quizQuestions, setQuizQuestions] = useState([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [timer, setTimer] = useState(15)
  const history = useHistory()
  const timerRef = useRef(null)

  const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
  }
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.inProgress)

  const fetchQuizQuestions = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const urlApi = 'https://apis.ccbp.in/assess/questions'
    const optionData = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(urlApi, optionData)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.questions.map(eachQuestion => ({
        question: eachQuestion.question_text,
        optionType: eachQuestion.options_type,
        options: eachQuestion.options.map(option => ({
          id: option.id,
          text: option.text,
          url: option.image_url,
          isCorrect: option.is_correct === 'true',
        })),
        id: eachQuestion.id,
        crctOptId: eachQuestion.options.find(item => item.is_correct === 'true')
          .id,
        slctOptId: null,
      }))
      setQuizQuestions(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        const newTimer = prevTimer - 1
        if (newTimer === 0) {
          clearInterval(timerRef.current)
        }
        return newTimer >= 0 ? newTimer : 0
      })
    }, 1000)
  }

  useEffect(() => {
    fetchQuizQuestions()
  }, [])

  useEffect(() => {
    if (apiStatus === apiStatusConstants.success) {
      startTimer()
    }
    return () => {
      clearInterval(timerRef.current)
    }
  }, [apiStatus, activeQuestionIndex])

  const handleRetry = () => {
    setQuizQuestions([])
    setActiveQuestionIndex(0)
    setSelectedAnswerIndex(-1)
    setCorrectAnswersCount(0)
    setTimer(15)
    setApiStatus(apiStatusConstants.initial)
    fetchQuizQuestions()
  }

  const handleAnswerSelection = answerIndex => {
    if (selectedAnswerIndex === -1) {
      setSelectedAnswerIndex(answerIndex)
      const crntQn = quizQuestions[activeQuestionIndex]
      const isCorrect = crntQn.crctOptId === answerIndex
      if (isCorrect) {
        setCorrectAnswersCount(prevCount => prevCount + 1)
      }
      setQuizQuestions(prevQuestions =>
        prevQuestions.map((question, index) =>
          index === activeQuestionIndex
            ? {...question, slctOptId: answerIndex}
            : question,
        ),
      )
      clearInterval(timerRef.current)
    }
  }

  const handleNextQuestion = () => {
    if (activeQuestionIndex + 1 < quizQuestions.length) {
      setActiveQuestionIndex(prevIndex => prevIndex + 1)
      setSelectedAnswerIndex(-1)
      setTimer(15)
    } else {
      history.push({
        pathname: '/game-results',
        state: {
          crctAns: correctAnswersCount,
          ttlQns: quizQuestions.length,
          questions: quizQuestions,
        },
      })
    }
  }

  useEffect(() => {
    if (timer === 0 && selectedAnswerIndex === -1) {
      handleNextQuestion()
    }
  }, [timer])

  // question item
  const renderQuiz = () => {
    const crntQn = quizQuestions[activeQuestionIndex]
    const {question, options, optionType, crctOptId, slctOptId} = crntQn

    const renderOptions = () => {
      switch (optionType) {
        case 'DEFAULT':
          return options.map((option, index) => {
            const isSelected = slctOptId === option.id
            const isCorrect = crctOptId === option.id
            let optionClass = ''
            if (isSelected) {
              optionClass = isCorrect ? 'correct' : 'wrong'
            }
            const showIcon = isSelected || (isCorrect && slctOptId !== null)
            const onClickAnswer = (id, e) => {
              handleAnswerSelection(id)
              if (id === crctOptId) {
                e.target.classList.add('correct')
              } else {
                e.target.classList.add('wrong')
                document.getElementById(crctOptId).classList.add('correct')
              }
            }
            const imageSrc = isCorrect
              ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
              : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png'
            const altVal = isCorrect
              ? 'correct checked circle'
              : 'incorrect close circle'
            return (
              <li key={option.id} className="list-item">
                <span>{`${String.fromCharCode(65 + index)}. `}</span>
                <button
                  className={`option-list ${optionClass}`}
                  onClick={e => onClickAnswer(option.id, e)}
                  id={option.id}
                  type="button"
                  disabled={slctOptId !== null}
                >
                  {option.text}
                </button>
                {showIcon && (
                  <img className="option-icon" alt={altVal} src={imageSrc} />
                )}
              </li>
            )
          })
        case 'IMAGE':
          return options.map(option => {
            const isSelected = slctOptId === option.id
            const isCorrect = crctOptId === option.id
            const showIcon = isSelected || (isCorrect && slctOptId !== null)
            return (
              <li key={option.id} className="option-container">
                <div
                  onClick={() => handleAnswerSelection(option.id)}
                  role="button"
                  tabIndex={0}
                  className="option-btn"
                >
                  <img
                    src={option.url}
                    alt={option.text}
                    className="option-image"
                  />
                </div>
                {showIcon && (
                  <img
                    className="option-icon"
                    alt={
                      isCorrect
                        ? 'correct checked circle'
                        : 'incorrect close circle'
                    }
                    src={
                      isCorrect
                        ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                        : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png'
                    }
                  />
                )}
              </li>
            )
          })
        case 'SINGLE_SELECT':
          return options.map(option => {
            const isSelected = slctOptId === option.id
            const isCorrect = crctOptId === option.id
            const showIcon = isSelected || (isCorrect && slctOptId !== null)
            return (
              <li key={option.id} className="option-container single-select">
                <input
                  type="radio"
                  id={option.id}
                  name="singleSelectOption"
                  checked={isSelected}
                  onChange={() => handleAnswerSelection(option.id)}
                  className="single-select-radio"
                  disabled={slctOptId !== null}
                />
                <label htmlFor={option.id} className="single-select-label">
                  {option.text}
                </label>
                {showIcon && (
                  <img
                    className="option-icon"
                    alt={
                      isCorrect
                        ? 'correct checked circle'
                        : 'Incorrect close Circle'
                    }
                    src={
                      isCorrect
                        ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                        : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png'
                    }
                  />
                )}
              </li>
            )
          })
        default:
          return options.map((option, index) => {
            const isSelected = slctOptId === option.id
            const isCorrect = crctOptId === option.id
            let optionClass = ''
            if (isSelected) {
              optionClass = isCorrect ? 'correct' : 'wrong'
            }
            const showIcon = isSelected || (isCorrect && slctOptId !== null)
            const onClickAnswer = (id, e) => {
              handleAnswerSelection(id)
              if (id === crctOptId) {
                e.target.classList.add('correct')
              } else {
                e.target.classList.add('wrong')
                document.getElementById(crctOptId).classList.add('correct')
              }
            }
            const imageSrc = isCorrect
              ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
              : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png'
            const altVal = isCorrect
              ? 'correct checked circle'
              : 'incorrect close circle'
            return (
              <li key={option.id} className="list-item">
                <span>{`${String.fromCharCode(65 + index)}. `}</span>
                <button
                  className={`option-list ${optionClass}`}
                  onClick={e => onClickAnswer(option.id, e)}
                  id={option.id}
                  type="button"
                  disabled={slctOptId !== null}
                >
                  {option.text}
                </button>
                {showIcon && (
                  <img className="option-icon" alt={altVal} src={imageSrc} />
                )}
              </li>
            )
          })
      }
    }
    const selectClassName = optionType === 'SINGLE_SELECT' ? 'select-list' : ''

    return (
      <>
        <div className="question-time-container">
          <div className="question-count-container">
            <p className="count-heading">Question</p>
            <p className="question-count">
              {activeQuestionIndex + 1}/{quizQuestions.length}
            </p>
          </div>
          <div className="time-container">
            <p>{timer}</p>
          </div>
        </div>
        <div className="question-items" data-testid="questionItem">
          <div className="question-container">
            <p className="question-text">{question}</p>
          </div>
          <ul className={`options-container ${selectClassName}`}>
            {renderOptions()}
          </ul>
        </div>
        <button
          className={
            selectedAnswerIndex === -1 ? 'next-btn' : 'next-btn enable'
          }
          onClick={handleNextQuestion}
          disabled={selectedAnswerIndex === -1}
          type="button"
        >
          {activeQuestionIndex + 1 === quizQuestions.length
            ? 'Submit'
            : 'Next Question'}
        </button>
      </>
    )
  }

  const renderLoadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="TailSpin" color="#0EA5E9" height={50} width={50} />
    </div>
  )

  const renderFailureView = () => <FailureView handleClickRetry={handleRetry} />

  const renderViews = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderQuiz()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="quiz-container">
        <div className="quiz-responsive-container">{renderViews()}</div>
      </div>
    </>
  )
}

export default QuizGameRoute
