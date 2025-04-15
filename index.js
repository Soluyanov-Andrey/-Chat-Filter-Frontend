import "./index.scss"
import "./zeroing.scss"

// Импортируем компаненты
import { FileList } from './component/fileList.js'; 
import { MessageModal } from './component/customModal.js'; 
import { CheckboxList } from './component/checkboxList.js'; 
import { PageLoader } from './component/pageLoader.js'; 


import {
  FolderStructureService,
  createFolderApi,
  deleteSelectApi,
  getScanApi, 
  laveSelectApi,
  lookPageApi,
} from './serviceApi.js';


import {
  removeLastDirectoryFromPath,
  updateTextInput 
} from './additionalFunctions.js'


import { gethData, postData } from './fetchData.js'
import makePanelResizable from './limiterMovement.js'


document.addEventListener('DOMContentLoaded', function() {

  let lastClickedItem = null;  // Внешняя переменная для item


  let currentPath = "/media/andrey/Рабочий/flash/linux/manul"; // Объявляем переменную
  let savecurrentPath = currentPath;

  const fileListElement = document.getElementById('my-file-list');
  const modal = document.getElementById('message-modal');
  const checkboxList = document.getElementById('checkbox-list');


  // function deleteSelect1(){
  //   console.log('jj');
    
  // }

  // lookPageBtn.addEventListener("click", deleteSelect1);



//-------------------------------------------------------------------------------
// блоки кода событий на кнопках
//-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
    const lookPageBtn = document.getElementById('lookPageBtn');
    const rightPanel = document.querySelector('.right-panel'); // Получаем ссылку на right-panel по классу


    let pageLoaderInstance = null; // Объявляем pageLoaderInstance в глобальной области видимости

    async function lookSelected(){
      
      let arraySelect = checkboxList.getSelectedIndices();
      const result = await lookPageApi(arraySelect);
    
      if (result.message === 'Страница из выбранных элементов создана') {
        try {
          checkboxList.classList.toggle('hidden'); //Скрываем компанент classList меняя стиль 
          lookPageBtn.disabled = true; //Скрываем кнопку Смотрим страницы добавляя атрибут  disabled к html <button id="lookPageBtn" disabled>
          backBtn.disabled = false; //Отображаем кнопку вернутся назад
    
          pageLoaderInstance = document.createElement('page-loader');
          pageLoaderInstance.setAttribute('page-url', 'http://localhost:3000/LOOK.html'); 
          rightPanel.appendChild(pageLoaderInstance); // Добавляем в right-panel
        } catch (error) {
          console.error("Ошибка при вызове getSelected в ", error);
        }
        return;
      }
    }
    
    lookPageBtn.addEventListener("click",lookSelected);
  //-------------------------------------------------------------------------------


  //-------------------------------------------------------------------------------
    const deleteSelectBtn = document.getElementById('deleteSelectBtn');
    async function deleteSelect(){

      let arraySelect = checkboxList.getSelectedIndices();

      const result = await deleteSelectApi(arraySelect);
      
      if (result.message === 'Элементы успешно удалены') {
        lookPageBtn.disabled = true;
        (async () => {
          try {
            const result = await getSelected();
            console.log("Результат getSelected:", result);
            // ... Дальнейшая обработка результата ...
          } catch (error) {
            console.error("Ошибка при вызове getSelected:", error);
            // Обработка ошибки
          }
        })();
        modal.openModal(result.message);
        return;
      }
    }
    deleteSelectBtn.addEventListener("click", deleteSelect);
  //-------------------------------------------------------------------------------


  //-------------------------------------------------------------------------------
    const laveSelectBtn = document.getElementById('leaveSelectBtn');
    async function laveSelected(){

      let arraySelect = checkboxList.getSelectedIndices();
      
      const result = await laveSelectApi(arraySelect);
      if (result.message === 'Элементы успешно удалены') {
        (async () => {
          try {
            const result = await getSelected();
            
            console.log("в laveSelected() Результат getSelected: ", result);
            // ... Дальнейшая обработка результата ...
          } catch (error) {
            console.error("Ошибка при вызове getSelected в ", error);
            // Обработка ошибки
          }
        })();
        modal.openModal(result.message);
        return;
      }
    }
    laveSelectBtn.addEventListener("click", laveSelected);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
    const scanBtn = document.getElementById("scanBtn");
    async function getSelected() {

      const result = await getScanApi();

      if (result && result.receivedData) {

        const receivedData = result.receivedData;
        const newDataString = JSON.stringify(receivedData);
        checkboxList.setAttribute('data', newDataString);

        console.log(receivedData); // Выведет массив receivedData
        // Теперь можно работать с receivedData, например:
        // receivedData.forEach(item => console.log(item)); // Выведет каждый элемент массива
        // const firstItem = receivedData[0]; // Получить первый элемент
        // console.log(firstItem);
      } else {
        console.log("Ошибка: receivedData не найдено или result равно null/undefined.");
      }
      
    }
    scanBtn.addEventListener("click", getSelected);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
    const backBtn = document.getElementById("backBtn");

    function functionhanbackBtn() {

      pageLoaderInstance.remove(); //Удаляем компанент pageLoaderInstance
      checkboxList.classList.toggle('hidden', false);//Показываем classList меняя стиль
      lookPageBtn.disabled = false; //Показываем кнопку Смотрим страницы убирая атрибут  disabled к html <button id="lookPageBtn">
      backBtn.disabled = true; //Отображаем кнопку вернутся назад

    }

    backBtn.addEventListener("click", functionhanbackBtn);
  //-------------------------------------------------------------------------------



  //-------------------------------------------------------------------------------
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
// Обработка обработчиков из зарегестрированных в компанентах
//-------------------------------------------------------------------------------


  //checkboxList событие selected-changed
  //-------------------------------------------------------------------------------
    checkboxList.addEventListener('selected-changed', (event) => {
      
      const shouldDisable = Array.isArray(event.detail) 
      ? event.detail.length === 0
      : true; // отключаем, если это не массив

      lookPageBtn.disabled = shouldDisable;

      const selectedIndices = event.detail; // Теперь detail — это сам массив
      console.log('Выбранные индексы:', selectedIndices);
    });
  //-------------------------------------------------------------------------------


  //fileListElement событие item-click
  //-------------------------------------------------------------------------------
    document.addEventListener('item-click', (event) => {
      const index = event.detail.index; // Получаем индекс из detail
      const data = fileListElement.data; // Получаем данные из компонента
      const item = data[index]; // Получаем элемент данных по индексу

      lastClickedItem = item; // Записываем во внешнюю переменную
      console.log('Кликнули на элемент:', item);
    
    });
  //-------------------------------------------------------------------------------





  //fileListElement событие item-double-click 
  /**-------------------------------------------------------------------------------
   * Обработчик события двойного клика на элементе списка.
   * Определяет тип элемента (папка, "назад" или другой) и выполняет соответствующее действие.
   * @param {Event} event - Объект события двойного клика. Содержит информацию о событии,
   *                        включая индекс элемента, на котором произошел клик.
   */
  document.addEventListener('item-double-click', async (event) => {
    const index = event.detail.index; // Индекс элемента, на котором произошел двойной клик (например: 11).
    const data = fileListElement.data; // Массив данных, отображаемых в списке (например: [{name: ' sh скрипты', type: 'folder-'}, {name: '7zip', type: 'folder-'}, {name: 'UFW сетевой экран', type: 'folder-'}]).
    const item = data[index]; // Объект данных, соответствующий элементу, на котором произошел двойной клик (например: {name: 'mysql', type: 'folder-'}).

    if (!item) {
      console.warn("Двойной клик на несуществующем элементе.");
      return; // Прерываем выполнение, если item не существует.
    }

    switch (true) {
      case isBackNavigationItem(item):
        handleBackButtonClick(); // Выполняем переход назад, если это элемент навигации "назад".
        break;
      case isFolder(item):
        await handleFolderDoubleClick(item); // Обрабатываем двойной клик на папке.
        break;
      default:
        console.log("Двойной клик на элементе, который не является ни папкой, ни кнопкой 'назад'. Ничего не делаем.");
        // Ничего не делаем, если это не папка и не кнопка "назад"
        break;
    }
  });
    
    /**
     * Проверяет, является ли элемент элементом навигации "назад" ("...........").
     * @param {object} item - Объект, представляющий элемент списка.
     * @returns {boolean} - True, если это элемент "назад", иначе false.
     */
    function isBackNavigationItem(item) {
      
      
      return item && item.name === '...................';
    }
    


    /**
     * Проверяет, является ли элемент папкой.
     * @param {object} item - Объект, представляющий элемент списка.
     * @returns {boolean} - True, если это папка, иначе false.
     */
    function isFolder(item) {
      const isActuallyAFolder = item.type && item.type.startsWith('folder') && item.name;
      console.log(!!isActuallyAFolder);
      return !!isActuallyAFolder;
    }
    


    /**
     * Обрабатывает двойной клик на папке.
     * @param {object} item - Объект, представляющий папку.
     */
    async function handleFolderDoubleClick(item) {
      const folderName = item.name;
      const newPath = constructNewPath(currentPath, folderName);
    
      currentPath = newPath; // Обновляем текущий путь
      updateTextInput(newPath, "#input");
      fileListElement.dataLoader = createDataLoader(currentPath);
    
      try {
        const newData = await FolderStructureService.getFolderStructure(currentPath);
        newData.unshift({ name: '...................', type: 'folder-' });
        fileListElement.data = newData;
        lastClickedItem = null;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }
    



    /**
     * Конструирует новый путь на основе текущего пути и имени папки.
     * @param {string} currentPath - Текущий путь.
     * @param {string} folderName - Имя папки.
     * @returns {string} - Новый путь.
     */
    function constructNewPath(currentPath, folderName) {
      let newPath = currentPath;
      if (!currentPath.endsWith('/')) {
        newPath += '/';
      }
      newPath += folderName;
      return newPath;
    }


  /**
   * Обрабатывает нажатие кнопки "назад", осуществляя переход к предыдущей директории.
   *
   * Функция выполняет следующие действия:
   * 1.  Удаляет последнюю директорию из текущего пути (`currentPath`).
   * 2.  Обновляет текстовое поле в UI (`#input`) новым путем.
   * 3.  Загружает структуру папок для нового пути с помощью `FolderStructureService`.
   * 4.  Добавляет элемент "назад" ("...................") в начало списка, если новый путь не совпадает с путем сохранения (`savecurrentPath`).
   * 5.  Обновляет данные в UI-элементе `fileListElement`, отображающем структуру папок.
   * 6.  Обновляет `currentPath` новым путем.
   * 7.  Сбрасывает `lastClickedItem` в `null`.
   *
   * @async
   * @function handleBackButtonClick
   * @throws {Error} Если происходит ошибка при загрузке структуры папок.
   */
    async function handleBackButtonClick(){
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
//-------------------------------------------------------------------------------



//-------------------------------------------------------------------------------
// Загружаем код для перетаскивания разделительной линии
//-------------------------------------------------------------------------------


  makePanelResizable('.resize-handle', '.left-panel', '.container');

});

//-------------------------------------------------------------------------------




