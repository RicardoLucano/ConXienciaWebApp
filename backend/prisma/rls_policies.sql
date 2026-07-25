-- Enable Row-Level Security (RLS) across all multi-tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- ── 1. Users Policies ────────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own profile"
  ON users FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── 2. Customers Policies ────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own customers"
  ON customers FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 3. Purchase History Policies ─────────────────────────────────────────────
CREATE POLICY "Users can manage their customers purchase records"
  ON purchase_history FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id AND customers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id AND customers.user_id = auth.uid()
    )
  );

-- ── 4. Customer Leads Policies ───────────────────────────────────────────────
CREATE POLICY "Users can manage their own customer leads"
  ON customer_leads FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 5. Partners Policies ─────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own partners"
  ON partners FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 6. Partner Leads Policies ────────────────────────────────────────────────
CREATE POLICY "Users can manage their own partner leads"
  ON partner_leads FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 7. Notifications Policies ────────────────────────────────────────────────
CREATE POLICY "Users can manage their own notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 8. Resources Policies ────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own resource shortcuts"
  ON resources FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
