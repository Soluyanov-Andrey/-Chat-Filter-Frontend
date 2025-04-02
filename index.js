import "./index.scss"
//import "images/big.jpg"
import "./zeroing.scss"
import { gethData, postData } from './fetchData.js'
import { FileList } from './fileList.js'; // Импортируем FileList
import FolderService from './serviceApi.js';
import makePanelResizable from './limiterMovement.js'
// const initialData = [
//   { name: ' sh скрипты1', type: 'folder-' },
//   { name: '7zip', type: 'folder+' },
//   { name: 'UFW сетевой экран', type: 'folder-' },
//   { name: 'chrom', type: 'file' }
// ];

const fileListElement = document.getElementById('my-file-list');
const backBtn = document.getElementById("backBtn");



//---------------------------------------
// блок вызова fileListElement.dataLoader
//---------------------------------------
let currentPath = "/media/andrey/Рабочий/flash/linux/manul"; // Объявляем переменную

const createDataLoader = (path) => {
  return async () => {
    return await FolderService.getFolderStructure(path);
  };
};

// Инициализация dataLoader (с начальным путем)
fileListElement.dataLoader = createDataLoader(currentPath); // Создаем dataLoader
//---------------------------------------




//------------------------------------------
// Обработка обработчиков из fileListElement
//------------------------------------------

document.addEventListener('item-click', (event) => {
  const index = event.detail.index; // Получаем индекс из detail
  const data = fileListElement.data; // Получаем данные из компонента
  const item = data[index]; // Получаем элемент данных по индексу

  console.log('Кликнули на элемент:', item, index);
  alert(`Вы кликнули на: ${item ? item.name : ' (элемент не найден)'}`); // Проверяем item на null
});

document.addEventListener('item-double-click', async (event) => {
  const index = event.detail.index;
  const data = fileListElement.data;
  const item = data[index];

  if (item && item.type.startsWith('folder') && item.name) {
    const folderName = item.name;

    // Формируем новый путь
    let newPath = currentPath;
    if (!currentPath.endsWith('/')) {
      newPath += '/';
    }
    newPath += folderName;

    // Обновляем currentPath
    currentPath = newPath; // Обновляем текущий путь

    // Обновляем dataLoader
    fileListElement.dataLoader = createDataLoader(currentPath);

    // Загружаем данные
    try {
      const newData = await FolderService.getFolderStructure(currentPath);  // Используем currentPath
      fileListElement.data = newData;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      alert('Ошибка при переходе в папку.');
    }
  } else {
    console.log('Двойной клик на файле:', item, index);
    alert(`Вы двойным кликом выбрали файл: ${item ? item.name : ' (элемент не найден)'}`);
  }
});


//-------------------------------------------------------
// Загружаем код для перетаскивания разделительной линии
//-------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  makePanelResizable('.resize-handle', '.left-panel', '.container');
});

//-------------------------------------------------------




