import Experience from './experience/experience'
import './style.css'
const query = document.querySelector.bind(document)
// queryId = document.getElementById.bind(document),
// queryAll = document.querySelectorAll.bind(document)

const canvas = query('canvas.experience')

if (canvas !== null) {
  const experience = new Experience(canvas)

  console.log('experience:', experience)
}
