import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Application Gestion Stock</h1>
      <p>Bienvenue</p>

      <Link to="/login">Connexion</Link> <br />
      <Link to="/register">Inscription</Link> <br />
      <Link to="/stocks">Stocks</Link>
    </div>
  );
}

export default Home;