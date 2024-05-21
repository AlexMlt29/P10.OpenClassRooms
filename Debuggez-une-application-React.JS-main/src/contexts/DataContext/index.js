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

  const sortEventsByDate = (events) => 
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

  const getData = useCallback(async () => {
    try {
      const fetchedData = await api.loadData();
      if (fetchedData && fetchedData.events) {
        const sortedEvents = sortEventsByDate(fetchedData.events);
        setData({ ...fetchedData, events: sortedEvents });
        setLast(sortedEvents[0]);
      }
    } catch (err) {
      setError(err);
    }
  }, []);

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
