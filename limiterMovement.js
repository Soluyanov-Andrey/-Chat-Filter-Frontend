function makePanelResizable(resizeHandleSelector, leftPanelSelector, containerSelector) {
    const resizeHandle = document.querySelector(resizeHandleSelector);
    const leftPanel = document.querySelector(leftPanelSelector);
    const container = document.querySelector(containerSelector);
  
    let isResizing = false;
  
    if (!resizeHandle || !leftPanel || !container) {
      console.error("Не найдены элементы для изменения размера панели.");
      return; // Exit if required elements are missing
    }
  
    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    });
  
    function resize(e) {
      if (isResizing) {
        const newWidth = e.clientX - container.offsetLeft;
        if (newWidth > 600 && newWidth < 1500) {
          leftPanel.style.width = `${newWidth}px`;
        }
      }
    }
  
    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', resize);
    }
  }

  export default makePanelResizable;