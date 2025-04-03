import { gethData } from './fetchData.js';

  const API_BASE_URL = 'http://localhost:3000';

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

  export const CreateFolderService = {
    postPath: async (path) => {
      const url = `${API_BASE_URL}/create-folder`; // Укажите endpoint для POST-запроса
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Указываем, что отправляем JSON
          },
          body: JSON.stringify({ path: path }) // Преобразуем данные в JSON
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json(); // Получаем данные из ответа (если нужно)
        return data; // Возвращаем полученные данные
      } catch (error) {
        console.error('Ошибка при отправке path методом POST:', error);
        throw error;
      }
    }
  };