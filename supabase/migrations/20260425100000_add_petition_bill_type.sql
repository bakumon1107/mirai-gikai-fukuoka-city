alter table bills drop constraint if exists bills_bill_type_check;
alter table bills add constraint bills_bill_type_check
  check (bill_type in ('bill', 'opinion', 'resolution', 'member_bill', 'petition'));
