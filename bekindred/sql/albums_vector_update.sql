CREATE FUNCTION likes_vector_update() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        new.search_index = to_tsvector('pg_catalog.english', COALESCE(NEW.name, ''));
    END IF;
    IF TG_OP = 'UPDATE' THEN
        IF NEW.name <> OLD.name THEN
            new.search_index = to_tsvector('pg_catalog.english', COALESCE(NEW.name, ''));
        END IF;
    END IF;
    RETURN NEW;
END
$$ LANGUAGE 'plpgsql';


CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON django_facebook_facebooklike
FOR EACH ROW EXECUTE PROCEDURE likes_vector_update();