import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiPrivate from "../hooks/hookApiPrivate.ts";
import "../styles/search.css";


const Search = () => {
    const [polygons, setPolygons] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca
    const navigate = useNavigate();
    const api = useApiPrivate();

    useEffect(() => {
        const fetchPolygons = async () => {
            try {
                const response = await api.get('/polygons/');
                setPolygons(response.data);
            } catch (error) {
                console.error("Erro ao buscar os polígonos:", error);
            }
        };
        
        fetchPolygons();
    }, [api]);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const goToAnotherRoute = () => {
        navigate("/home");
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/polygons/${id}`);
            setPolygons(polygons.filter(polygon => polygon.id !== id));
        } catch (error) {
            console.error("Erro ao deletar o polígono:", error);
        }
    };

    const handlePointsOfInterest = (id) => {
        navigate(`/pointsinterests/${id}`);
    };

    // Filtra os polígonos com base no termo de busca
    const filteredPolygons = polygons.filter((polygon) =>
        polygon.properties.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="">
            <h2>Polígonos Cadastrados</h2>
            <div>
                <input
                    type="text"
                    placeholder="Buscar pelo nome do polígono"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Coordenadas</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPolygons.map((polygon) => (
                        <tr key={polygon.id}>
                            <td>{polygon.properties.name}</td>
                            <td>{polygon.properties.description}</td>
                            <td>{JSON.stringify(polygon.geometry.coordinates)}</td>
                            <td>
                                <button onClick={() => handleEdit(polygon.id)}>Editar</button>
                                <button onClick={() => handleDelete(polygon.id)}>Excluir</button>
                                <button onClick={() => handlePointsOfInterest(polygon.id)}>Pontos de Interesse</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={goToAnotherRoute}>Voltar</button>
            </div>
        </section>
    );
};

export default Search;
