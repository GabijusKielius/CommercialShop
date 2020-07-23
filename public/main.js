// main.js

window.addEventListener("DOMContentLoaded", () => {
    const updateButton = document.querySelector('#update-button')
    const deleteButton = document.querySelector('#delete-button')
    const messageDiv = document.querySelector('#message')

    updateButton.addEventListener('click', _ => {
        fetch('/tractors', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: 'John Deere',
                type: '5060E'
            })
        })
            .then(res => {
                if (res.ok) return res.json()
            })
            .then(response => {
                window.location.reload(true)
            })
    })


    deleteButton.addEventListener('click', _ => {
        fetch('/tractors', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: 'Claas'
            })
        })
            .then(res => {
                if (res.ok) return res.json()
            })
            .then(response => {
                if (response === 'No model to delete') {
                    messageDiv.textContent = 'No model to delete!'
                } else {
                    window.location.reload(true)
                }
            })
            .catch(console.error)
    })
})

