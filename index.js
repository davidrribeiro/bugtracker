const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

//Configs
const docId = '1LUkJreRxfFQBUeXFgc1kV7OZNgpP5Z4v_H8kpqXqKYk'
const worksheetIndex = 0
const sendgridkey = 'MY_API_SENDGRID'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', async (request, response) => {
    try {
        const doc = new GoogleSpreadsheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        console.log('Planilha aberta')
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
            name: request.body.name,
            email: request.body.email,
            issueType: request.body.issueType,
            source: request.query.source || 'direct',
            userAgent: request.body.userAgent,
            userDate: request.body.userDate
        })

        // Se for crítico

        if (request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(/*SET API*/)
            const msg = {
                to: 'talkdsign@gmail.com',
                from: 'talkdsign@gmail.com',
                subject: 'Erro Crítico reportado',
                text: `
                O usuário ${request.body.name} reportou um problema`,
                html: `O usuário <strong>${request.body.name}</strong> reportou um problema`,
            }
            await sgMail.send(msg)

        }


        response.render('sucesso')
    } catch (err) {
        response.send('Erro ao enviar o formulário.')
        console.log(err)
    }
})


app.listen(3000, (err) => {
    if (err) {
        console.log('Aconteceu algum erro', err)
    } else {
        console.log('BugTracker rodando no endereço: http://localhost:3000')
    }
})