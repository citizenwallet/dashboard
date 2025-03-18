-- Organizations that issue tenders
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- government, private, etc.
    contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractors who bid on tenders
CREATE TABLE contractors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    business_type TEXT, -- construction, electrical, etc.
    contact_email TEXT,
    experience_years INTEGER,
    license_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- The actual tenders
CREATE TABLE tenders (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    title TEXT NOT NULL,
    description TEXT,
    specifications JSONB, -- detailed requirements
    scope_of_work TEXT,
    budget_range NUMRANGE, -- min-max budget
    submission_deadline TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'open', -- open, closed, awarded, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bids submitted by contractors
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    tender_id INTEGER REFERENCES tenders(id),
    contractor_id INTEGER REFERENCES contractors(id),
    amount DECIMAL NOT NULL,
    proposal_details JSONB, -- detailed proposal
    status TEXT NOT NULL DEFAULT 'submitted', -- submitted, under_review, accepted, rejected
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tender_id, contractor_id) -- one bid per contractor per tender
);

-- Awarded contracts
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    tender_id INTEGER REFERENCES tenders(id),
    contractor_id INTEGER REFERENCES contractors(id),
    bid_id INTEGER REFERENCES bids(id),
    start_date DATE,
    end_date DATE,
    value DECIMAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, active, completed, terminated
    terms_and_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);