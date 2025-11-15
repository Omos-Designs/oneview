-- Create lookup tables for credit cards, subscriptions, and bank institutions
-- These tables are used for autocomplete/dropdown suggestions with logo domains

-- Create credit_card_brands table
CREATE TABLE IF NOT EXISTS public.credit_card_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscription_services table
CREATE TABLE IF NOT EXISTS public.subscription_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bank_institutions table
CREATE TABLE IF NOT EXISTS public.bank_institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.credit_card_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_institutions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (these are public lookup data)
-- Anyone can read these tables
CREATE POLICY "Allow public read access to credit card brands"
  ON public.credit_card_brands FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to subscription services"
  ON public.subscription_services FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to bank institutions"
  ON public.bank_institutions FOR SELECT
  USING (true);

-- Insert credit card brands (29 cards)
INSERT INTO public.credit_card_brands (name, domain) VALUES
  ('American Express', 'americanexpress.com'),
  ('Bank of America', 'bankofamerica.com'),
  ('Capital One', 'capitalone.com'),
  ('Chase', 'chase.com'),
  ('Citi', 'citi.com'),
  ('Discover', 'discover.com'),
  ('Wells Fargo', 'wellsfargo.com'),
  ('U.S. Bank', 'usbank.com'),
  ('Barclays', 'barclaycardus.com'),
  ('Apple Card', 'apple.com'),
  ('Amazon', 'amazon.com'),
  ('Target', 'target.com'),
  ('Costco', 'costco.com'),
  ('Walmart', 'walmart.com'),
  ('Best Buy', 'bestbuy.com'),
  ('Nordstrom', 'nordstrom.com'),
  ('Macy''s', 'macys.com'),
  ('Home Depot', 'homedepot.com'),
  ('Lowe''s', 'lowes.com'),
  ('Delta', 'delta.com'),
  ('Southwest', 'southwest.com'),
  ('United', 'united.com'),
  ('American Airlines', 'aa.com'),
  ('Marriott', 'marriott.com'),
  ('Hilton', 'hilton.com'),
  ('IHG', 'ihg.com'),
  ('Hyatt', 'hyatt.com'),
  ('Navy Federal', 'navyfederal.org'),
  ('USAA', 'usaa.com')
ON CONFLICT (name) DO NOTHING;

-- Insert subscription services (20 services)
INSERT INTO public.subscription_services (name, domain) VALUES
  ('Netflix', 'netflix.com'),
  ('Spotify', 'spotify.com'),
  ('Apple Music', 'apple.com'),
  ('Amazon Prime', 'amazon.com'),
  ('Disney+', 'disneyplus.com'),
  ('Hulu', 'hulu.com'),
  ('HBO Max', 'hbomax.com'),
  ('YouTube Premium', 'youtube.com'),
  ('Apple TV+', 'apple.com'),
  ('Paramount+', 'paramountplus.com'),
  ('Peacock', 'peacocktv.com'),
  ('Adobe Creative Cloud', 'adobe.com'),
  ('Microsoft 365', 'microsoft.com'),
  ('iCloud+', 'apple.com'),
  ('Google One', 'google.com'),
  ('Dropbox', 'dropbox.com'),
  ('LinkedIn Premium', 'linkedin.com'),
  ('ChatGPT Plus', 'openai.com'),
  ('GitHub', 'github.com'),
  ('Notion', 'notion.so')
ON CONFLICT (name) DO NOTHING;

-- Insert bank institutions (30 banks)
INSERT INTO public.bank_institutions (name, domain) VALUES
  ('Chase', 'chase.com'),
  ('Bank of America', 'bankofamerica.com'),
  ('Wells Fargo', 'wellsfargo.com'),
  ('Citi', 'citi.com'),
  ('U.S. Bank', 'usbank.com'),
  ('PNC Bank', 'pnc.com'),
  ('Capital One', 'capitalone.com'),
  ('TD Bank', 'td.com'),
  ('Truist', 'truist.com'),
  ('Goldman Sachs', 'marcus.com'),
  ('American Express', 'americanexpress.com'),
  ('Discover', 'discover.com'),
  ('Ally Bank', 'ally.com'),
  ('Marcus by Goldman Sachs', 'marcus.com'),
  ('SoFi', 'sofi.com'),
  ('Chime', 'chime.com'),
  ('Varo', 'varomoney.com'),
  ('Navy Federal Credit Union', 'navyfederal.org'),
  ('USAA', 'usaa.com'),
  ('Charles Schwab', 'schwab.com'),
  ('Fidelity', 'fidelity.com'),
  ('E*TRADE', 'etrade.com'),
  ('Robinhood', 'robinhood.com'),
  ('Vanguard', 'vanguard.com'),
  ('Betterment', 'betterment.com'),
  ('Wealthfront', 'wealthfront.com'),
  ('M1 Finance', 'm1.com'),
  ('Axos Bank', 'axosbank.com'),
  ('Synchrony', 'synchronybank.com'),
  ('Citizens Bank', 'citizensbank.com')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS credit_card_brands_name_idx ON public.credit_card_brands(name);
CREATE INDEX IF NOT EXISTS subscription_services_name_idx ON public.subscription_services(name);
CREATE INDEX IF NOT EXISTS bank_institutions_name_idx ON public.bank_institutions(name);
