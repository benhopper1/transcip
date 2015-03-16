SELECT t2.*, tb_smsStore.* FROM tb_smsStore


LEFT JOIN 
(
SELECT userId, phoneNumber, max(tb_storedContacts.name), max(tb_storedContacts.imageUrl)
	FROM tb_storedContacts	
	GROUP BY phoneNumber

) 
AS t2 ON
tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber AND
tb_smsStore.userId = t2.userId

WHERE tb_smsStore.smsContext = 'inbox'