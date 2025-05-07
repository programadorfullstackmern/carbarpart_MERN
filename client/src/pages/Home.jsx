import React, { useContext, useEffect, useRef  } from 'react'
import { Row, Col, Alert, Spinner } from 'react-bootstrap'
import { AutoContext } from '../context/AutoContext'
import { PiezaContext } from '../context/PiezaContext'
import AutoCard from '../components/ui/AutoCard'
import PiezaCard from '../components/ui/PiezaCard'

const Home = () => {

  const { autos, loadingAutos, errorAutos, getAutos } = useContext(AutoContext)
  const { piezas, loadingPiezas, errorPiezas, getPiezas } = useContext(PiezaContext)

  const isMounted = useRef(true)

  useEffect(() => {
    const controller = new AbortController()

    const loadData = async () => {
      try {
        if (autos.length === 0 && isMounted.current) {
          await getAutos({ signal: controller.signal })
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted.current) {
          console.error("Error loading autos:", err)
        }
      }
    }

    loadData()
    getPiezas({ limit: 2 })

    return () => {
      isMounted.current = false
      controller.abort()
    }
  }, [autos.length, getAutos, getPiezas])

  return (
    <>
      <section className="mb-5">
        <h2 className="mb-4">Autos destacados</h2>
        {errorAutos && <Alert variant="danger">{errorAutos}</Alert>}
        {loadingAutos ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando autos...</span>
            </Spinner>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {autos.map(auto => (
              <Col key={auto._id}>
                <AutoCard auto={auto} />
              </Col>
            ))}
          </Row>
        )}
      </section>

      <section className="mb-5">
        <h2 className="mb-4">Piezas destacadas</h2>
        {errorPiezas && <Alert variant="danger">{errorPiezas}</Alert>}
        {loadingPiezas ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando piezas...</span>
            </Spinner>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {piezas.map(pieza => (
              <Col key={pieza._id}>
                <PiezaCard pieza={pieza} />
              </Col>
            ))}
          </Row>
        )}
      </section>
    </>
  )
}

export default Home