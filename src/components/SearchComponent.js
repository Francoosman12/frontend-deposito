import React, { useState } from 'react';
import axios from 'axios';
import '../ProductSearch.css';

const SearchComponent = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEAN, setSearchEAN] = useState('');
  const [base, setBase] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState(null);

  // Function to fetch data based on EAN or Code
  const fetchData = async (value, type) => {
    console.log(`Fetching data with ${type}: ${value}`); // Debugging line
    try {
      const response = await axios.get(`http://localhost:3000/api/stock`, {
        params: { query: value }
      });

      console.log('Response data:', response.data); // Debugging line

      if (Array.isArray(response.data) && response.data.length > 0) {
        const product = response.data[0]; // Take the first result from the response

        // Update the fields based on the type of search
        if (type === 'EAN') {
          setSearchQuery(product.ARTICULO_CODIGO?.trim() || '');
        } else {
          setSearchEAN(product.ARTICULO_EANUNI || '');
        }
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
      setResults([]);
    }
  };

  // Handle form submission
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchEAN) {
      fetchData(searchEAN, 'EAN');
    } else if (searchQuery) {
      fetchData(searchQuery, 'query');
    }
  };

  // Print the current view
  const printResults = () => {
    if (!base || !fechaIngreso || !fechaVencimiento) {
      alert('Por favor, complete todos los campos de Base, Fecha de Ingreso y Fecha de Vencimiento.');
      return;
    }
    window.print();
  };

  // Handle input changes
  const handleChange = (e, type) => {
    const value = e.target.value;
    if (type === 'query') {
      setSearchQuery(value);
    } else {
      setSearchEAN(value);
    }
  };

  const formatFecha = (fecha) => {
  if (!fecha) return 'N/A';
  
  const [year, month, day] = fecha.split('-');
  return `${day}-${month}-${year}`;
};
  return (
    <div>
      <h1 className='search-form'>Buscar Productos Hola</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="searchEAN">Buscar por Código EAN:</label>
          <input
            type="text"
            id="searchEAN"
            name="searchEAN"
            placeholder="Código EAN"
            value={searchEAN}
            onChange={(e) => handleChange(e, 'EAN')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="searchQuery">Buscar por Código de Producto:</label>
          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            placeholder="Código de Producto"
            value={searchQuery}
            onChange={(e) => handleChange(e, 'query')}
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
          setSearchEAN('');
          setBase('');
          setFechaIngreso(null);
          setFechaVencimiento(null);
        }}>Borrar</button>
      </form>

      {error && <div className="error">{error}</div>}

     {results.length > 0 && (
  <div>
    <ul className="print-results">
      {results.map((result, index) => (
        <li key={index} className="print-result-item">
          <h1 className='ingreso'>INGRESO: {fechaIngreso ? formatFecha(fechaIngreso) : 'N/A'}</h1>
          <h1 className='cod'>{result.ARTICULO_CODIGO}</h1>
          <h1>{result.ARTICULO_NOMBRE}</h1>
          <div className='flex'>
            <h1 className='base'>BASE: {base || 'N/A'}</h1>
            <h1 className='vto'>VTO: {fechaVencimiento ? formatFecha(fechaVencimiento) : 'N/A'}</h1>
          </div>
        </li>
      ))}
    </ul>
    <button onClick={printResults} className="btn-print">Imprimir</button>
  </div>
)}
    </div>
  );
};

export default SearchComponent;
