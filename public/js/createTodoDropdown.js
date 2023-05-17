document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("addTodo");
    const todoForm = document.getElementById('todoForm');
    const closeBtn = document.getElementsByClassName('close')[0];
  
    button.addEventListener('click', () => {
      todoForm.style.display = "block";
      console.log('hi');
    });
  
    closeBtn.addEventListener('click', () => {
      todoForm.style.display = "none";
    });
  });
  
  $('textarea').on('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
  