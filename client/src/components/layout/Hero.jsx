import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import hero1 from '../../assets/images/hero1.jpg'
import hero2 from '../../assets/images/hero2.jpg'
import intro1 from '../../assets/images/intro1.jpg'
import intro3 from '../../assets/images/intro3.jpg'
import intro5 from '../../assets/images/intro5.jpg'
import intro6 from '../../assets/images/intro6.webp'

const Hero = () => {

  // Datos del carrusel con las imágenes importadas
  const carouselItems = [
    {
      id: 1,
      image: hero1 // Usa la referencia importada
    },
    {
      id: 2,
      image: hero2
    },
    {
      id: 4,
      image: intro1
    },
    {
      id: 5,
      image: intro3
    },
    {
      id: 6,
      image: intro5
    },
    {
      id: 7,
      image: intro6
    }
  ];

  return (
    <Carousel 
      autoPlay 
      infiniteLoop 
      showThumbs={false} 
      showStatus={false}
      interval={5000}
      aria-label="Carrusel de imágenes promocionales"
    >
{carouselItems.map((item) => (
        
      <div
        key={item.id}
        className="hero-section" 
        style={{
        backgroundImage: `url(${item.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 0',
        color: '#fff',
        textAlign: 'center',
      }}
    ></div>
      ))}

    </Carousel>
  )
}

export default Hero