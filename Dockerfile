FROM node:16.17-alpine3.15

# appディレクトリ作成
WORKDIR /usr/src/app

# package.json と package-lock.json をコピー
COPY package*.json ./

# npm install 実行
RUN npm install

# Bundle app source
COPY . .

# distディレクトリを作成するためにbuild
RUN npm run build

# distのmain.jsからサーバー起動
CMD [ "node", "dist/main.js" ]