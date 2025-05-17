DROP TYPE IF EXISTS categorie_produse;
DROP TYPE IF EXISTS specifice_mesei_zilei;

CREATE TYPE categorie_produse AS ENUM('mancare', 'bautura', 'altceva');
CREATE TYPE specifice_mesei_zilei AS ENUM('mic-dejun', 'pranz', 'cina', 'oricand');



CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   categorie_produs categorie_produse DEFAULT 'mancare',
   specific_mesei_zilei specifice_mesei_zilei DEFAULT 'oricand',
   pret NUMERIC(8,2) NOT NULL,
   gramaj INT NOT NULL CHECK (gramaj>=0),   
   calorii INT NOT NULL CHECK (calorii>=0),
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   ingrediente VARCHAR [],
   contine_alcool BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300)
);

INSERT into produse (nume, descriere, categorie_produs, specific_mesei_zilei, pret, gramaj, calorii, ingrediente, contine_alcool, imagine) VALUES 
('Pizza Margherita', 'Pizza cu sos de rosii, mozzarella si busuioc', 'mancare', 'oricand', 25.50, 500, 800, '{faina, sos de rosii, mozzarella, busuioc}', FALSE, 'https://example.com/pizza-margherita.jpg'),
('Coca-Cola', 'Bautura racoritoare carbogazoasa', 'bautura', 'oricand', 5.00, 330, 140, '{apa, zahar, dioxid de carbon}', TRUE, 'https://example.com/coca-cola.jpg'),
('Salata Caesar', 'Salata cu pui, crutoane si dressing Caesar', 'mancare', 'oricand', 20.00, 300, 350, '{salata verde, pui, crutoane}', FALSE, 'https://example.com/salata-caesar.jpg'),
('Pasta Carbonara', 'Paste cu sos Carbonara si parmezan', 'mancare', 'oricand', 30.00, 400, 600, '{paste, oua, parmezan}', FALSE, 'https://example.com/pasta-carbonara.jpg'),
('Tiramisu', 'Desert italian cu cafea si mascarpone', 'altceva', 'oricand', 15.00, 200, 300, '{cafea, mascarpone}', FALSE, 'https://example.com/tiramisu.jpg'),
('Supa de pui', 'Supa calda cu carne de pui si legume', 'mancare', 'oricand', 18.00, 250, 200, '{pui, morcovi, telina}', FALSE, 'https://example.com/supa-de-pui.jpg'),
('Vin rosu', 'Bautura alcoolica din struguri rosii', 'bautura', 'oricand', 40.00, 750, 600, '{struguri rosii}', TRUE, 'https://example.com/vin-rosu.jpg'),
('Burger cu carne de vita', 'Burger cu carne de vita si branza cheddar', 'mancare', 'oricand', 35.00, 450, 700, '{carne de vita, branza cheddar}', FALSE, 'https://example.com/burger-cu-carne-de-vita.jpg'),
('Pasta Bolognese', 'Paste cu sos Bolognese si carne tocata', 'mancare', 'oricand', 28.00, 400, 650, '{paste, carne tocata}', FALSE, 'https://example.com/pasta-bolognese.jpg'),
('Apfelstrudel', 'Desert cu mere si aluat de placinta', 'altceva', 'oricand', 12.00, 150, 250, '{mere, aluat}', FALSE, 'https://example.com/apfelstrudel.jpg'),
('Supa de rosii', 'Supa rece cu rosii si busuioc', 'mancare', 'oricand', 16.00, 200, 150, '{rosii, busuioc}', FALSE, 'https://example.com/supa-de-rosii.jpg'),
('Whiskey', 'Bautura alcoolica distilata din cereale', 'bautura', 'oricand', 50.00, 700, 700, '{cereale}', TRUE, 'https://example.com/whiskey.jpg'),
('Salata de fructe', 'Salata proaspata cu fructe de sezon', 'altceva', 'oricand', 10.00, 200, 100, '{fructe}', FALSE, 'https://example.com/salata-de-fructe.jpg'),
('Pasta Alfredo', 'Paste cu sos Alfredo si parmezan', 'mancare', 'oricand', 32.00, 400, 600, '{paste, smantana, parmezan}', FALSE, 'https://example.com/pasta-alfredo.jpg'),
('Sangria', 'Bautura alcoolica cu vin si fructe', 'bautura', 'oricand', 30.00, 500, 500, '{vin, fructe}', TRUE, 'https://example.com/sangria.jpg'),
('Cheesecake', 'Desert cu branza si biscuiti', 'altceva', 'oricand', 18.00, 250, 350, '{branza, biscuiti}', FALSE, 'https://example.com/cheesecake.jpg');