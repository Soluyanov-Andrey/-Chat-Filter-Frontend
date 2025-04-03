import "./index.scss"
import "./zeroing.scss"
import { gethData, postData } from './fetchData.js'
import { FileList } from './fileList.js'; // Импортируем FileList
import { MessageModal } from './CustomModal.js'; // Импортируем FileList
import { FolderStructureService } from './serviceApi.js';
import makePanelResizable from './limiterMovement.js'
import { removeLastDirectoryFromPath , updateTextInput } from './additionalFunctions.js'


let lastClickedItem = null;  // Внешняя переменная для item


let currentPath = "/media/andrey/Рабочий/flash/linux/manul"; // Объявляем переменную

const fileListElement = document.getElementById('my-file-list');




//-------------------------------------------------------------------------------
// блок вызова событий на кнопки
//-------------------------------------------------------------------------------

const backBtn = document.getElementById("backBtn");
async function handleBackButtonClick() {
  let newPath = removeLastDirectoryFromPath(currentPath);
  updateTextInput(newPath,"#input");
    // Загружаем данные
    try {
      const newData = await FolderStructureService.getFolderStructure(newPath);  // Используем currentPath
      fileListElement.data = newData;
      currentPath =  newPath;
      lastClickedItem = null;
         
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      alert('Ошибка при переходе в папку.');
    }
 
}
backBtn.addEventListener("click", handleBackButtonClick);




const modal = document.querySelector('message-modal');
const addFolderBtn = document.getElementById("addFolderBtn");

 function handleAddFolderButtonClick() {

 console.log(modal);

 modal.openModal("Новое сообщение из JavaScript!"); 
 console.log(currentPath);
 console.log(lastClickedItem);
 
}

addFolderBtn.addEventListener("click", handleAddFolderButtonClick);

//-------------------------------------------------------------------------------




//-------------------------------------------------------------------------------
// блок вызова fileListElement.dataLoader
//-------------------------------------------------------------------------------


const createDataLoader = (path) => {
  return async () => {
    updateTextInput(path,"#input");
    return await FolderStructureService.getFolderStructure(path);
  };
};

// Инициализация dataLoader (с начальным путем)
fileListElement.dataLoader = createDataLoader(currentPath); // Создаем dataLoader
//-------------------------------------------------------------------------------




//-------------------------------------------------------------------------------
// Обработка обработчиков из fileListElement
//-------------------------------------------------------------------------------

document.addEventListener('item-click', (event) => {
  const index = event.detail.index; // Получаем индекс из detail
  const data = fileListElement.data; // Получаем данные из компонента
  const item = data[index]; // Получаем элемент данных по индексу

  lastClickedItem = item; // Записываем во внешнюю переменную
 

  console.log('Кликнули на элемент:', item);
 
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
    updateTextInput(newPath,"#input");
    // Обновляем dataLoader
    fileListElement.dataLoader = createDataLoader(currentPath);

    // Загружаем данные
    try {
      const newData = await FolderStructureService.getFolderStructure(currentPath);  // Используем currentPath
      fileListElement.data = newData;
      lastClickedItem = null;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      alert('Ошибка при переходе в папку.');
    }
  } else {
    console.log('Двойной клик на файле:', item, index);
    alert(`Вы двойным кликом выбрали файл: ${item ? item.name : ' (элемент не найден)'}`);
  }
});


//-------------------------------------------------------------------------------
// Загружаем код для перетаскивания разделительной линии
//-------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  makePanelResizable('.resize-handle', '.left-panel', '.container');
});

//-------------------------------------------------------------------------------




