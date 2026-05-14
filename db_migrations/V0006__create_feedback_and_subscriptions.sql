CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL DEFAULT 'question',
  name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);