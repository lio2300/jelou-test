insert into customers (id, name, email, phone, created_at, deleted_at) values (1, 'Julio', 'julio@jelou.com', '0959881342', now(), null);

insert into products (id, name, price, stock, created_at, deleted_at) values (1,'Carrito',101,9,'2025-09-06 03:27:00', null);
insert into orders (id, customer_id, status, total, created_at, deleted_at) values (5,1,'CONFIRMED',1010,'2025-09-06 03:44:58', null);
insert into order_items (id, order_id, product_id, qty, unit_price, subtotal) values (1,5,1,10,101,1010);
insert into idempotency_keys (`key`, target_type, target_id, status, response_body, created_at, expires_at) values (5,'order_confirmation',5,'completed','{"message": "Order confirmed successfully.", "orderId": "5"}','2025-09-06 04:01:36', null);
