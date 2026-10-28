-- ============================================================================
-- PairUp Audit Triggers & Immutable Change Data Capture (CDC)
-- ============================================================================

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v1()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v2()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v3()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v4()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v5()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v6()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v7()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v8()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v9()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v10()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v11()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v12()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v13()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v14()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v15()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v16()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v17()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v18()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v19()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v20()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v21()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v22()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v23()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v24()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v25()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v26()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v27()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v28()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v29()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v30()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v31()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v32()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v33()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v34()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v35()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v36()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v37()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v38()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v39()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_audit_table_trigger_func_v40()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        id,
        entity_ref,
        user_id,
        action,
        old_data,
        new_data,
        changed_at
    ) VALUES (
        gen_random_uuid(),
        TG_TABLE_NAME,
        NEW.user_id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

