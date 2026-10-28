-- ============================================================================
-- PairUp Jaccard Scoring, Vector Similarity & Proximity Match Ranking
-- ============================================================================

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v1(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v2(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v3(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v4(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v5(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v6(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v7(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v8(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v9(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v10(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v11(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v12(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v13(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v14(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v15(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v16(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v17(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v18(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v19(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v20(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v21(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v22(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v23(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v24(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v25(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v26(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v27(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v28(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v29(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v30(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v31(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v32(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v33(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v34(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v35(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v36(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v37(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v38(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v39(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pairup_calculate_match_compatibility_v40(
    user_a_id UUID,
    user_b_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    shared_count INTEGER := 0;
    total_count INTEGER := 0;
    jaccard_score NUMERIC := 0.0;
    intention_weight NUMERIC := 1.0;
    final_score NUMERIC := 50.0;
BEGIN
    SELECT count(*) INTO shared_count
    FROM profile_interests a
    JOIN profile_interests b ON a.interest_id = b.interest_id
    WHERE a.user_id = user_a_id AND b.user_id = user_b_id;

    SELECT count(DISTINCT interest_id) INTO total_count
    FROM profile_interests
    WHERE user_id IN (user_a_id, user_b_id);

    IF total_count > 0 THEN
        jaccard_score := (shared_count::NUMERIC / total_count::NUMERIC) * 100;
    END IF;

    final_score := LEAST(99.0, GREATEST(40.0, 40.0 + (jaccard_score * 0.5) + (shared_count * 5.0)));
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

