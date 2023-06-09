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
      this.style.heighxt = this.scrollHeight + 'px';
    });
    document.getElementById('Submt').addEventListener('submit',(event) => {
      event.preventDefault()
      let input = document.createElement('input')
      input.type = 'text'
      input.name = 'Checked'
      input.value = getChecked()
      let form = document.getElementById('Submt')
      let input2 = document.createElement('input')
      input2.type = 'text'
      input2.name = 'Indexes'
      input2.value = Array.from(document.querySelectorAll('.secretIndex')).map(el => el.value);
      form.appendChild(input)
      form.appendChild(input2)
      form.submit()
    })
    function getChecked() {
      const checkboxes = document.querySelectorAll('.checkbox')
      let arr = new Array(checkboxes.length)
      checkboxes.forEach((el,i) => {
        el.checked ? arr[i] = 1: arr[i] = 0
      })
      return arr
    }

    $(document).ready(function() {
      $('.checkbox').on('change', function() {
        var isChecked = $(this).is(':checked');
        $(this).siblings('.Title-text').toggleClass('checked', isChecked);
        $(this).parents('.element').find('.Description-text').toggleClass('checked', isChecked);
      });
    });

    $(function() {
      $("#taskList").sortable({
        axis:'y',
        containment: "parent"
      }).disableSelection()
    })
  })