-- Who may read and write the retail catalog. Documented, not run: grants
-- need Unity Catalog, and so a workspace. tools/grant_matrix.py models them.

-- finance reads the gold layer, and nothing else
GRANT USE CATALOG ON CATALOG retail TO `finance`;
GRANT USE SCHEMA, SELECT ON SCHEMA retail.gold TO `finance`;

-- engineers build bronze and silver
GRANT USE CATALOG ON CATALOG retail TO `data-engineers`;
GRANT ALL PRIVILEGES ON SCHEMA retail.bronze TO `data-engineers`;
GRANT ALL PRIVILEGES ON SCHEMA retail.silver TO `data-engineers`;

-- the scheduled job reads bronze and writes silver
GRANT USE CATALOG ON CATALOG retail TO `retail-job`;
GRANT USE SCHEMA, SELECT ON SCHEMA retail.bronze TO `retail-job`;
GRANT USE SCHEMA, SELECT, MODIFY ON SCHEMA retail.silver TO `retail-job`;
