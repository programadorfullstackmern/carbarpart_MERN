import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import Header from './Header'
import Hero from './Hero'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Hero />
      <main className="main-content py-4">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default Layout