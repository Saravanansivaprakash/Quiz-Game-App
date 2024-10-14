import './index.css'

const UnattemptedQuestion = ({questionOption}) => {
  const {options, optionType, question, crctOptId} = questionOption
  console.log(questionOption)
  const correctId = crctOptId

  const displayDefaultquestion = () =>
    options.map(each => {
      const crctClassName = each.id === correctId ? 'correctans' : ''
      return (
        <li key={each.id} className="unattemptedlist-item">
          <div className={`unattempt-default ${crctClassName}`} role="button">
            {each.text}
          </div>
          {each.id === correctId && (
            <img
              alt="correct checked circle"
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
              className="icon-style-unattempt"
            />
          )}
        </li>
      )
    })
  const displayImagequestion = () =>
    options.map(each => (
      <li key={each.id} className="unattemptedlist-item">
        <div>
          <img src={each.url} alt={each.text} className="question-image" />
        </div>

        {each.id === correctId && (
          <img
            src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
            alt="correct checked circle"
            className="icon-style-unattempt"
          />
        )}
      </li>
    ))

  const displaySelectquestion = () =>
    options.map(each => (
      <li key={each.id} className="select-unattempted-item">
        <div>
          <input
            type="radio"
            name="question"
            id={`id ${each.id}`}
            value={each.text}
          />
          <label htmlFor={`id ${each.id}`}>{each.text}</label>
        </div>

        {each.id === correctId && (
          <img
            src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
            alt="correct checked circle"
            className="icon-style-unattempt"
          />
        )}
      </li>
    ))

  const displayOptions = () => {
    switch (optionType) {
      case 'DEFAULT':
        return displayDefaultquestion()
      case 'IMAGE':
        return displayImagequestion()
      case 'SINGLE_SELECT':
        return displaySelectquestion()
      default:
        return null
    }
  }
  const selectOptionClassName =
    optionType === 'SINGLE_SELECT'
      ? 'select-unattempted-list'
      : 'unattempt-list-el'

  return (
    <>
      <p className="unattempt-question-heading">{question}</p>
      <ul className={selectOptionClassName}>{displayOptions()}</ul>
    </>
  )
}

export default UnattemptedQuestion
