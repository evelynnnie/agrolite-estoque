Agrolite - Controle de Estoque de Insumos 🌾
============================================

O projeto consiste em um sistema de gerenciamento de estoque composto por uma API REST (backend) e um aplicativo mobile (React Native + Expo) integrado.

🛠️ Como Rodar o Backend
------------------------

1.  Certifique-se de ter o **Node.js** instalado.
    
2.  Abra o terminal e entre na pasta do backend:
    ```bash
    cd backend
    ```
    
3.  Instale as dependências:
    ```bash
    npm install
    ```
    
4.  Inicie o servidor em modo de desenvolvimento:
    ```bash
    npm run dev
    ```
    

_O servidor estará rodando em http://localhost:3000._

📱 Como Rodar o Aplicativo (Mobile)
-----------------------------------

1.  Abra um novo terminal e navegue até a pasta do mobile:
    ```bash
    cd mobile
    ```
    
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
    
3.  Crie um arquivo chamado **.env** na raiz da pasta mobile e adicione a variável de ambiente com o **IP da sua máquina local**:
    ```bash
    EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
    ```

    (Substitua SEU_IP_LOCAL pelo IP real da sua máquina na rede para que o Expo Go consiga se conectar).

4. Inicie o Expo:
   ```bash
    npx expo start
    ```

5.  Abra o aplicativo **Expo Go** no seu celular físico e escaneie o QR Code gerado no terminal.
    

💡 O que eu faria a mais com mais tempo
---------------------------------------

Caso houvesse mais tempo disponível para o desenvolvimento, eu implementaria as seguintes melhorias:

1.  Substituiria o armazenamento em memória do backend por um banco de dados relacional leve utilizando o **Prisma ORM**, garantindo que os dados inseridos fossem salvos permanentemente mesmo se o servidor reiniciasse.
    
2.  Adicionaria a funcionalidade de exportação de dados utilizando os módulos nativos do Expo (expo-file-system e expo-sharing) para permitir que o usuário gerasse uma planilha do estoque atual e a compartilhasse via WhatsApp ou E-mail.
    
3.  Utilizaria a biblioteca expo-image-picker para habilitar a câmera do celular no formulário de cadastro, permitindo anexar fotos reais aos lotes de insumos.
