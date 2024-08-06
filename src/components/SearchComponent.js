import React, { useState, useCallback } from 'react';
import axios from 'axios';
import '../ProductSearch.css';

const SearchComponent = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [base, setBase] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState(null);

  // Function to fetch data based on query
  const fetchData = useCallback(async (query) => {
    console.log(`Fetching data with query: ${query}`); // Debugging line
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/stock`, {
        params: { query }
      });

      console.log('Response data:', response.data); // Debugging line

      // Filtra por EAN o Código de Producto
      const product = response.data.find(item =>
        item.ARTICULO_EANUNI === query || item.ARTICULO_CODIGO === query
      );

      if (product) {
        setResults([product]);
        setSearchQuery(query);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
      setResults([]);
    }
  }, []);

  // Handle form submission
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery) {
      fetchData(searchQuery);
    }
  };

  return (
    <div>
      <h1 className='search-form'>Buscar Productos</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="searchQuery">Buscar por Código EAN</label>
          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            placeholder="Código EAN o Producto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="form-group form-group-inline">
          <div className="form-group">
            <label htmlFor="base">Base:</label>
            <input
              type="number"
              id="base"
              name="base"
              placeholder="Base"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="short"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fechaIngreso">Fecha de Ingreso:</label>
            <input
              type="date"
              id="fechaIngreso"
              name="fechaIngreso"
              value={fechaIngreso || ''}
              onChange={(e) => setFechaIngreso(e.target.value)}
              className="short"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fechaVencimiento">Fecha de Vencimiento:</label>
            <input
              type="date"
              id="fechaVencimiento"
              name="fechaVencimiento"
              value={fechaVencimiento || ''}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className="short"
            />
          </div>
        </div>
        <button type="submit" className="btn-search">Buscar</button>
        <button type="button" className="btn-reset" onClick={() => {
          setSearchQuery('');
          setBase('');
          setFechaIngreso(null);
          setFechaVencimiento(null);
          setResults([]);
          setError(null);
        }}>Borrar</button>
      </form>

      {error && <div className="error">{error}</div>}

      {results.length > 0 && (
        <div>
          <ul className="print-results">
            {results.map((result, index) => (
              <li key={index} className="print-result-item">
                <h1 className='ingreso'>INGRESO: {fechaIngreso ? new Date(fechaIngreso).toLocaleDateString() : 'N/A'}</h1>
                <h1 className='cod'>{result.ARTICULO_CODIGO}</h1>
                <h1>{result.ARTICULO_NOMBRE}</h1>
                <div className='flex'>
                  <h1 className='base'>BASE: {base || 'N/A'}</h1>
                  <h1 className='vto'>VTO: {fechaVencimiento ? new Date(fechaVencimiento).toLocaleDateString() : 'N/A'}</h1>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => window.print()} className="btn-print">Imprimir</button>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
