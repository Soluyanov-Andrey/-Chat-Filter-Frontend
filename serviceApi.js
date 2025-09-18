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
      console.log('ApiFolderStructureService');
      const encodedPath = encodeURIComponent(path);
      const url = `${API_BASE_URL}/folder-structure?path=${encodedPath}`;
      try {
        const data = await gethData(url);
    
       
        return data.data.folders; // Преобразуем данные в нужный формат
      } catch (error) {
        console.error('Ошибка при получении структуры папок:', error);
        throw error;
      }
    }
  };

  
  //Создаем папку Document в указаной папки на сервере
  export const createFolderApi = async (path) => {
    console.log('createFolderApi');
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

  //Сканируем документ и выбираем из него темы
  export const getScanApi = async () => {
    console.log('getScanApi');
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

   //Сканируем начальный файл в папке document выбираем темы
  export const openDocumentApi = async (path) => {
    console.log('openDocumentApi');
    
    const url = `${API_BASE_URL}/open-document?path=${path}`; // Добавляем path как query parameter
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
      console.log(data);
      
      return data;
    } catch (error) {
      console.error('Ошибка при обработки getScanApi', error);
      throw error;
    }
  };

  export const openThemesApi = async (path, index) => {
    console.log('openThemesApi');
    
    const url = `${API_BASE_URL}/open-themes?path=${path}&index=${index}`; // Добавляем path как query parameter
    try {
      console.log('index-',index);
      
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
      console.error('Ошибка при обработки openThemesApi', error);
      throw error;
    }
  };

  export const deleteSelectApi = async (arraySelect) => {
    console.log('deleteSelectApi');

    const url = `${API_BASE_URL}/delete-select`;
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
    console.log('laveSelectApi');

    const url = `${API_BASE_URL}/lave-selected`;
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
      console.error('Ошибка при обработки laveSelectApi', error);
      throw error;
    }
  };

  export const lookPageApi = async (arraySelect) => {
    console.log('lookPageApi');
    const url = `${API_BASE_URL}/look-page`;
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
      console.error('Ошибка при обработки lookPageApi ', error);
      throw error;
    }
  };

  export const createPageApi = async (path, indexTheme) => {
    console.log('createPageApi');
    const url = `${API_BASE_URL}/create-page`;
    try {

      const requestBody = {
        path: path,
        indexTheme: indexTheme
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Ошибка при обработки createPageApi', error);
      throw error;
    }
  };
  
  
export const createTopicApi = async (path ,topicValue) => {
    console.log('createTopicApi');
    const url = `${API_BASE_URL}/create-topic`;

    try {

      const requestBody = {
        path: path,
        topicValue: topicValue
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
     });
      console.log(requestBody);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
     const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Ошибка при обработки createPageApi', error);
      throw error;
    }
  };