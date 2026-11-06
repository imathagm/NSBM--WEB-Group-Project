USE nsbm_sportshub;

CREATE TABLE IF NOT EXISTS sportshub_users (

    user_id BIGINT UNSIGNED
        NOT NULL AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(254)
        NOT NULL UNIQUE,

    password_hash VARCHAR(255)
        NOT NULL,

    created_at TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS password_reset_tokens (

    reset_id BIGINT UNSIGNED
        NOT NULL AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED
        NOT NULL,

    token_hash CHAR(64)
        NOT NULL UNIQUE,

    expires_at DATETIME
        NOT NULL,

    used_at DATETIME
        NULL,

    created_at TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    KEY idx_password_reset_user_expiry
        (user_id, expires_at),

    CONSTRAINT fk_password_reset_user

        FOREIGN KEY (user_id)

        REFERENCES sportshub_users(user_id)

        ON DELETE CASCADE

) ENGINE=InnoDB;