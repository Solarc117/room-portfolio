import Experience from './experience/experience'
import './style.css'
const query = document.querySelector.bind(document),
  canvas = query('canvas')

if (canvas !== null) {
  const experience = new Experience(canvas)

  console.log('experience:', experience)

  
}
