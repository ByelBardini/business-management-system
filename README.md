# Sistema de Gerenciamento Empresarial

Este projeto é um sistema completo de gerenciamento de empresas, usuários e produtos, desenvolvido com foco em aplicações web modernas. 
Ele permite autenticação de usuários com JWT, gerenciamento de permissões, upload de imagens de produtos e um painel administrativo com funcionalidades completas.
Esse projeto foi desenvolvido para a segunda avaliação da matéria de Programação Frontend II, ao qual desenvolvi a parte do backend, e os fetchs dos produtos, bem como a aplicação da CSP

## Tecnologias Utilizadas

- **Backend:** Node.js + Express
- **Banco de Dados:** MySQL
- **Autenticação:** JWT + Cookies HTTPOnly
- **Upload de Arquivos:** Multer
- **Frontend:** HTML, CSS, JavaScript Vanilla
- **Armazenamento Local:** LocalStorage e SessionStorage
- **Segurança:** Content Security Policy (CSP)

## Funcionalidades

- Login seguro com JWT e cookies
- Validação de sessões
- Gerenciamento de usuários com controle de permissão (admin/usuário)
- CRUD completo de produtos com imagem
- Painel de produtos com dark mode
- Modal para adicionar e editar usuários e produtos
- Upload e visualização de imagem via `base64`
- Proteção contra acesso não autorizado

## Como executar o projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/sistema-gerenciamento-empresarial.git

2. **Configure o banco de dados**

    De acordo com o arquivo `versao-1.sql`, configure o banco de dados MySQL e crie uma conexão para que o sistema acesse.

3. **Adicione o arquivo db.js na pasta src**

    Ao fazer isso, coloque lá as informações de conexão com o banco de dados.