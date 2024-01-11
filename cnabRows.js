'use strict';
import path from 'path'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url';
import fs from "fs";
import yargs from 'yargs'
import chalk from 'chalk'

const COMPANY_START_ROW = 33;
const COMPANY_END_ROW = 73;
const ADDRESS_START_ROW = 73;
const ADDRESS_END_ROW = 153;

const optionsYargs = setupYargs();
const { from, to, segmento, dir = getDefaultDir(), company } = optionsYargs

function main( ){
  readFile(dir, 'utf8')
  .then(file => {
    const cnabArray = file.split('\n')
    
    if (company) {
      handleCompanySearch(cnabArray, company);
      return;
    }
    
    handleSegmentSearch(cnabArray, segmento, from, to);
  })
  .catch(error => {
    console.log("🚀 ~ file: cnabRows.js ~ line 76 ~ error", error)
  })
}


function setupYargs() {
  return yargs(process.argv.slice(2))
  .usage('Uso: $0 [options]')
  .option("f", { alias: "from", describe: "posição inicial de pesquisa da linha do Cnab", type: "number", demandOption: true })
  .option("t", { alias: "to", describe: "posição final de pesquisa da linha do Cnab", type: "number", demandOption: true })
  .option("s", { alias: "segmento", describe: "tipo de segmento", type: "string", demandOption: true })
  .option("d", { alias: "dir", describe: "caminho do arquivo", type: "string"})
  .option("c", { alias: "company", describe: "nome da empresa", type: "string" })
  .example('$0 -f 21 -t 34 -s p', 'lista a linha e campo que from e to do cnab')
  .example('$0 -f 21 -t 34 -s p -c BRASIL', 'lista as empresas que contem BRASIL no nome e salva no JSON')
  .example('$0 -f 21 -t 34 -s p -d ./files/cnab.rem', 'lista a linha e campo que from e to do cnab na pasta especificada')
  .argv;
}

function getDefaultDir() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(`${__dirname}/cnabExample.rem`);
}

function sliceArrayPosition(arr, ...positions) {
  return [...arr].slice(...positions);
}

function messageLog(segmento, segmentoType, from, to) {
  return `
  ----- Cnab linha ${segmentoType} -----
  
  posição from: ${chalk.inverse.bgBlack(from)}
  
  posição to: ${chalk.inverse.bgBlack(to)}
  
  item isolado: ${chalk.inverse.bgBlack(segmento.substring(from - 1, to))}
  
  item dentro da linha ${segmentoType}: 
  ${segmento.substring(0, from)}${chalk.inverse.bgBlack(segmento.substring(from - 1, to))}${segmento.substring(to)}
  
  ----- FIM ------
  `;
}

function handleCompanySearch(cnabArray, company) {
  const array = sliceArrayPosition(cnabArray, 2, -2);
  const lineDataList = getLineDataList(array, company);
  const jsonList = getJsonList(lineDataList);
  writeToFile(jsonList);
}

function getLineDataList(array, company) {
  return array.map((row) => {
    if(row.includes(company)){
      const initial = row.search(company)+1
      if(initial>= COMPANY_START_ROW && initial < COMPANY_END_ROW){
        return {
          row,
          initial,
          final: initial+company.length-1,
        }
      }
    }
  }).filter(Boolean);
}

function getJsonList(lineDataList) {
  const jsonList = [];
  if (lineDataList.length) {
    lineDataList.forEach((lineData)=>{
      const segmentType = lineData.row.split('').find(
        letter => ['P', 'Q', 'R'].includes(letter)
        )
        console.log(messageLog(lineData.row, segmentType, lineData.initial, lineData.final))
        jsonList.push({
          companyName: lineData.row.substring(COMPANY_START_ROW, COMPANY_END_ROW).trim(),
          companyAddress: lineData.row.substring(ADDRESS_START_ROW, ADDRESS_END_ROW).trim(),
        })
      })
    }
    return jsonList;
  }
  
  function writeToFile(jsonList) {
    fs.writeFile("cnabCompanies.json", JSON.stringify(jsonList), (err) => {
      if (err) {
        console.error("Error on write File:", err);
      } else {
        console.log("File created successfully");
      }
    });
  }
  
  function handleSegmentSearch(cnabArray, segmento, from, to) {
    const [cnabBodySegmentoP, cnabBodySegmentoQ, cnabBodySegmentoR] = sliceArrayPosition(cnabArray, 2, -2);
    sliceArrayPosition(cnabArray, -2);
    
    if (segmento === 'p') {
      console.log(messageLog(cnabBodySegmentoP, 'P', from, to));
      return;
    }
    
    if (segmento === 'q') {
      console.log(messageLog(cnabBodySegmentoQ, 'Q', from, to));
      return;
    }
    
    if (segmento === 'r') {
      console.log(messageLog(cnabBodySegmentoR, 'R', from, to));
      return;
    }
  }
  
console.time('leitura Async')
main()
console.timeEnd('leitura Async')