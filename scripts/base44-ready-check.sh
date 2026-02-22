#!/usr/bin/env bash
set -euo pipefail

root="${1:-.}"

required=(
  "package.json"
  "src"
)

missing=0
for item in "${required[@]}"; do
  if [[ ! -e "$root/$item" ]]; then
    echo "MISSING: $item"
    missing=1
  else
    echo "OK: $item"
  fi
done

if [[ $missing -eq 1 ]]; then
  echo "\nStatus: repositório ainda não contém o código do app Base44."
  exit 2
fi

echo "\nStatus: estrutura mínima encontrada."
