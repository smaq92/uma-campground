-- function to filter available campsites

create or replace function get_available_campsites(
  p_check_in date,
  p_check_out date,
  p_campers int,
  p_camp_type int
)
returns table (
  id bigint,
  name text,
  image text,
  camp_type_id bigint,
  price int,
  max_campers int,
  type_name text
)
language sql
as $$
  select
    c.id,
    c.name,
    c.image_url,
    c.camp_type_id,
    ct.price_per_night,
    ct.max_campers,
    ct.name
  from campsites c
  join camp_types ct on ct.id = c.camp_type_id
  where c.camp_type_id = p_camp_type
    and ct.max_campers >= p_campers
    and not exists (
      select 1
      from bookings b
      where b.site_id = c.id
        and b.check_in < p_check_out
        and b.check_out > p_check_in
    )
  order by c.name asc;
$$;