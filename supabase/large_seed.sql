-- Large Realistic Global Job Dataset

-- Visa Pathways
insert into public.visa_pathways (country, visa_name, processing_time, requirements)
values
('United Kingdom', 'Skilled Worker Visa', '4-8 weeks', 'English test, job offer, sponsorship'),
('Germany', 'EU Blue Card', '6-12 weeks', 'Degree, job contract, minimum salary threshold'),
('Canada', 'Temporary Foreign Worker', '8-16 weeks', 'LMIA, job offer'),
('Australia', 'Skilled Migration Visa', '3-6 months', 'Points system, skills assessment'),
('UAE', 'Employment Visa', '2-6 weeks', 'Employer sponsorship'),
('Poland', 'Work Permit Type A', '4-10 weeks', 'Employer declaration'),
('Japan', 'Specified Skilled Worker', '6-12 weeks', 'Skills test + language'),
('Saudi Arabia', 'Work Visa', '4-8 weeks', 'Employer sponsorship');

-- Bulk Jobs
insert into public.jobs (title, category_id, country, salary_range, requirements, visa_type, sponsorship_available, contract_type, experience_level, is_active)
select
  j.title,
  c.id,
  j.country,
  j.salary_range,
  j.requirements,
  j.visa_type,
  true,
  j.contract_type,
  j.experience_level,
  true
from (
  values
  -- UK
  ('Care Assistant','caregiving','United Kingdom','£2,000 - £2,600','Care experience preferred','Skilled Worker Visa','Full-time','Entry'),
  ('NHS Support Worker','healthcare','United Kingdom','£2,200 - £2,800','Healthcare background','Skilled Worker Visa','Full-time','Mid'),
  ('Hotel Cleaner','cleaning','United Kingdom','£1,800 - £2,200','Basic English','Skilled Worker Visa','Full-time','Entry'),

  -- Germany
  ('Electrician','skilled-trades','Germany','€2,500 - €3,500','Trade certificate','EU Blue Card','Full-time','Mid'),
  ('Mechanical Technician','skilled-trades','Germany','€2,800 - €3,800','Technical diploma','EU Blue Card','Full-time','Mid'),

  -- Canada
  ('Welder','skilled-trades','Canada','CAD 3,200 - 4,800','Trade certification','Temporary Foreign Worker','Full-time','Mid'),
  ('Warehouse Worker','logistics','Canada','CAD 2,800 - 3,400','Physically fit','Temporary Foreign Worker','Full-time','Entry'),

  -- UAE
  ('Security Guard','security','UAE','AED 1,800 - 2,400','Security experience','Employment Visa','Full-time','Entry'),
  ('Restaurant Waiter','hospitality','UAE','AED 1,500 - 2,200','Customer service skills','Employment Visa','Full-time','Entry'),

  -- Qatar
  ('Construction Laborer','construction','Qatar','QAR 1,800 - 2,500','Physically fit','Work Visa','Full-time','Entry'),

  -- Saudi
  ('Truck Driver','logistics','Saudi Arabia','SAR 2,500 - 3,500','Valid license','Work Visa','Full-time','Mid'),

  -- Australia
  ('Registered Nurse','healthcare','Australia','AUD 4,000 - 6,000','Nursing license','Skilled Migration Visa','Full-time','Senior'),
  ('Carpenter','skilled-trades','Australia','AUD 3,800 - 5,200','Trade certification','Skilled Migration Visa','Full-time','Mid'),

  -- Japan
  ('Factory Worker','logistics','Japan','¥220,000 - ¥280,000','Basic Japanese preferred','Specified Skilled Worker','Full-time','Entry'),
  ('Caregiver','caregiving','Japan','¥230,000 - ¥300,000','Care training','Specified Skilled Worker','Full-time','Entry')

) as j(title, cat_slug, country, salary_range, requirements, visa_type, contract_type, experience_level)
join public.job_categories c on c.slug = j.cat_slug;
