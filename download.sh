#!/bin/bash
if [ ! -d "build" ]; then
    echo "Pasta 'build' não encontrada."
    echo "Executando o comando 'tsc'..."
    tsc
fi
if [  ! -f "build/index.js" ]; then
  echo "Arquivo 'index.js' não encontrado na pasta 'build'."
  echo "Compilando codigo..."
  tsc
fi

node . "$@"