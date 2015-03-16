

SELECT * FROM (


SELECT t2.name, t2.imageUrl, tb_smsStore.* FROM tb_smsStore


LEFT JOIN 
(
SELECT userId, phoneNumber, max(tb_storedContacts.name) AS 'name', max(tb_storedContacts.imageUrl) AS imageUrl
	FROM tb_storedContacts	
	GROUP BY phoneNumber

) 
AS t2 ON
tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber AND
tb_smsStore.userId = t2.userId

WHERE tb_smsStore.smsContext = 'inbox'

UNION ALL

SELECT t2.name, t2.imageUrl, tb_smsStore.* FROM tb_smsStore


LEFT JOIN 
(
SELECT userId, phoneNumber, max(tb_storedContacts.name) AS 'name' , max(tb_storedContacts.imageUrl) AS imageUrl
	FROM tb_storedContacts	
	GROUP BY phoneNumber

) 
AS t2 ON
tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber AND
tb_smsStore.userId = t2.userId

WHERE tb_smsStore.smsContext = 'sent'
) tt3
