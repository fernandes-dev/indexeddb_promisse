//check for support
if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB')
}


//Criar banco e tabela
let dbPromise = idb.open('PWA_Offline', 1, function (upgradeDb) {
    console.log('Criando novo Object Store')
    if (!upgradeDb.objectStoreNames.contains('hoteis')) {
        let hoteisOS = upgradeDb.createObjectStore('hoteis', {
            keyPath: 'id',
            autoIncrement: true
        })
        hoteisOS.createIndex('nome', 'nome', { unique: true })
        hoteisOS.createIndex('city', 'city', { unique: false })
        hoteisOS.createIndex('price', 'price', { unique: false })
    }
})


function addHotel(hotel) {
    if (hotel) {
        //Inserir os dados
        dbPromise.then(function (db) {
            let tx = db.transaction('hoteis', 'readwrite')
            let hoteis = tx.objectStore('hoteis')
            hoteis.add(hotel)
            return tx.complete
        })
        .then(() => document.getElementById('status').innerHTML = 'Hotel cadastrado com sucesso')
        .catch(() => document.getElementById('status').innerHTML = 'Erro ao cadastrar Hotel')
    }
}


function getHotel(id) {
    if (id) {
        //Obter os dados
        dbPromise.then(db => {
            let tx = db.transaction('hoteis', 'readonly')
            let hoteis = tx.objectStore('hoteis')
            return hoteis.get(id)
        })
        .then(val => console.dir(val))
    }
}


function alterHotel(hotel) {
    if (hotel) {
        //Alterar os dados
        dbPromise.then(function (db) {
            var tx = db.transaction('hoteis', 'readwrite')
            var hoteis = tx.objectStore('hoteis')
            hoteis.put(hotel)
            return tx.complete
        }).then(function () {
            console.log('Hotel alterado!')
        })
    }
}

function deleteHotel(id) {
    if (id) {
        //Deleta os dados
        dbPromise.then(function (db) {
            var tx = db.transaction('hoteis', 'readwrite')
            var hoteis = tx.objectStore('hoteis')
            let key = 1
            hoteis.delete(key)
            return tx.complete
        }).then(function () {
            console.log('Hotel deletado')
        })
    }
}

function getAllHoteis() {
    dbPromise.then(function (db) {
        var tx = db.transaction('hoteis', 'readonly')
        var store = tx.objectStore('hoteis')
        return store.getAll()
    }).then(function (hoteis) {
        let i
        hoteis.forEach(hotel => {
            if (i <= hoteis.length) {
                document.getElementById('allCity').innerHTML += `<input hidden id="${hotel.id}${hotel.city}" name="city" type="text" value="${hotel.city}">`
                document.getElementById('allPrice').innerHTML += `<input hidden id="${hotel.id}${hotel.price}" name="price" type="text" value="${hotel.price}">`
                document.getElementById('allName').innerHTML += `<input id="${hotel.id}${hotel.nome}" name="name" type="text" value="${hotel.nome}">
                <input hidden id="${hotel.id}" name="id" type="text" value="${hotel.id}">
                <button onclick="editForm('register_form', ['${hotel.id}${hotel.nome}', '${hotel.id}${hotel.city}', '${hotel.id}${hotel.price}'], 'edit')">Editar</button>`
            } else {
                document.getElementById('allCity').innerHTML = `<input hidden id="${hotel.id}${hotel.city}" name="city" type="text" value="${hotel.city}">`
                document.getElementById('allPrice').innerHTML = `<input hidden id="${hotel.id}${hotel.price}" name="price" type="text" value="${hotel.price}">`
                document.getElementById('allName').innerHTML = `<input id="${hotel.id}${hotel.nome}" name="name" type="text" value="${hotel.nome}">
                <input hidden id="${hotel.id}" name="id" type="text" value="${hotel.id}">
                <button onclick="editForm('register_form', ['${hotel.id}','${hotel.id}${hotel.nome}', '${hotel.id}${hotel.city}', '${hotel.id}${hotel.price}'], 'edit')">Editar</button>`
            }
            console.log(hotel)
            i = hoteis.length
        })
    })
}

function listAllHoteis() {
    dbPromise.then(function (db) {
        var tx = db.transaction('hoteis', 'readonly')
        var store = tx.objectStore('hoteis')
        return store.getAll()
    }).then(function (hoteis) {
        let i
        hoteis.forEach(hotel => {
            let element = document.getElementById('list')
            if (element) {
                if (i <= hoteis.length) {
                    document.getElementById('list').innerHTML += `<li class="list-group-item">
                    <div class="d-flex justify-content-between">
                        <span>${hotel.nome}</span>
                        <span>${hotel.city}</span>
                        <span class="text-danger"><b>R$ ${hotel.price}</b></span>
                    </div>
                </li>`
                } else {
                    document.getElementById('list').innerHTML = `<li class="list-group-item">
                    <div class="d-flex justify-content-between">
                        <span>${hotel.nome}</span>
                        <span>${hotel.city}</span>
                        <span class="text-danger"><b>R$ ${hotel.price}</b></span>
                    </div>
                </li>`
                }
            }
            console.log(hotel)
            i = hoteis.length
        })
    })
}