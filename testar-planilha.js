const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet('1LUkJreRxfFQBUeXFgc1kV7OZNgpP5Z4v_H8kpqXqKYk')
    await promisify(doc.useServiceAccountAuth) (credentials)
    console.log('Planilha aberta')
    const info = await promisify(doc.getInfo) ()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({name: 'David Ribeiro', email: 'test@test.com'})
}

addRowToSheet()

/*

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

*/