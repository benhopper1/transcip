
	SELECT userId, phoneNumber, max(tb_storedContacts.name)
	FROM tb_storedContacts	
	GROUP BY phoneNumber
	
	
