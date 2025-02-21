FROM node:18
WORKDIR /app

# 必要なパッケージを最小限にインストール
RUN apt update && apt install -y \
    curl \
    unzip \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# AWS CLI を `arm64` バージョンでインストール（M1/M2 Mac 向け）
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws

# AWS CLI のインストール確認
RUN /usr/local/bin/aws --version

# アプリの依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]