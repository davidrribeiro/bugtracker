const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

const doc = new GoogleSpreadsheet('1LUkJreRxfFQBUeXFgc1kV7OZNgpP5Z4v_H8kpqXqKYk')
doc.useServiceAccountAuth(credentials, (err) =>{
    if (err) {
        console.log('Não foi possível abrir a planilha')
    } else {
        console.log('Planilha aberta')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({name: 'Tulio', email: 'teste@test.com'}, err =>{
                console.log('Linha inserida')
            })

        })

    }
})