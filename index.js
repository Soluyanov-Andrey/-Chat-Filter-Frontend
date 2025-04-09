import "./index.scss"
import "./zeroing.scss"
import { gethData, postData } from './fetchData.js'

// Импортируем компаненты
import { FileList } from './component/fileList.js'; 
import { MessageModal } from './component/customModal.js'; 
import { CheckboxList } from './component/checkboxList.js'; 

import { FolderStructureService , createFolderApi, getScanApi} from './serviceApi.js';
import makePanelResizable from './limiterMovement.js'
import { removeLastDirectoryFromPath , updateTextInput } from './additionalFunctions.js'


let lastClickedItem = null;  // Внешняя переменная для item


let currentPath = "/media/andrey/Рабочий/flash/linux/manul"; // Объявляем переменную
let savecurrentPath = currentPath;

const fileListElement = document.getElementById('my-file-list');
const modal = document.getElementById('message-modal');
const checkboxList = document.getElementById('checkbox-list');


  const newData = ["новый элемент 1", "новый элемент 2", "новый элемент 3",, "новый элемент 2", "новый элемент 3"];
  const newDataString = JSON.stringify(newData);
  checkboxList.setAttribute('data', newDataString);



//-------------------------------------------------------------------------------
// блок вызова событий на кнопках
//-------------------------------------------------------------------------------

const scanBtn = document.getElementById("scanBtn");

async function getSelected() {

  const result = await getScanApi(currentPath);

  if (result && result.receivedData) {
    const receivedData = result.receivedData

    const newDataString = JSON.stringify(receivedData);
    checkboxList.setAttribute('data', newDataString);

    console.log(receivedData); // Выведет массив receivedData
    // Теперь вы можете работать с receivedData, например:
    // receivedData.forEach(item => console.log(item)); // Выведет каждый элемент массива
    // const firstItem = receivedData[0]; // Получить первый элемент
    // console.log(firstItem);
  } else {
    console.log("Ошибка: receivedData не найдено или result равно null/undefined.");
  }
  
}

scanBtn.addEventListener("click", getSelected);




const backBtn = document.getElementById("backBtn");
async function handleBackButtonClick() {
  let newPath = removeLastDirectoryFromPath(currentPath);
  updateTextInput(newPath,"#input");
    // Загружаем данные
    try {
      const newData = await FolderStructureService.getFolderStructure(newPath);  // Используем currentPath
      if( newPath != savecurrentPath) {
      newData.unshift({ name: '...................', type: 'folder-' });
      //тут происходит вставка в элемент fileListElement
     }
      fileListElement.data = newData;
      currentPath =  newPath;
      lastClickedItem = null;
         
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
 
}
backBtn.addEventListener("click", handleBackButtonClick);





const addFolderBtn = document.getElementById("addFolderBtn");

async function handleAddFolderButtonClick() {

  if (lastClickedItem?.type === 'folder+') {
    
    modal.openModal("В папке уже есть папка document");
    return;
  }

  if (lastClickedItem){
  let path = currentPath+'/'+lastClickedItem.name;

    await createFolderApi(path);
    modal.openModal("Папка создана");
    // Загружаем данные
    try {
      const newData = await FolderStructureService.getFolderStructure(currentPath);  // Используем currentPath
      fileListElement.data = newData;
      
        
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
    
    

  }
}

addFolderBtn.addEventListener("click", handleAddFolderButtonClick);

//-------------------------------------------------------------------------------




//-------------------------------------------------------------------------------
// Блок вызова fileListElement.dataLoader
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

// Проверяем, нужно ли выполнить handleBackButtonClick
if (item && item.name === '...................') {
  handleBackButtonClick(); // Выполняем функцию

  // Прерываем дальнейшее выполнение функции-обработчика
  return; // Выходим из обработчика события
}
  
  
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
      newData.unshift({ name: '...................', type: 'folder-' });
      
      //тут происходит вставка в элемент fileListElement
      fileListElement.data = newData;
      lastClickedItem = null;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  } else {
    console.log('Двойной клик на файле:', item, index);
    
  }
});


//-------------------------------------------------------------------------------
// Загружаем код для перетаскивания разделительной линии
//-------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  makePanelResizable('.resize-handle', '.left-panel', '.container');
});

//-------------------------------------------------------------------------------




