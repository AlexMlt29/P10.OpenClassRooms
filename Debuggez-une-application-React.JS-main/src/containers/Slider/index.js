import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus?.length  // Vérifie si data et data.focus existent et ont une longueur non nulle
  ? [...data.focus]                     // Clone le tableau data.focus
      .sort((evtA, evtB) =>             // Trie les événements par date décroissante
        new Date(evtB.date) - new Date(evtA.date))  
  : [];                                 // Si data.focus est vide ou n'existe pas, retourne un tableau vide
  const nextCard = () => {
    setTimeout(
      () => setIndex(index < byDateDesc.length -1 ? index + 1 : 0),
      5000
    );
  };

  useEffect(() => {
    nextCard();
  }, [index, byDateDesc.length]);

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event) => (
        <div key={event.id} className="SlideCardWrapper">
          <div
            className={`SlideCard SlideCard--${
              byDateDesc.indexOf(event) === index ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((paginationEvent) => (
            <input
              key={`radio-${paginationEvent.id}`}
              type="radio"
              name="radio-button"
              checked={index === byDateDesc.indexOf(paginationEvent)}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
