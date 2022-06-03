import fs from 'fs';


//Convertendo binario em arquivo
export const base64_decode = (base64str, fileName) => {
    var bitmap = new Buffer(base64str, 'base64');
    fs.writeFileSync('src/temp/' + fileName + '', bitmap, 'binary');
    return ('src/temp/' + fileName)
}

//Convertendo arquivo em binário
export const base64_encode = (fileName) => {
    var bitmap = fs.readFileSync(fileName, "utf8");
    return new Buffer(bitmap).toString('base64');
}
