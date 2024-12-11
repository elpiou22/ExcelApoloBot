const ExcelJS = require('exceljs');
const {getMembers, getMaxNumbers} = require("./parseData");
const fs = require("fs");
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Feuille1');

////////////////////////////////////////////
// exports
module.exports = {
    createExcel,
};
////////////////////////////////////////////

let lineStartNumber  = 3;
let columnStartNumber = "B";
let columnEndNumber = "I";
let columnsCharacter   = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];



function writeAllMembers(members){







    worksheet.getColumn(2).width = 20;
    for (let index = 0; index < members.length ; index++) {
        let playerName = members[index];
        let cellAdress = columnStartNumber + (index + lineStartNumber);

        let cell = worksheet.getCell(cellAdress);
        cell.value = playerName;
        switch (index) {
            case 0:
                cell.border = {
                    top  : { style: 'thin', color: { argb: 'FF000000' } }, 
                    left : { style: 'thin', color: { argb: 'FF000000' } }, 
                    right: { style: 'thin', color: { argb: 'FF000000' } },
                  };
            break;
            case members.length -1:
                cell.border = {
                    left  : { style: 'thin', color: { argb: 'FF000000' } }, 
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    right : { style: 'thin', color: { argb: 'FF000000' } },
                  };
            break;
            default:
                cell.border = {
                    left : { style: 'thin', color: { argb: 'FF000000' } }, 
                    right: { style: 'thin', color: { argb: 'FF000000' } },
                  };
            break;
        }
        cell.font = {
            bold: true, 
        };

    }
}

function writeDays() {


    for (let index = 0; index < 8; index++) {
        let cell = worksheet.getCell(columnsCharacter[index + 1] + (lineStartNumber -1));
        
        //console.log(columnsCharacter[index] + lineStartNumber);
        
        switch (index) {
            case 0:
                cell.border = {
                    top   : { style: 'thin', color: { argb: 'FF000000' } }, 
                    left  : { style: 'thin', color: { argb: 'FF000000' } }, 
                    right : { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                  };
            break;
            default:
                cell.value = "J" + index;
                cell.border = {
                    top   : { style: 'thin', color: { argb: 'FF000000' } }, 
                    left  : { style: 'thin', color: { argb: 'FF000000' } }, 
                    right : { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                  };
            break;
        }
        cell.font = {
            bold: true, 
        };
        
    }
}



function addConditionalFormattingRule(members){

    worksheet.addConditionalFormatting({
        ref: `${columnStartNumber}${lineStartNumber}:${columnEndNumber}${getMaxNumbers(members) + lineStartNumber}`,
        rules: [
            {
                type: 'expression',
                formulae: [`${columnStartNumber}${lineStartNumber}=1`],
                style: {
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFB5FF87' }, // vert
                    },
                },
            },
            {
                type: 'expression',
                formulae: [`AND(${columnStartNumber}${lineStartNumber}=0, LEN(${columnStartNumber}${lineStartNumber})>0)`],
                style: {
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ffb8b8' }, // rouge clair
                    },
                },
            },
            {
                type: 'expression',
                formulae: [`${columnStartNumber}${lineStartNumber}=-1`],
                style: {
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '874040' }, // rouge foncé
                    },
                },
            },
        ],
    });
}


function findCell(name, members) {
    //console.log(members);
    for (let index = 0; index < getMaxNumbers(members); index++) {
        let cell = worksheet.getCell("B" + (index + lineStartNumber));
        if (cell.value === name){
            return cell;
        }
    }
    return null;
}


function putDataOfTheDay(day, data, members) {

    //let data = JSON.parse(fs.readFileSync('../json/exportToExcel.json', 'utf8'));



    let index = 0;
    for (let key in data) {
        let playerName = key;
        let playerBonus = data[playerName];
        let cell = findCell(playerName, members);
        if (cell !== null){
            let columnCharacter = columnsCharacter[day + 1]; 

            let cellBonus = worksheet.getCell(columnCharacter + cell.fullAddress.row);
            //console.log("(" + cell.fullAddress.row + ", " + cell.fullAddress.col + ")");
            //console.log("(" + cellBonus.fullAddress.row + ", " + cellBonus.fullAddress.col + ")");
            cellBonus.value = playerBonus;
        }
        //console.log();


        index ++;
    }


}




function finishExcel(path){
    workbook.xlsx.writeFile(path)
    .catch(err => console.error('Erreur lors de la création du fichier :', err));

}




function createExcel(data, members, path){
    writeAllMembers(getMembers(members));
    writeDays();

    for (let i = 0; i < data.length; i++) {
        const dayData = data[i];
        putDataOfTheDay((i + 1), dayData, members);

    }
    addConditionalFormattingRule(members);
    finishExcel(path);
}

