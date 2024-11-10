
FROM node:20.1.0 as build

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json /app/

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação para o container
COPY . /app/

# Exponha a porta na qual a aplicação vai rodar
EXPOSE 3001

# Comando para rodar a aplicação
CMD ["npm", "start"]
