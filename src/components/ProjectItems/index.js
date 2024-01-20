import './index.css'

const ProjectItems = props => {
  const {projectDetails} = props
  const {imageUrl, name} = projectDetails
  return (
    <li className="project-list-style">
      <img src={imageUrl} alt={name} className="img" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectItems
