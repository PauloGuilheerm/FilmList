set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

FORCE_INSTALL=false
SKIP_START=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force-install)
      FORCE_INSTALL=true
      shift
      ;;
    --skip-start)
      SKIP_START=true
      shift
      ;;
    *)
      echo "Opção desconhecida: $1"
      echo "Uso: ./scripts/start.sh [--force-install] [--skip-start]"
      exit 1
      ;;
  esac
done

if [[ "$FORCE_INSTALL" = true || ! -d node_modules ]]; then
  echo "Instalando dependências..."
  npm install
else
  echo "Dependências já instaladas. Pulando 'npm install'. Use --force-install para reinstalar."
fi

if [[ "$SKIP_START" = false ]]; then
  echo "Iniciando servidor de desenvolvimento..."
  npm run dev
else
  echo "Instalação finalizada. Execução do servidor pulada."
fi

