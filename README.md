# Desafio tecnico leitor de arquivos CNAB

Este desafio tem a proposta de melhorar uma CI que le arquivos cnab.
Um CNAB é um arquivo posicional, sendo que cabeçalho é as duas primeiras linhas do arquivo e seu rodapé as duas ultimas.

Ele é dividido por segmentos *P*, *Q* e *R*, cada linha começa com um codigo que tem no final o tipo de segmento:

```
0010001300002Q 012005437734000407NTT BRASIL COMERCIO E SERVICOS DE TECNOLAVENIDA DOUTOR CHUCRI ZAIDAN, 1240 ANDARVILA SAO FRANCI04711130SAO PAULO      SP0000000000000000                                        000
```
Neste exemplo o **Q** aparece na posição/coluna 14, cada posição representa algo dentro do arquivo cnab.


hoje ao rodar:

```bash
node cnabRows.js
```

temos o seguinte output:

```bash
node cnabRows.js --help
Uso: cnabRows.js [options]

Opções:
      --help      Exibe ajuda                                         [booleano]
      --version   Exibe a versão                                      [booleano]
  -f, --from      posição inicial de pesquisa da linha do Cnab
                                                          [número] [obrigatório]
  -t, --to        posição final de pesquisa da linha do Cnab
                                                          [número] [obrigatório]
  -s, --segmento  tipo de segmento                        [string] [obrigatório]
  -d, --dir       caminho do arquivo                                    [string]
  -c, --company   nome da empresa                                       [string]

Exemplos:
  cnabRows.js -f 21 -t 34 -s p              lista a linha e campo que from e to
                                            do cnab
  cnabRows.js -f 21 -t 34 -s p -c BRASIL    lista as empresas que contem BRASIL
                                            no nome e salva no JSON
  cnabRows.js -f 21 -t 34 -s p -d ./files/  lista a linha e campo que from e to
  cnab.rem                                  do cnab na pasta especificada

Faltando argumentos obrigatórios: f, t, s
```