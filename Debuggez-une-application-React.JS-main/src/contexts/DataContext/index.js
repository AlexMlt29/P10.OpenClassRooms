import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const response = await fetch("/events.json");
    const json = await response.json();
    return json;
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  // Fonction pour trier les événements par date, du plus récent au plus ancien
  const sortEventsByDate = (events) => 
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Fonction pour charger les données et les traiter, encapsulée dans useCallback pour mémoïser la fonction
  const getData = useCallback(async () => {
    try {
      // Appel de l'API pour charger les données
      const fetchedData = await api.loadData();
      // Vérifie si fetchedData existe et si fetchedData.events est un tableau
      if (fetchedData && Array.isArray(fetchedData.events)) {
        // Trie les événements par date
        const sortedEvents = sortEventsByDate(fetchedData.events);
        // Met à jour l'état avec les données triées
        setData({ ...fetchedData, events: sortedEvents });
        // Met à jour l'état 'last' avec le plus récent des événements triés
        setLast(sortedEvents[0]);
      } else {
        // Si fetchedData n'a pas de champ events ou n'est pas dans le bon format,
        // met à jour l'état avec les données non modifiées
        setData(fetchedData);
      }
    } catch (err) {
      // En cas d'erreur lors du chargement des données, met à jour l'état 'error'
      setError(err);
    }
  }, []); // Utilisation d'un tableau de dépendances vide pour mémoriser la fonction et ne la créer qu'une seule fois

  useEffect(() => {
    if (!data) {
      getData();
    }
  }, [data, getData]);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        last,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
