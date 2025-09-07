create table idempotency_keys
(
    `key`         varchar(255)                               not null
        primary key,
    target_type   varchar(255)                               not null comment 'Tipo de recurso: order_confirmation, etc.',
    target_id     varchar(255)                               not null,
    status        enum ('processing', 'completed', 'failed') not null,
    response_body json                                       null,
    created_at    timestamp default CURRENT_TIMESTAMP        null,
    expires_at    timestamp                                  null
);

create table orders
(
    id          int auto_increment
        primary key,
    customer_id int                                       not null,
    status      enum ('CREATED', 'CONFIRMED', 'CANCELED') not null,
    total       int                                       not null comment 'Total del pedido en centavos',
    created_at  timestamp default CURRENT_TIMESTAMP       null,
    deleted_at  timestamp                                 null
);

create table products
(
    id         int auto_increment
        primary key,
    name       varchar(255)                        not null,
    price      int                                 not null comment 'Precio en centavos para evitar problemas de precisión',
    stock      int       default 0                 not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    deleted_at timestamp                           null
);

create table order_items
(
    id         int auto_increment
        primary key,
    order_id   int not null,
    product_id int not null,
    qty        int not null,
    unit_price int not null comment 'Precio del producto en el momento de la compra',
    subtotal   int not null comment 'Subtotal del item en centavos',
    constraint order_items_ibfk_1
        foreign key (order_id) references orders (id),
    constraint order_items_ibfk_2
        foreign key (product_id) references products (id)
);

create index order_id
    on order_items (order_id);

create index product_id
    on order_items (product_id);

create table customers
(
    id         bigint unsigned auto_increment
        primary key,
    name       varchar(255)                        not null,
    email      varchar(255)                        not null,
    phone      varchar(50)                         null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp                           null,
    constraint uk_customers_email
        unique (email)
);

