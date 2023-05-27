document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("addTodo");
    const todoForm = document.getElementById('todoForm');
    const closeBtn = document.getElementsByClassName('close')[0];
  
    button.addEventListener('click', () => {
      todoForm.style.display = "block";

    });
  
    closeBtn.addEventListener('click', () => {
      todoForm.style.display = "none";
    });

    const updateButtons = document.querySelectorAll('.updBtn');
    const updateForms = document.querySelectorAll('.updateForm');
    const closeUpdateBtns = document.querySelectorAll('.closeUpdate');
    updateButtons.forEach((updateButton, index) => {
      updateButton.addEventListener('click', () => {
        updateForms[index].style.display = "block";
      });
    });
    
    closeUpdateBtns.forEach((closeUpdateBtn, index) => {
      closeUpdateBtn.addEventListener('click', () => {
        updateForms[index].style.display = "none";
      });
    });    
    const text = document.getElementById('myTxtarea');
              
    text.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

    const textarea = document.getElementById('myTextarea');
              
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

    const textarea1 = document.getElementById('myTxtAr');
                  
    textarea1.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
    const text1 = document.getElementById('myTxt');
    text1.addEventListener('input',function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

  })