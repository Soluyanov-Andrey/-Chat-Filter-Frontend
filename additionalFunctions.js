export  function removeLastDirectoryFromPath(path) {
    // Handle empty path (Обработка пустого пути)
    if (!path) {
      return ""; // Or null, or throw an error, depending on your needs
    }
  
    // Ensure the path starts with a slash (Убедитесь, что путь начинается со слеша)
    if (!path.startsWith("/")) {
      console.warn("Path should start with a slash.  Adding one for now.");
      path = "/" + path; // Добавляем слеш, если его нет
    }
  
    // Split the path into segments (Разделяем путь на сегменты)
    const pathParts = path.split("/");
  
    // Remove the last segment (Удаляем последний сегмент)
    pathParts.pop();
  
    // Handle the root directory case (Обработка случая корневого каталога)
    if (pathParts.length === 1 && pathParts[0] === "") {
      return "/"; // If only a root slash remains, return it.
    }
  
    // Join the segments back together (Соединяем сегменты обратно)
    const newPath = pathParts.join("/");
  
    // Handle the case where we've removed everything except the initial slash
    return newPath || "/";  // Ensure we return "/" for the root directory
  }
  
 

export  function updateTextInput(text, inputElementSelector) {
    // 1. Get the input element (получаем элемент input)
    const inputElement = document.querySelector(inputElementSelector);
  
    // 2. Check if the element exists (проверяем, существует ли элемент)
    if (!inputElement) {
      console.error(`Element with selector "${inputElementSelector}" not found.`);
      return; // Exit the function if the element is not found
    }
  
    // 3. Update the value of the input element (обновляем значение элемента input)
    inputElement.value = text;
  }
