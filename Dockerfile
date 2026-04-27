FROM node:20

WORKDIR /home/node/app

# 🔥 copia só dependências primeiro (cache inteligente)
COPY package*.json ./

RUN npm install

# 🔥 depois copia o resto do projeto
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]