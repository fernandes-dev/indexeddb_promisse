// Registro do ServiceWorker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw')
            .then((registration) => {
                // Quando registrar com sucesso
                console.log('Service Worker Registrado com sucesso. Escopo: ' + registration.scope)
            }, (err) => {
                // Quando falhar
                console.log('Erro ao registrar Service Worker: ' + err)
            })
    })
}

let host = 'http://eduardo:8080'

if (location.hostname === "localhost")
    host = 'http://localhost:8080'

const register = `${host}/register`

window.onpopstate = (event) => {
    if (event.state !== null) {
        let url = event.state.url
        let route = `${host}${url}`
        axios.get(route).then((req, res) => {
            document.documentElement.innerHTML = req.data
        })
    } else {
        axios.get('/')
            .then((req, res) => {
                document.documentElement.innerHTML = req.data
                goRegister()
            })
    }
}

function editForm(form, inputs = []) {
    if (form) {
        const date = new Date()
        let dateTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (${date.getTimezoneOffset() / 60})`
        let hotel = {
            nome: (document.getElementById(inputs[0]).value),
            city: (document.getElementById(inputs[1]).value),
            price: (document.getElementById(inputs[2]).value),
            created: dateTime
        }
        document.getElementById('name').value = (document.getElementById(inputs[0]).value)
        document.getElementById('city').value = (document.getElementById(inputs[1]).value)
        document.getElementById('price').value = (document.getElementById(inputs[2]).value)
        if (operation === 'add') {
            addHotel(hotel)
        } else if (operation === 'edit') {
            alterHotel(hotel)
        }
        console.log(hotel)
    }
}

function sendForm(form, inputs = [], operation) {
    if (form) {
        console.log('preventDefault nesse form: ' + form)
        document.getElementById(form).addEventListener('submit', event => {
            event.preventDefault()
            const date = new Date()
            let dateTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (${date.getTimezoneOffset() / 60})`
            let hotel = {
                nome: (document.getElementById(inputs[0]).value),
                city: (document.getElementById(inputs[1]).value),
                price: (document.getElementById(inputs[2]).value),
                created: dateTime
            }
            document.getElementById(inputs[0]).value = ''
            document.getElementById(inputs[1]).value = ''
            document.getElementById(inputs[2]).value = ''
            if (operation === 'add') {
                addHotel(hotel)
            } else if (operation === 'edit') {
                alterHotel(hotel)
            }
            console.log(hotel)
        })
    }
}

function goRegister() {
    let btnRegister = document.getElementById('register_page')

    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            axios.get(register)
                .then((req, res) => {
                    document.documentElement.innerHTML = req.data
                    const stateObj = { url: "/register" }
                    history.pushState(stateObj, "Registro", "/register")
                    sendForm('register_form', ['name', 'city', 'price'], 'add')
                    listAll()
                })
        })
    }
} goRegister()

function listAll() {
    document.getElementById('list_all').addEventListener('click', () => {
        getAllHoteis()
    })
}

document.onreadystatechange = function () {

    if (document.readyState === 'complete') {
        listAllHoteis()
        let current_url = window.location.href
        const register_regex = /\/register/g
        if (register_regex.test(current_url)) {
            //chama a função sendForm quando atualizar a página
            sendForm('register_form', ['name', 'city', 'price'], 'add')
            listAll()
            console.log('chamou a função')
        }

    }

}