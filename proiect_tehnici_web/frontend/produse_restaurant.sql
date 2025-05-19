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

-- INSERT into produse (nume, descriere, categorie_produs, specific_mesei_zilei, pret, gramaj, calorii, ingrediente, contine_alcool, imagine) VALUES 
-- ('Pizza Margherita', 'Pizza cu sos de rosii, mozzarella si busuioc', 'mancare', 'oricand', 25.50, 500, 800, '{faina, sos de rosii, mozzarella, busuioc}', FALSE, 'https://example.com/pizza-margherita.jpg'),
-- ('Coca-Cola', 'Bautura racoritoare carbogazoasa', 'bautura', 'oricand', 5.00, 330, 140, '{apa, zahar, dioxid de carbon}', TRUE, 'https://example.com/coca-cola.jpg'),
-- ('Salata Caesar', 'Salata cu pui, crutoane si dressing Caesar', 'mancare', 'oricand', 20.00, 300, 350, '{salata verde, pui, crutoane}', FALSE, 'https://example.com/salata-caesar.jpg'),
-- ('Pasta Carbonara', 'Paste cu sos Carbonara si parmezan', 'mancare', 'oricand', 30.00, 400, 600, '{paste, oua, parmezan}', FALSE, 'https://example.com/pasta-carbonara.jpg'),
-- ('Tiramisu', 'Desert italian cu cafea si mascarpone', 'altceva', 'oricand', 15.00, 200, 300, '{cafea, mascarpone}', FALSE, 'https://example.com/tiramisu.jpg'),
-- ('Supa de pui', 'Supa calda cu carne de pui si legume', 'mancare', 'oricand', 18.00, 250, 200, '{pui, morcovi, telina}', FALSE, 'https://example.com/supa-de-pui.jpg'),
-- ('Vin rosu', 'Bautura alcoolica din struguri rosii', 'bautura', 'oricand', 40.00, 750, 600, '{struguri rosii}', TRUE, 'https://example.com/vin-rosu.jpg'),
-- ('Burger cu carne de vita', 'Burger cu carne de vita si branza cheddar', 'mancare', 'oricand', 35.00, 450, 700, '{carne de vita, branza cheddar}', FALSE, 'https://example.com/burger-cu-carne-de-vita.jpg'),
-- ('Pasta Bolognese', 'Paste cu sos Bolognese si carne tocata', 'mancare', 'oricand', 28.00, 400, 650, '{paste, carne tocata}', FALSE, 'https://example.com/pasta-bolognese.jpg'),
-- ('Apfelstrudel', 'Desert cu mere si aluat de placinta', 'altceva', 'oricand', 12.00, 150, 250, '{mere, aluat}', FALSE, 'https://example.com/apfelstrudel.jpg'),
-- ('Supa de rosii', 'Supa rece cu rosii si busuioc', 'mancare', 'oricand', 16.00, 200, 150, '{rosii, busuioc}', FALSE, 'https://example.com/supa-de-rosii.jpg'),
-- ('Whiskey', 'Bautura alcoolica distilata din cereale', 'bautura', 'oricand', 50.00, 700, 700, '{cereale}', TRUE, 'https://example.com/whiskey.jpg'),
-- ('Salata de fructe', 'Salata proaspata cu fructe de sezon', 'altceva', 'oricand', 10.00, 200, 100, '{fructe}', FALSE, 'https://example.com/salata-de-fructe.jpg'),
-- ('Pasta Alfredo', 'Paste cu sos Alfredo si parmezan', 'mancare', 'oricand', 32.00, 400, 600, '{paste, smantana, parmezan}', FALSE, 'https://example.com/pasta-alfredo.jpg'),
-- ('Sangria', 'Bautura alcoolica cu vin si fructe', 'bautura', 'oricand', 30.00, 500, 500, '{vin, fructe}', TRUE, 'https://example.com/sangria.jpg'),
-- ('Cheesecake', 'Desert cu branza si biscuiti', 'altceva', 'oricand', 18.00, 250, 350, '{branza, biscuiti}', FALSE, 'https://example.com/cheesecake.jpg');

INSERT INTO produse (nume, descriere, categorie_produs, specific_mesei_zilei, pret, gramaj, calorii, ingrediente, contine_alcool, imagine) VALUES
('Omletă cu legume', 'Omletă pufoasă cu legume proaspete', 'mancare', 'mic-dejun', 15.00, 200, 250, ARRAY['ouă', 'ardei', 'ceapă', 'roșii'], FALSE, 'omleta cu legume.jpg'),
('Ciorbă de burtă', 'Ciorbă tradițională românească', 'mancare', 'pranz', 20.00, 300, 350, ARRAY['burtă de vită', 'smântână', 'ouă', 'oțet'], FALSE, 'ciorba de burta.jpg'),
('Sarmale cu mămăliguță', 'Sarmale în foi de varză cu mămăligă', 'mancare', 'pranz', 25.00, 400, 500, ARRAY['carne tocată', 'orez', 'varză murată', 'mălai'], FALSE, 'sarmale cu mamaliguta.jpg'),
('Friptură de pui la grătar', 'Piept de pui fraged la grătar', 'mancare', 'oricand', 22.00, 250, 300, ARRAY['piept de pui', 'condimente'], FALSE, 'friptura de pui la gratar.jpg'),
('Salată Caesar', 'Salată cu pui, crutoane și parmezan', 'mancare', 'oricand', 18.00, 200, 280, ARRAY['salată verde', 'piept de pui', 'parmezan', 'crutoane'], FALSE, 'salata caesar.jpg'),
('Paste Carbonara', 'Paste cu sos cremos și bacon', 'mancare', 'cina', 24.00, 300, 600, ARRAY['paste', 'ouă', 'bacon', 'parmezan'], FALSE, 'paste carbonara.jpg'),
('Tocăniță de vită', 'Tocăniță de vită cu legume', 'mancare', 'cina', 26.00, 350, 550, ARRAY['carne de vită', 'morcovi', 'ceapă', 'cartofi'], FALSE, 'tocanita de vita.jpg'),
('Supă cremă de ciuperci', 'Supă fină de ciuperci cu smântână', 'mancare', 'pranz', 16.00, 250, 200, ARRAY['ciuperci', 'smântână', 'ceapă'], FALSE, 'supa crema de ciuperci.jpg'),
('Pește la grătar', 'File de pește cu lămâie și ierburi', 'mancare', 'cina', 28.00, 300, 400, ARRAY['pește', 'lămâie', 'ierburi aromatice'], FALSE, 'peste la gratar.jpg'),
('Clătite cu brânză', 'Clătite umplute cu brânză sărată', 'mancare', 'mic-dejun', 14.00, 200, 350, ARRAY['clătite', 'brânză sărată', 'piept de pui'], FALSE, 'clatite cu branza.jpg'),

('Cafea espresso', 'Cafea tare, servită fierbinte', 'bautura', 'mic-dejun', 8.00, 50, 5, ARRAY['cafea măcinată', 'apă'], FALSE, 'cafea espresso.jpg'),
('Ceai verde', 'Ceai verde infuzat', 'bautura', 'mic-dejun', 7.00, 250, 0, ARRAY['frunze de ceai verde', 'apă'], FALSE, 'ceai verde.jpg'),
('Suc de portocale', 'Suc proaspăt stors de portocale', 'bautura', 'oricand', 10.00, 300, 120, ARRAY['portocale'], FALSE, 'suc de portocale.jpg'),
('Apă plată', 'Apă minerală plată', 'bautura', 'oricand', 5.00, 500, 0, ARRAY['apă'], FALSE, 'apa plata.jpg'),
('Bere blondă', 'Bere blondă la draft', 'bautura', 'oricand', 12.00, 400, 150, ARRAY['apă', 'malț', 'hamei', 'drojdie'], TRUE, 'bere blonda.jpg'),
('Vin roșu sec', 'Vin roșu sec, servit la pahar', 'bautura', 'cina', 15.00, 150, 125, ARRAY['struguri fermentați'], TRUE, 'vin rosu sec.jpg'),
('Limonadă cu mentă', 'Limonadă răcoritoare cu mentă', 'bautura', 'oricand', 9.00, 300, 90, ARRAY['lămâie', 'zahăr', 'mentă', 'apă'], FALSE, 'limonada cu menta.jpg'),
('Smoothie de fructe', 'Băutură cremoasă din fructe', 'bautura', 'mic-dejun', 12.00, 350, 180, ARRAY['banane', 'căpșuni', 'iaurt'], FALSE, 'smoothie de fructe.jpg'),
('Cocktail Mojito', 'Cocktail cubanez cu rom și mentă', 'bautura', 'cina', 18.00, 250, 200, ARRAY['rom', 'mentă', 'zahăr', 'lămâie', 'apă minerală'], TRUE, 'cocktail mojito.jpg'),
('Ciocolată caldă', 'Băutură caldă cu ciocolată', 'bautura', 'oricand', 10.00, 250, 220, ARRAY['lapte', 'ciocolată', 'zahăr'], FALSE, 'ciocolata calda.jpg'),

('Cheesecake cu fructe', 'Prăjitură cu cremă de brânză și fructe', 'altceva', 'oricand', 16.00, 150, 350, ARRAY['brânză', 'zahăr', 'ouă', 'fructe'], FALSE, 'cheesecake cu fructe.jpg'),
('Tiramisu', 'Desert italian cu cafea și mascarpone', 'altceva', 'cina', 18.00, 200, 400, ARRAY['pișcoturi', 'cafea', 'mascarpone', 'cacao'], TRUE, 'tiramisu.jpg'),
('Înghețată de vanilie', 'Înghețată cremoasă cu aromă de vanilie', 'altceva', 'pranz', 10.00, 100, 200, ARRAY['lapte', 'zahăr', 'vanilie'], FALSE, 'inghetata de vanilie.jpg'),
('Clătite cu ciocolată', 'Clătite umplute cu cremă de ciocolată', 'altceva', 'oricand', 14.00, 200, 400, ARRAY['clătite', 'ciocolată', 'zahăr'], FALSE, 'clatite cu ciocolata.jpg'),
('Papanași cu smântână și dulceață', 'Papanași prăjiți serviți cu smântână și dulceață de afine', 'altceva', 'mic-dejun', 18.00, 250, 500, ARRAY['brânză de vaci', 'ouă', 'făină', 'smântână', 'dulceață de afine'], FALSE, 'papanasi cu smantana si dulceata.jpg'),
('Tort de ciocolată', 'Tort bogat cu ciocolată neagră și cremă ganache', 'altceva', 'oricand', 20.00, 150, 450, ARRAY['făină', 'ouă', 'zahăr', 'ciocolată neagră', 'smântână'], FALSE, 'tort de ciocolata.jpg'),
('Mousse de mango', 'Desert fin de mango cu textură aerată', 'altceva', 'mic-dejun', 16.00, 120, 300, ARRAY['mango', 'frișcă', 'gelatină', 'zahăr'], FALSE, 'mousse de mango.jpg'),
('Sos de usturoi', 'Sos cremos de usturoi, perfect pentru fripturi', 'altceva', 'oricand', 5.00, 50, 100, ARRAY['usturoi', 'maioneză', 'smântână'], FALSE, 'sos de usturoi.jpg'),
('Sos picant de roșii', 'Sos picant pe bază de roșii, ideal pentru pizza', 'altceva', 'oricand', 5.00, 50, 80, ARRAY['roșii', 'ardei iute', 'usturoi', 'condimente'], FALSE, 'sos picant de rosii.jpg'),
('Sos de smântână și mărar', 'Sos răcoritor de smântână cu mărar proaspăt', 'altceva', 'oricand', 5.00, 50, 90, ARRAY['smântână', 'mărar', 'lămâie'], FALSE, 'sos de smantana si marar.jpg'),
('Sos de muștar dulce', 'Sos de muștar cu note dulci, potrivit pentru carne', 'altceva', 'oricand', 5.00, 50, 110, ARRAY['muștar', 'miere', 'oțet'], FALSE, 'sos de mustar dulce.jpg'),
('Sos de ciocolată', 'Sos dens de ciocolată pentru deserturi', 'altceva', 'oricand', 6.00, 50, 150, ARRAY['ciocolată', 'smântână', 'zahăr'], FALSE, 'sos de ciocolata.jpg');
