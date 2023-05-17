document.addEventListener("DOMContentLoaded",() => {
    const button = document.getElementById('plus')
    const titleForm = document.getElementById('todoTitle')
    const closeBtn = document.getElementsByClassName('close')
    button.addEventListener('click',() => {
        titleForm.style.display = 'block'
    })
    closeBtn.addEventListener('click',() => {
        titleForm.style.display = "none"
    })
})