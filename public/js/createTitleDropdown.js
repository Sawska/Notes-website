document.addEventListener("DOMContentLoaded",() => {
    const button = document.getElementById('plus')
    const titleForm = document.getElementById('todoTitle')
    const closeBtn = document.getElementsByClassName('close')[0]
    const closeUpdate = document.querySelectorAll(".updateClose")
    const updateForm = document.querySelectorAll('.TitleUpdate')
    const updateBtn = document.querySelectorAll('.updBtn')
    button.addEventListener('click',() => {
        titleForm.style.display = 'block'
    })
    closeBtn.addEventListener('click',() => {
        titleForm.style.display = "none"
    })

   

    updateBtn.forEach((updBtn, index) => {
        updBtn.addEventListener('click', () => {
          updateForm[index].style.display = 'block';
        });
      });
      
      closeUpdate.forEach((clsUpdt, index) => {
        clsUpdt.addEventListener('click', () => {
          updateForm[index].style.display = 'none';
        });
      });
})