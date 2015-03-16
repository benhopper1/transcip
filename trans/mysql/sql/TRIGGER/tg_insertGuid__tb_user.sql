CREATE TRIGGER tg_insertGuid__tb_user
	BEFORE INSERT ON tb_user
		FOR EACH ROW 
			BEGIN
				SET NEW.userGuid = UUID();
			END;