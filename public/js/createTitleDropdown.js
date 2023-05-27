document.addEventListener("DOMContentLoaded",() => {
    const button = document.getElementById('plus')
    const titleForm = document.getElementById('todoTitle')
    const closeBtn = document.getElementsByClassName('close')[0]
    const closeUpdate = document.getElementsByClassName("updateClose")[0]
    const updateForm = document.getElementById('updateTitle')
    const updateBtn = document.getElementsByClassName('updBtn')[0]
    button.addEventListener('click',() => {
        titleForm.style.display = 'block'
    })
    closeBtn.addEventListener('click',() => {
        titleForm.style.display = "none"
    })
    updateBtn.addEventListener('click',() => {
        updateForm.style.display = 'block'
    })

    closeUpdate.addEventListener('click',() => {
        updateForm.style.display = 'none'
    })
    function getToTheList() {
        window.location.href = `/showTodo:${this.titleName}`
    }
})