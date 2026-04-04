import { useEffect, useState } from "react";
import axios from "axios";

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [type, setType] = useState("");

  // Charger stocks
  const fetchStocks = () => {
    axios.get("http://localhost:5000/api/stocks")
      .then(res => setStocks(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Ajouter stock
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/stocks", {
        nom,
        quantite: parseInt(quantite),
        type
      });

      setNom("");
      setQuantite("");
      setType("");
      fetchStocks();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Stocks</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantité"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
        />

        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <button type="submit">Ajouter</button>
      </form>

      {/* TABLE */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.id}>
              <td>{stock.id}</td>
              <td>{stock.nom}</td>
              <td>{stock.quantite}</td>
              <td>{stock.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stocks;