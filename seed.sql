CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL
);

INSERT INTO quotes (text) VALUES
('It''s hard to do a really good job on anything you don''t think about in the shower.'),
('The most successful people are often the ones who take the initiative.'),
('If you''re not failing occasionally, you''re probably not trying hard enough.');
