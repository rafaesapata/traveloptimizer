from flask import Flask, request, send_from_directory, jsonify
import os
import subprocess
import signal
import time
import atexit

app = Flask(__name__, static_folder='../')

# Iniciar o servidor Node.js como um processo separado
node_process = None

def start_node_server():
    global node_process
    try:
        # Iniciar o servidor Node.js
        node_process = subprocess.Popen(
            ['node', '../server/index.js'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        print("Servidor Node.js iniciado com PID:", node_process.pid)
        
        # Aguardar um momento para o servidor iniciar
        time.sleep(2)
        
        return True
    except Exception as e:
        print("Erro ao iniciar o servidor Node.js:", e)
        return False

def stop_node_server():
    global node_process
    if node_process:
        print("Encerrando servidor Node.js...")
        try:
            os.kill(node_process.pid, signal.SIGTERM)
            node_process.wait(timeout=5)
        except:
            try:
                os.kill(node_process.pid, signal.SIGKILL)
            except:
                pass
        node_process = None

# Iniciar o servidor Node.js quando a aplicação Flask iniciar
start_node_server()

# Registrar função para encerrar o servidor Node.js quando a aplicação Flask for encerrada
atexit.register(stop_node_server)

# Rota para servir arquivos estáticos
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path == "" or not os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, 'index.html')
    return send_from_directory(app.static_folder, path)

# Rota para verificar status do servidor Node.js
@app.route('/api/status')
def status():
    global node_process
    if node_process and node_process.poll() is None:
        return jsonify({"status": "running", "pid": node_process.pid})
    else:
        # Tentar reiniciar o servidor se estiver parado
        if start_node_server():
            return jsonify({"status": "restarted", "pid": node_process.pid})
        return jsonify({"status": "stopped"})

# Rota para proxy das APIs do Node.js
@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy_api(path):
    # Esta rota serve apenas para verificação, as requisições reais vão diretamente para o Node.js
    return jsonify({"message": "API proxy route", "path": path})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
