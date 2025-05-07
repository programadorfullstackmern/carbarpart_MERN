import { Form, Row, Col, Button } from 'react-bootstrap'
import { Search, ArrowCounterclockwise } from 'react-bootstrap-icons'

const SearchForm = ({ 
  filters, 
  onFilterChange, 
  onReset, 
  searchFields = [], 
  additionalFields = [],
  showCategoryFilter = false,
  categories = []
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onFilterChange(name, value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // El manejo real de la búsqueda se hace en el componente padre
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row>
        {/* Campo de búsqueda general */}
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Búsqueda</Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                name="search"
                value={filters.search || ''}
                onChange={handleChange}
                placeholder={`Buscar por ${searchFields.join(', ')}...`}
                aria-label="Texto de búsqueda"
              />
              <Button variant="primary" type="submit" aria-label="Buscar">
                <Search />
              </Button>
            </div>
          </Form.Group>
        </Col>

        {/* Filtro por categoría (condicional) */}
        {showCategoryFilter && (
          <Col md={6} lg={4}>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="categoria"
                value={filters.categoria || ''}
                onChange={handleChange}
                aria-label="Filtrar por categoría"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        )}

        {/* Campos adicionales personalizados */}
        {additionalFields.map(field => (
          <Col key={field.name} md={6} lg={4}>
            <Form.Group className="mb-3">
              <Form.Label>{field.label}</Form.Label>
              {field.type === 'select' ? (
                <Form.Select
                  name={field.name}
                  value={filters[field.name] || ''}
                  onChange={handleChange}
                  aria-label={field.ariaLabel}
                >
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              ) : field.type === 'range' ? (
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    name={`min${field.name}`}
                    value={filters[`min${field.name}`] || ''}
                    onChange={handleChange}
                    placeholder={field.minPlaceholder}
                    aria-label={`Mínimo ${field.ariaLabel}`}
                  />
                  <span className="mx-2">-</span>
                  <Form.Control
                    type="number"
                    name={`max${field.name}`}
                    value={filters[`max${field.name}`] || ''}
                    onChange={handleChange}
                    placeholder={field.maxPlaceholder}
                    aria-label={`Máximo ${field.ariaLabel}`}
                  />
                </div>
              ) : (
                <Form.Control
                  type={field.type || 'text'}
                  name={field.name}
                  value={filters[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  aria-label={field.ariaLabel}
                />
              )}
            </Form.Group>
          </Col>
        ))}

        {/* Botones de acción */}
        <Col md={12} className="d-flex justify-content-end">
          <Button 
            variant="outline-secondary" 
            onClick={onReset}
            className="me-2 d-flex align-items-center"
            aria-label="Restablecer filtros"
          >
            <ArrowCounterclockwise className="me-1" /> Limpiar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            className="d-flex align-items-center"
            aria-label="Aplicar filtros"
          >
            <Search className="me-1" /> Buscar
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchForm