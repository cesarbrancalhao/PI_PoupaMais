-- Esquema do Banco de Dados PoupaMais para PostgreSQL

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE idioma_enum AS ENUM ('portugues', 'ingles', 'espanhol');
CREATE TYPE moeda_enum AS ENUM ('real', 'dolar', 'euro');

CREATE TABLE config (
    id SERIAL PRIMARY KEY,
    tema BOOLEAN NOT NULL DEFAULT FALSE,
    idioma idioma_enum NOT NULL DEFAULT 'portugues',
    moeda moeda_enum NOT NULL DEFAULT 'real',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL UNIQUE REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE categoria_despesa (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(70) NOT NULL,
    cor VARCHAR(7) NOT NULL DEFAULT '#898989',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE fonte_receita (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(70) NOT NULL,
    cor VARCHAR(7) NOT NULL DEFAULT '#898989',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE despesa (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(70) NOT NULL,
    valor DECIMAL(11,2) NOT NULL CHECK (valor > 0),
    recorrente BOOLEAN NOT NULL DEFAULT FALSE,
    data DATE NOT NULL,
    data_vencimento DATE DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    categoria_despesa_id INT REFERENCES categoria_despesa(id),
    usuario_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE receita (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(70) NOT NULL,
    valor DECIMAL(11,2) NOT NULL CHECK (valor > 0),
    recorrente BOOLEAN NOT NULL DEFAULT FALSE,
    data DATE NOT NULL,
    data_vencimento DATE DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fonte_receita_id INT REFERENCES fonte_receita(id),
    usuario_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE meta (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(70) NOT NULL,
    valor DECIMAL(11,2) NOT NULL CHECK (valor > 0),
    economia_mensal DECIMAL(11,2) NOT NULL DEFAULT 0 CHECK (economia_mensal >= 0),
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

-- Criar índices para melhor desempenho
CREATE INDEX idx_config_usuario_id ON config(usuario_id);
CREATE INDEX idx_categoria_despesa_usuario_id ON categoria_despesa(usuario_id);
CREATE INDEX idx_fonte_receita_usuario_id ON fonte_receita(usuario_id);
CREATE INDEX idx_despesa_usuario_id ON despesa(usuario_id);
CREATE INDEX idx_receita_usuario_id ON receita(usuario_id);
CREATE INDEX idx_meta_usuario_id ON meta(usuario_id);
