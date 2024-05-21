import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus?.length
    ? [...data.focus].sort((evtA, evtB) =>
        new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
      )
    : [];
  const nextCard = () => {
    setTimeout(
      () => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0),
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
