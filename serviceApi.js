import { gethData } from './fetchData.js';

  const API_BASE_URL = 'http://localhost:3000';

  //------------------------------------------------
  // Если в будущем потребуется более сложная логика для получения структуры папок 
  // (например, разные стратегии получения структуры в зависимости от окружения, 
  // кэширование результатов, обработка ошибок, логирование), то FolderStructureService 
  // станет хорошим местом для реализации этой логики.
 //------------------------------------------------

  export const FolderStructureService = {
    getFolderStructure: async (path) => {
      const encodedPath = encodeURIComponent(path);
      const url = `${API_BASE_URL}/folder-structure?path=${encodedPath}`;
      try {
        const data = await gethData(url);
        return data.receivedData.folders; // Преобразуем данные в нужный формат
      } catch (error) {
        console.error('Ошибка при получении структуры папок:', error);
        throw error;
      }
    }
  };
  //Создаем папку Document в указаной папки на сервере
  export const createFolderApi = async (path) => {
    const url = `${API_BASE_URL}/create-folder`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: path })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при обработки createFolderApi', error);
      throw error;
    }
  };

  //Сканируем документ и выбираем темы
  export const getScanApi = async () => {
   
    const url = `${API_BASE_URL}/scan`; // Добавляем path как query parameter
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Можно опустить для GET запросов
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при обработки getScanApi', error);
      throw error;
    }
  };

  export const deleteSelectApi = async (arraySelect) => {
    const url = `${API_BASE_URL}/delete_select`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(arraySelect)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Ошибка при обработки deleteSelect', error);
      throw error;
    }
  };

  export const laveSelectApi = async (arraySelect) => {
    const url = `${API_BASE_URL}/lave_selected`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(arraySelect)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Ошибка при обработки deleteSelect', error);
      throw error;
    }
  };