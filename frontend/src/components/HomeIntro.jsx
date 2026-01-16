import { useNavigate } from "react-router-dom";
import introImage from "../assets/intro.jpg";

export default function HomeIntro() {
  const navigate = useNavigate();
  return (
    <div id="intro">
      <div id="introText">
        <p>
          Nonna di Napoli brings the warmth and flavor of a true Italian home
          straight to your door. Classic Neapolitan dishes with a modern touch —
          perfect for lunch, a relaxed dinner, or a weekend gathering. <br></br>
          <br></br>Homestyle recipes, Mediterranean ingredients, and the aromas
          of Naples, all prepared with care and delivered fresh. Pair with a
          good wine, put on some music, and let Nonna cook for you.
        </p>
        <button onClick={() => navigate("/menu")}> Menu</button>
      </div>

      <img src={introImage} />
    </div>
  );
}
