
# AL CLONAR EL REPOSITORIO (Paso 1)
npm install
 
# INICIAR DB (Paso 2)
npm run json:server
- Si da error: npm install -g json-server

# INICIAR SERVER (Paso 3)
ng serve -o

# SUBIR CAMBIOS AL HOST (Paso 4.1)
ng build --configuration production --aot

# ENVIAR CAMBIOS AL HOST (Paso 4.2)
firebase deploy
