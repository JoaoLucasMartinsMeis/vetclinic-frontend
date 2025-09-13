import React, { useState, useEffect, useRef } from 'react';
import { translate } from '../../utils/translations';

const SearchSelect = ({
    label,
    placeholder,
    searchFunction,
    onSelect,
    selectedItems = [],
    onRemove,
    disabled = false,
    maxItems = 5
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (term) => {
        if (term.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await searchFunction(term);
            // Filtra itens já selecionados
            const filteredResults = response.data.filter(item =>
                !selectedItems.some(selected => selected.id === item.id)
            );
            setSearchResults(filteredResults.slice(0, maxItems));
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
        setIsOpen(true);
    };

    const handleSelectItem = (item) => {
        onSelect(item);
        setSearchTerm('');
        setSearchResults([]);
        setIsOpen(false);
    };

    return (
        <div className="mb-3" ref={searchRef}>
            <label style={labelStyle}>{label}</label>
            
            {/* Itens selecionados */}
            {selectedItems.length > 0 && (
                <div className="mb-2">
                    {selectedItems.map(item => (
                        <div key={item.id} className="badge bg-primary me-2 mb-2 p-2" style={badgeStyle}>
                            {item.name}
                            <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                onClick={() => onRemove(item.id)}
                                style={{ fontSize: '10px' }}
                                aria-label="Remover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Campo de busca */}
            <div className="position-relative">
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                    style={inputStyle}
                />
                
                {/* Loading indicator */}
                {isLoading && (
                    <div className="position-absolute" style={{ right: '10px', top: '10px' }}>
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                )}

                {/* Resultados da busca */}
                {isOpen && searchResults.length > 0 && (
                    <div className="position-absolute w-100 bg-white border rounded mt-1" style={dropdownStyle}>
                        {searchResults.map(item => (
                            <div
                                key={item.id}
                                className="dropdown-item cursor-pointer"
                                onClick={() => handleSelectItem(item)}
                                style={dropdownItemStyle}
                            >
                                {item.name}
                                {item.cpf && ` - CPF: ${item.cpf}`}
                                {item.breed && ` - Raça: ${item.breed}`}
                            </div>
                        ))}
                    </div>
                )}

                {isOpen && searchTerm.length >= 2 && searchResults.length === 0 && !isLoading && (
                    <div className="position-absolute w-100 bg-white border rounded mt-1 p-2 text-muted">
                        Nenhum resultado encontrado para "{searchTerm}"
                    </div>
                )}
            </div>

            <small className="text-muted">
                Digite pelo menos 2 caracteres para buscar
            </small>
        </div>
    );
};

const labelStyle = {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
    display: 'block'
};

const inputStyle = {
    borderRadius: '8px',
    border: '1px solid #ddd'
};

const dropdownStyle = {
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const dropdownItemStyle = {
    cursor: 'pointer',
    padding: '10px 15px',
    borderBottom: '1px solid #eee'
};

const badgeStyle = {
    borderRadius: '12px',
    fontSize: '0.875rem'
};

export default SearchSelect;