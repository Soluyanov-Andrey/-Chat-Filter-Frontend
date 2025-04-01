import { gethData } from './fetchData.js';

  const API_BASE_URL = 'http://localhost:3000';

  const FolderService = {
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

  export default FolderService;