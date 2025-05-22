CREATE SCHEMA `si-25-7a` ;

CREATE TABLE `si-25-7a`.`empresa` (
  `id_empresa` INT NOT NULL AUTO_INCREMENT,
  `nome_empresa` VARCHAR(45) NOT NULL,
  `cnpj_empresa` BIGINT NOT NULL,
  PRIMARY KEY (`id_empresa`));

CREATE TABLE `si-25-7a`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome_usuario` VARCHAR(45) NOT NULL,
  `login_usuario` VARCHAR(45) NOT NULL,
  `senha_usuario` VARCHAR(45) NOT NULL,
  `tipo_usuario` INT NOT NULL,
  `id_empresa_usuario` INT NOT NULL,
  PRIMARY KEY (`id_usuario`),
  INDEX `id_empresa_usuario_idx` (`id_empresa_usuario` ASC) VISIBLE,
  CONSTRAINT `id_empresa_usuario`
    FOREIGN KEY (`id_empresa_usuario`)
    REFERENCES `si-25-7a`.`empresa` (`id_empresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `si-25-7a`.`produto` (
  `id_produto` INT NOT NULL AUTO_INCREMENT,
  `nome_produto` VARCHAR(45) NOT NULL,
  `preco_produto` DOUBLE NOT NULL,
  `quantidade_estoque` INT NOT NULL,
  `imagem_produto` MEDIUMBLOB NOT NULL,
  `descricao_produto` TEXT NOT NULL,
  `id_empresa_produto` INT NOT NULL,
  PRIMARY KEY (`id_produto`),
  INDEX `id_empresa_produto_idx` (`id_empresa_produto` ASC) VISIBLE,
  CONSTRAINT `id_empresa_produto`
    FOREIGN KEY (`id_empresa_produto`)
    REFERENCES `si-25-7a`.`empresa` (`id_empresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO empresa(id_empresa, nome_empresa, cnpj_empresa)
VALUES (1,'SUPER CAMISAS',34483925000152),
	   (2,'MEGA CALÇAS',88463211000101);

INSERT INTO usuario(id_usuario, nome_usuario, login_usuario, senha_usuario, tipo_usuario, id_empresa_usuario)
VALUES(1, 'JOÃO', 'ADMINCAMISAS', 'admin', 0, 1),
      (2, 'MARIA', 'MARIACAMISAS', 'senha', 1, 1),
      (3, 'HEITOR', 'ADMINCALCAS', 'admin', 0, 2);