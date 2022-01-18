\connect gxinventory_db;

-- Index for pagination
CREATE INDEX n_idx ON equipment_types USING btree(id);
CREATE INDEX n_idx ON equipments USING btree(id);
CREATE INDEX n_idx ON agents USING btree(id);

-- Add the campain name to the agents table
ALTER TABLE agents ADD COLUMN agent_campaign VARCHAR(20);

-- Add column to see if the value is deleted
ALTER TABLE equipments ADD COLUMN deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE equipment_types ADD COLUMN deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE agents ADD COLUMN deleted BOOLEAN DEFAULT FALSE;