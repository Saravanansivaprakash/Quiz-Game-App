import './index.css'

const FailureView = ({handleClickRetry}) => (
  <div className="failure-container">
    <div className="failure-responsive-container">
      <div className="image-text-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-assess-failure-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="failure-heading">Something went wrong</h1>
        <p className="failure-description">
          Our servers are busy please try again
        </p>
        <button type="button" className="retry-btn" onClick={handleClickRetry}>
          Retry
        </button>
      </div>
    </div>
  </div>
)

export default FailureView
