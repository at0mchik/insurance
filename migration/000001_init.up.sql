-- Таблица пользователей
CREATE TABLE users
(
    id              serial       not null unique,
    name            VARCHAR(100) NOT NULL,
    username        varchar(255) not null unique,
    password_hash   varchar(255) not null,
    role            VARCHAR(20)  NOT NULL, -- client, assessor, manager, admin
    gender          VARCHAR(10),
    phone           VARCHAR(20),
    email           VARCHAR(100) UNIQUE,
    passport_number VARCHAR(20),
    age             INT,
    info            VARCHAR(50)
);

-- Таблица страховых полисов
CREATE TABLE policies
(
    id          serial      not null unique,
    client_id   INT         NOT NULL REFERENCES users (id),
    policy_type VARCHAR(50) NOT NULL,
    start_date  DATE        NOT NULL,
    end_date    DATE        NOT NULL,
    premium     INT         NOT NULL
);

-- Таблица деталей полиса
CREATE TABLE policy_details
(
    id        serial not null unique,
    policy_id INT    NOT NULL REFERENCES policies (id) ON DELETE CASCADE,
    details   JSONB
);

-- Таблица запросов на оценку
CREATE TABLE assessment_requests
(
    id           serial not null unique,
    client_id    INT    NOT NULL REFERENCES users (id),
    policy_id    INT    NOT NULL REFERENCES policies (id),
    assessor_id  INT    REFERENCES users (id),
    request_date DATE   NOT NULL,
    status       VARCHAR(20)
);

-- Таблица результатов оценки
CREATE TABLE assessment_results
(
    id          serial not null unique,
    request_id  INT    NOT NULL REFERENCES assessment_requests (id) ON DELETE CASCADE,
    assessor_id INT    REFERENCES users (id),
    result_text TEXT,
    value       int,
    result_date DATE
);

INSERT INTO users (name, username, password_hash, role, gender, phone, email, passport_number, age, info)
values('admin', 'admin',
       '667364666a73646e61666e31333132333132345f2b5fd033e22ae348aeb5660fc2140aec35850c4da997',
       'admin', 'male', '81234567890', 'admin', '1234 567890', 20, 'admin'),
      ('assessor', 'assessor',
       '667364666a73646e61666e31333132333132345f2b5f91029b72357582b94736f518ad64e6b1f31170a7',
       'assessor', 'male', '81234567890', 'assessor', '1234 567890', 20, 'assessor'),
      ('client', 'client',
       '667364666a73646e61666e31333132333132345f2b5fd2a04d71301a8915217dd5faf81d12cffd6cd958',
       'client', 'male', '81234567890', 'client', '1234 567890', 20, 'client');