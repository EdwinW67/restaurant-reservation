select count(*) as aantal
from reservations

select *
from reservations r
where r.created_at <= '2026-01-14 12:32:43.367285'