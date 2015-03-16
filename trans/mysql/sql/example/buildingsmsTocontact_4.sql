

SELECT vw_activeUser.fullName, vw_activeUser.screenImage,
t3.name,
t3.imageUrl,
t3.smsId,
t3.contactName,
t3.contactPhoneNumber,
t3.date,
t3.dateSent,
t3.thread,
t3.read,
t3.smsContext,
t3.userId,
t3.body





FROM (


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
) t3
LEFT JOIN vw_activeUser ON
t3.userId = vw_activeUser.id

