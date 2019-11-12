const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

//Configs
const docId='1LUkJreRxfFQBUeXFgc1kV7OZNgpP5Z4v_H8kpqXqKYk'
const worksheetIndex = 0

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', (request, response)=> {
    const doc = new GoogleSpreadsheet(docId)
    doc.useServiceAccountAuth(credentials, (err) =>{
    if (err) {
        console.log('Não foi possível abrir a planilha')
    } else {
        console.log('Planilha aberta')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[worksheetIndex]
            worksheet.addRow({name: request.body.name, email: request.body.email}, err =>{
                response.send('bug reportado com sucesso')
            })

        })

    }
})  

})


app.listen(3000, (err) => {
    if (err) {
        console.log('Aconteceu algum erro', err)
    } else {
        console.log('BugTracker rodando no endereço: http://localhost:3000')
    }
})