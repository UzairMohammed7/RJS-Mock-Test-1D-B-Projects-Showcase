import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProjectItems from '../ProjectItems'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    activeCategory: categoriesList[0].id,
    myProjects: [],
  }

  componentDidMount() {
    this.getProjectShowcase()
  }

  onChangeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectShowcase)
  }

  getProjectShowcase = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeCategory} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        myProjects: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRetry = () => {
    this.getProjectShowcase()
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="retry" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {myProjects} = this.state
    return (
      <>
        <ul className="project-list">
          {myProjects.map(eachProject => (
            <ProjectItems key={eachProject.id} projectDetails={eachProject} />
          ))}
        </ul>
      </>
    )
  }

  renderProjectShowcaseView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state

    return (
      <>
        <Header />
        <div className="main-container">
          <select
            className="select-container"
            value={activeCategory}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(eachCategory => (
              <option
                key={eachCategory.id}
                value={eachCategory.id}
                className="options"
              >
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectShowcaseView()}
        </div>
      </>
    )
  }
}

export default ProjectsShowcase

// ccbp submit RJSCEQHZ58
