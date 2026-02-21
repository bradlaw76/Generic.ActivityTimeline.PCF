# Contracts

This feature does not introduce external HTTP APIs.

Contract scope for this migration is internal to the control:
- Manifest input contract (`recordId`, `entityName`, optional control inputs)
- Dataverse query/response assumptions used by service layer
- View-model contract (`ActivityNode`, `FilterState`, sentiment mapping)

If Dataverse field requirements change, update:
1. Feature spec requirements
2. Data model documentation
3. Implementation plan verification steps
