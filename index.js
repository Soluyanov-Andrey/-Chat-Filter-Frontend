import "./index.scss"
//import "images/big.jpg"
import "./zeroing.scss"

import { FileList } from './FileList.js'; // Импортируем FileList

// const initialData = [
//   { name: ' sh скрипты1', type: 'folder-' },
//   { name: '7zip', type: 'folder+' },
//   { name: 'UFW сетевой экран', type: 'folder-' },
//   { name: 'chrom', type: 'file' }
// ];

const fileListElement = document.getElementById('my-file-list');
// fileListElement.data = initialData;

const path = "/media/andrey/Рабочий/flash/linux/manul"; // Пример пути, который нужно передать
const encodedPath = encodeURIComponent(path); // Кодируем путь для URL


const apiUrl = `http://localhost:3000/folder-structure?path=${encodedPath}`; // Замените на ваш URL

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    fileListElement.data = data.receivedData.folders; 
    console.log(data.receivedData.folders); // Обработайте данные, полученные от API
    // Здесь можно обновить UI, отобразить данные и т.д.
  })
  .catch(error => {
    console.error('Ошибка при получении данных:', error);
    // Здесь можно отобразить сообщение об ошибке пользователю
  });





const resizeHandle = document.querySelector('.resize-handle');
const leftPanel = document.querySelector('.left-panel');
const container = document.querySelector('.container');

let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
  isResizing = true;
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
});

function resize(e) {
  if (isResizing) {
    
    const newWidth = e.clientX - container.offsetLeft;
    if(newWidth>600 && newWidth<1500){
    leftPanel.style.width = `${newWidth}px`;
    }
  }
}

function stopResize() {
  isResizing = false;
  document.removeEventListener('mousemove', resize);
}



