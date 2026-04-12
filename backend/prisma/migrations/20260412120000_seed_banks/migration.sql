-- Seed: banks
-- TODO: replace placeholder values with real bank data

INSERT INTO "banks" ("id", "name", "email", "imageUrl", "isSupportEmail") VALUES
  (uuidv7(), 'myBCA', 'bca@bca.co.id', '/images/bank/mybca.jpg', true),
  (uuidv7(), 'BCA Card', 'PasporBCA@klikbca.com', '/images/bank/bca-card.jpg', true),
  (uuidv7(), 'Jago', 'noreply@jago.com', '/images/bank/jago.jpg', true)
  ;
 