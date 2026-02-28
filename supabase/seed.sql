-- GlobalWorks Seed Data (Realistic destinations hiring foreign workers)
-- Run in Supabase SQL Editor

-- Categories
insert into public.job_categories (name, slug, icon)
values
  ('Healthcare', 'healthcare', 'stethoscope'),
  ('Caregiving', 'caregiving', 'heart-handshake'),
  ('Construction', 'construction', 'hard-hat'),
  ('Hospitality', 'hospitality', 'utensils'),
  ('Logistics', 'logistics', 'truck'),
  ('Cleaning', 'cleaning', 'spray-can'),
  ('Skilled Trades', 'skilled-trades', 'wrench'),
  ('IT & Tech', 'it-tech', 'laptop')
on conflict (slug) do nothing;

-- Destinations
insert into public.destinations (name, slug, highlights, image_url)
values
  ('United Kingdom', 'uk', 'Care, NHS roles, hospitality, trades', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80'),
  ('Germany', 'germany', 'Skilled trades, healthcare, engineering', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80'),
  ('Canada', 'canada', 'Healthcare, logistics, construction', 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80'),
  ('Poland', 'poland', 'Warehouses, factories, drivers', 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=80'),
  ('UAE', 'uae', 'Hospitality, security, logistics', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'),
  ('Qatar', 'qatar', 'Construction, security, hospitality', 'https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=80'),
  ('Saudi Arabia', 'saudi', 'Drivers, technicians, hospitality', 'https://images.unsplash.com/photo-1518684079-6c6d8f9b95d0?auto=format&fit=crop&w=1200&q=80'),
  ('Australia', 'australia', 'Trades, care, hospitality (testing)', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80'),
  ('Japan', 'japan', 'Caregiving, hospitality, factory work (testing)', 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80')
on conflict (slug) do nothing;

-- Jobs (joins job_categories by slug)
insert into public.jobs (title, category_id, country, salary_range, requirements, is_active)
select
  j.title,
  c.id as category_id,
  j.country,
  j.salary_range,
  j.requirements,
  true
from (
  values
    ('Care Assistant / Support Worker', 'caregiving', 'United Kingdom', '£1,900 - £2,600', 'English required. Caring attitude. Experience preferred.'),
    ('NHS Healthcare Assistant', 'healthcare', 'United Kingdom', '£2,000 - £2,800', 'Healthcare training preferred. English required.'),
    ('Warehouse Associate', 'logistics', 'Poland', 'PLN 4,500 - 6,500', 'Physically fit, reliable. Shifts available.'),
    ('Hotel Housekeeper', 'cleaning', 'UAE', 'AED 1,200 - 1,800', 'Cleaning experience preferred. Attention to detail.'),
    ('Restaurant Waiter / Waitress', 'hospitality', 'Qatar', 'QAR 1,600 - 2,400', 'Basic English. Customer service.'),
    ('Construction General Worker', 'construction', 'Saudi Arabia', 'SAR 2,000 - 3,200', 'Physically fit. Safety minded.'),
    ('Electrician', 'skilled-trades', 'Germany', '€2,400 - €3,300', 'Trade certificate + experience. Basic German helpful.'),
    ('Welder / Fabricator', 'skilled-trades', 'Canada', 'CAD 3,200 - 4,600', 'Trade experience. Safety certs beneficial.'),
    ('Truck Driver (Distribution)', 'logistics', 'Australia', 'AUD 4,000 - 6,000', 'Valid license. Experience 2+ years.'),
    ('Junior Web Support (Entry)', 'it-tech', 'Canada', 'CAD 2,800 - 3,800', 'Basic HTML/CSS, communication, willingness to learn.')
) as j(title, cat_slug, country, salary_range, requirements)
join public.job_categories c on c.slug = j.cat_slug;

-- Sample visa inquiries (anonymous)
insert into public.visa_inquiries (user_id, full_name, email, phone, visa_type, destination, message, status)
values
  (null, 'Test Applicant 1', 'test1@example.com', '+256700000201', 'Work', 'United Kingdom', 'Interested in caregiving jobs. What are requirements?', 'new'),
  (null, 'Test Applicant 2', 'test2@example.com', '+254700000202', 'Work', 'Germany', 'I have electrician experience. How do I start?', 'in_review'),
  (null, 'Test Applicant 3', 'test3@example.com', '+233200000203', 'Work', 'Canada', 'Looking for welding roles and visa guidance.', 'resolved');
