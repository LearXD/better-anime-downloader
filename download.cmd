@echo off

if not exist "build" (
    echo Pasta "build" não encontrada.
    echo Compilando codigo...
    tsc
)

if not exist "build\index.js" (
    echo Arquivo "index.js" não encontrado na pasta "build".
    echo Compilando codigo...
    tsc
) 

node . %*